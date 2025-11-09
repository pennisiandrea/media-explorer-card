export class NavigationItem {
  // Private fields
  #title = "";
  #mediaClass = "";
  #mediaContentId = "";
  #url = null;
  #lastUpdateDT = null;

  // Public fields
  /** @type {Array< NavigationItem >} */
  children = []; 
  /** @type {NavigationItem} */
  parent;
  hass;

  // Constructor
  constructor(hass,parent,title,mediaClass,mediaContentId,lastUpdateDT=null) {
    this.parent = parent;
    this.#title = title;
    this.#mediaClass = mediaClass;
    this.#mediaContentId = mediaContentId;
    this.hass = hass;
    this.#lastUpdateDT = lastUpdateDT;
  }

  // Static methods
  static fromJSON(hass, data, parent = null) {
    const newItem = new NavigationItem(hass,parent,data.title,data.mediaClass,data.mediaContentId,data.lastUpdateDT);
    if (Array.isArray(data.children)) 
      newItem.children.push(...data.children.map(childData => NavigationItem.fromJSON(hass,childData,newItem)));
    
    return newItem;
  }

  // Getters
  get title() {return this.#title}
  get mediaContentId() {return this.#mediaContentId}
  get url() {return this.#url}
  get mediaClass() {return this.#mediaClass}
  get isDirectory() {return this.#mediaClass === "directory"}
  get isFile() {return !this.isDirectory}
  get isVideo() {return this.#mediaClass === "video"}
  get isImage() {return this.#mediaClass === "image"}
  get isAudio() {return this.#mediaClass === "audio"}
  get isRoot() {return this.parent == null}
  get siblingIndex() {
    if (!this.parent) return 0;
    return this.parent.children.indexOf(this);
  }
  get firstFileChildIndex() {
    if (this.children.length == 0) return null;

    const returnVal = this.children.findIndex(item => item.isFile);
    if (returnVal == -1) return null;
    return returnVal;
  }
  get lastFileChildIndex() {
    if (this.children.length == 0) return null;

    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i].isFile) return i;
    }
    return null;
  }
  get lastUpdateDT() {return this.#lastUpdateDT}

  // Instance methods
  toJSON() {
    return {
      title: this.#title,
      mediaClass: this.#mediaClass,
      mediaContentId: this.#mediaContentId,
      lastUpdateDT: this.#lastUpdateDT,
      children: this.children.map(child => child.toJSON()),
    }
  }

  async getURL() {
    /*  returnVal
    0 = nothing changed
    1 = something changed
    99 = error      
    */
    let returnVal = 0;
    try {
      const result = await this.hass.callWS({ 
        type: "media_source/resolve_media", 
        media_content_id: this.#mediaContentId
      });

      this.#url = result.url;
      returnVal = 1;

    } catch (err) {
      console.error("Failed to get url:", err);
      this.#url = null;
      returnVal = 99;
    }
    
    return returnVal;
  }

  async loadChildren() {
    /*  returnVal
    0 = nothing changed
    1 = something changed
    99 = error      
    */
    let returnVal = 0;
    try {
      const { children: updatedChildren = []} = await this.hass.callWS({ 
          type: "media_source/browse_media", 
          media_content_id: this.#mediaContentId 
      }) ?? {};  
      
      const currentChildrenMap = new Map(this.children.map(item => [item.mediaContentId, item]));
      const updatedChildrenContentIDs = updatedChildren.map(item => item.media_content_id);

      // Removed elements
      if (this.children.some(item => !updatedChildrenContentIDs.includes(item.mediaContentId))) returnVal = 1;

      // Rebuild children
      const newChildren = updatedChildren.map(item => {
        const existing = currentChildrenMap.get(item.media_content_id);
        if (!existing ||
            existing.title !== item.title ||
            existing.mediaClass !== item.media_class) {
              returnVal = 1;
              return new NavigationItem(this.hass,this,item.title,item.media_class,item.media_content_id);
            }
        return existing;       
      });

      const sameOrder = this.children.length === newChildren.length &&
                        this.children.every((child, idx) => child.mediaContentId === newChildren[idx].mediaContentId);
      if (!sameOrder) returnVal = 1;
      
      this.children = newChildren;
      this.#lastUpdateDT = Date.now();

    } catch (err) {
      console.error("Failed to load children:", err);
      returnVal = 99;
    }
    
    return returnVal;
  }

  clearURL () {
    this.#url = null;
    for (const child of this.children) child.clearURL();
  }
}

export class NavigationMap extends EventTarget {
  // Private fields
  /** @type {import('./utils.js').CacheManager} */
  #cacheManager;
  #cacheKey = "";
  #initDone = false;
  #startPath = "";

  // Public fields
  /** @type {NavigationItem} */
  rootItem;
  /** @type {NavigationItem} */
  currentItem;
  hass;
  loading=false;

  // Constructor
  constructor(hass, cacheManager, cacheKey, startPath) { 
    super();
    
    this.hass = hass;
    this.#cacheManager = cacheManager;
    this.#cacheKey = cacheKey;
    this.#startPath = startPath;

    this.#Init();
  }

  // Getters
  get initDone() {return this.#initDone}

  // Instance methods
  navigateBackToRoot() {
    if (!this.#initDone) return null;
    if (!this.loading) {
      this.currentItem = this.rootItem;
      this.#openCurrentItem(); 
    }
  }
  navigateBack() {
    if (!this.#initDone) return null;
    if (!this.loading) {
      this.currentItem = this.currentItem.parent;
      this.#openCurrentItem(); 
    }
  }
  reloadCurrentItem() {
    if (!this.#initDone) return null;
    if (!this.loading) {
      this.#openCurrentItem(); 
    }
  }
  openChild(index) {
    if (!this.#initDone) return null;
    if (!this.loading) {
      if (index >= 0 && index < this.currentItem.children.length) {
        this.currentItem = this.currentItem.children[index];      
        this.#openCurrentItem(); 
      }
    }
  }
  openNextSibling() {
    if (!this.#initDone || this.loading || !this.currentItem?.parent) return null;

    const siblings = this.currentItem.parent.children;
    if (!siblings?.length) return;

    const currentIndex = this.currentItem.siblingIndex;
    let sibling = null;    
    for (let i = currentIndex + 1; i < siblings.length; i ++){
      if (siblings[i].isFile){
        sibling = siblings[i];
        break;
      }
    }

    if (!sibling) sibling = siblings.find(item => item.isFile);

    if (sibling && sibling !== this.currentItem) {
      this.currentItem = sibling;    
      this.#openCurrentItem(); 
    }
    
  }
  openPrevSibling() {
    if (!this.#initDone || this.loading || !this.currentItem?.parent) return;

    const siblings = this.currentItem.parent.children;
    if (!siblings?.length) return;

    const currentIndex = this.currentItem.siblingIndex;
    let sibling = null;
    for (let i = currentIndex - 1; i >= 0; i--){
      if (siblings[i].isFile){
        sibling = siblings[i];
        break;
      }
    }

    if (!sibling){
      for (let i = siblings.length - 1; i >= 0; i--) {
        if (siblings[i].isFile) {
          sibling = siblings[i];
          break;
        }
      }
    }

    if (sibling && sibling !== this.currentItem) {
      this.currentItem = sibling;    
      this.#openCurrentItem(); 
    }
    
  }
  clearCache() {
    if (!this.#initDone || !this.#cacheManager) return null;
    this.#cacheManager.clearCache(this.#cacheKey);
    this.currentItem = this.rootItem;
    this.rootItem.children = [];
    this.#openCurrentItem();
  }

  // Private methods
  async #Init() {

    let cachedData = null;
    if (this.#cacheManager) cachedData = await this.#cacheManager.getCachedData(this.#cacheKey);

    if (!cachedData) this.rootItem = new NavigationItem(this.hass,null,"root","directory",this.#startPath);
    else this.rootItem = NavigationItem.fromJSON(this.hass,cachedData);

    this.rootItem.clearURL();

    this.currentItem = this.rootItem;
    this.#openCurrentItem(); 
    this.#initDone = true;
  }
  #openCurrentItem() {
    if (this.currentItem.isDirectory) {
      this.#sendEventCurrentItemChanged();
      this.#loadCurrentItemChildren();  
    }    
    else {
      this.currentItem.getURL().then((returnVal) => {
        if (returnVal == 1) this.#sendEventCurrentItemChanged();
        if (returnVal == 99) this.navigateBack();
      });
    }
  }
  #saveMapOnCache() {
    if (!this.#cacheManager) return;
    this.#cacheManager.saveOnCache(this.#cacheKey, this.rootItem.toJSON());
  }
  #loadCurrentItemChildren() {
    this.loading = true;
    this.currentItem.loadChildren().then(returnVal => {
      this.loading = false;
      if(returnVal == 1) {
        this.#sendEventCurrentItemChanged();
        this.#saveMapOnCache();
      }
      else if(returnVal == 99) {
        this.navigateBack();
      }
    });
  }
  #sendEventCurrentItemChanged(){
    this.dispatchEvent(new CustomEvent("currentItemChanged", {
        detail: this.currentItem
    }));
  }
  #findOldestDirectory(thisDirectory, oldestDirectory) {
    if (oldestDirectory == null || thisDirectory.lastUpdateDT < oldestDirectory.lastUpdateDT) oldestDirectory = thisDirectory;

    for(const child of thisDirectory.children) {
      if (child.isDirectory) oldestDirectory = this.#findOldestDirectory(child,oldestDirectory);
    }

    return oldestDirectory;
  }
}
