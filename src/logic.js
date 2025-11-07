import { saveOnCache, getCachedData, clearCache } from './utils.js';

export class NavigationItem {
  // Private fields
  #title = "";
  #mediaClass = "";
  #mediaContentId = "";
  #url = null;

  // Public fields
  /** @type {Array< NavigationItem >} */
  children = []; 
  /** @type {NavigationItem} */
  parent;
  hass;

  // Constructor
  constructor(hass,parent,title,mediaClass,mediaContentId) {
    this.parent = parent;
    this.#title = title;
    this.#mediaClass = mediaClass;
    this.#mediaContentId = mediaContentId;
    this.hass = hass;
  }

  // Static methods
  static fromJSON(hass, data, parent = null) {
    const newItem = new NavigationItem(hass,parent,data.title,data.mediaClass,data.mediaContentId);
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

  // Instance methods
  toJSON() {
    return {
      title: this.#title,
      mediaClass: this.#mediaClass,
      mediaContentId: this.#mediaContentId,
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

    } catch (err) {
      console.error("Failed to load children:", err);
    }
    
    return changed;
  }
}

export class NavigationMap extends EventTarget {
  // Private fields
  #cacheItem = "";

  // Public fields
  /** @type {NavigationItem} */
  rootItem;
  /** @type {NavigationItem} */
  currentItem;
  hass;
  loading=false;

  // Constructor
  constructor(hass, cacheItem, startPath) { 
    super();
    
    this.hass = hass;
    this.#cacheItem = cacheItem;

    let cachedData = getCachedData(this.#cacheItem);
    if (cachedData) this.rootItem = NavigationItem.fromJSON(hass,cachedData.rootItem);
    else this.rootItem = new NavigationItem(hass,null,"root","directory",startPath);
    
    this.currentItem = this.rootItem;
    this.#openCurrentItem(); 
  }

  // Instance methods
  navigateBack() {
    if (!this.loading) {
      this.currentItem = this.currentItem.parent;
      this.#openCurrentItem(); 
    }
  }
  openChild(index) {
    if (!this.loading) {
      if (index >= 0 && index < this.currentItem.children.length) {
        this.currentItem = this.currentItem.children[index];      
        this.#openCurrentItem(); 
      }
    }
  }
  openSibling(index) {
    if (!this.loading) {
      if (index >= 0 && index < this.currentItem.parent.children.length) {
        this.currentItem = this.currentItem.parent.children[index];      
        this.#openCurrentItem(); 
      }
    }
  }

  // Private methods
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
    saveOnCache(this.#cacheItem, {rootItem: this.rootItem});
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
}
