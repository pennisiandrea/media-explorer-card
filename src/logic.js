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
  get siblingMaxIndex() {
    if (this.parent?.children.length > 0) return this.parent.children.length - 1;
    return 0;
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
    let changed = false;
    if (!this.#url) {
      const result = await this.hass.callWS({ 
        type: "media_source/resolve_media", 
        media_content_id: this.#mediaContentId
      });
      this.#url = result.url;
      changed = true;
    }
    return changed;
  }

  async loadChildren() {
    let changed = false;
    try {
      const { children: updatedChildren = []} = await this.hass.callWS({ 
          type: "media_source/browse_media", 
          media_content_id: this.#mediaContentId 
      }) ?? {};  
      
      const currentChildrenMap = new Map(this.children.map(item => [item.mediaContentId, item]));
      const updatedChildrenContentIDs = updatedChildren.map(item => item.media_content_id);

      // Removed elements
      if (this.children.some(item => !updatedChildrenContentIDs.includes(item.mediaContentId))) changed = true;

      // Rebuild children
      this.children = updatedChildren.map(item => {
        const existing = currentChildrenMap.get(item.media_content_id);
        if (existing) return existing;
        changed = true;
        return new NavigationItem(this.hass,this,item.title,item.media_class,item.media_content_id);          
      });
      this.#lastUpdateDT = Date.now();

    } catch (err) {
      console.error("Failed to load children:", err);
    }
    
    return changed;
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
  openSibling(index) {
    if (!this.#initDone) return null;
    if (!this.loading) {
      if (index >= 0 && index < this.currentItem.parent.children.length) {
        this.currentItem = this.currentItem.parent.children[index];      
        this.#openCurrentItem(); 
      }
    }
  }
  clearCache() {
    if (!this.#initDone) return null;
    this.#cacheManager.clearCache(this.#cacheKey);
    this.currentItem = this.rootItem;
    this.rootItem.children = [];
    this.#openCurrentItem();
  }

  // Private methods
  async #Init() {

    let cachedData = await this.#cacheManager.getCachedData(this.#cacheKey);
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
      this.currentItem.getURL().then(() => {
        this.#sendEventCurrentItemChanged();
      });
    }
  }
  #saveMapOnCache() {
    this.#cacheManager.saveOnCache(this.#cacheKey, this.rootItem.toJSON());
  }
  #loadCurrentItemChildren() {
    this.loading = true;
    this.currentItem.loadChildren().then(changed => {
      this.loading = false;
      if(changed) {
        this.#sendEventCurrentItemChanged();
        this.#saveMapOnCache();
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
