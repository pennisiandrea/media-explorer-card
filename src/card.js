import { renderTemplate } from './template.js';
import { cardStyle } from './style.js';
import { } from './logic.js';
import { isDirectory } from './utils.js';
import { LitElement } from 'lit';

/*
title
media_class
media_content_id
url
*/
class NavigationItem {
  /* private properties */
  #title = "";
  #media_class = "";
  #media_content_id = "";
  #url = "";
  #sub_items = [];
  #parent;

  constructor(parent,title,media_class,media_content_id) {
    this.#parent = parent;
    this.#title = title;
    this.#media_class = media_class;
    this.#media_content_id = media_content_id;
  }
  toJSON() {
    return {
      title: this.#title,
      media_class: this.#media_class,
      media_content_id: this.#media_content_id,
      url: this.#url,
      sub_items: this.#sub_items.map(item => item.toJSON()),
    }
  }
  static fromJSON(data, parent = null) {
    const newItem = new NavigationItem(parent,data.title,data.media_class,data.media_content_id,data.url);
    newItem.setURL(data.url);
    if (Array.isArray(data.sub_items)) {
      newItem.getSubItems().push(...data.sub_items.map(sub_item_data => NavigationItem.fromJSON(sub_item_data,newItem)));
    }

    return newItem;
  }

  getTitle() {return this.#title}
  getContentID() {return this.#media_content_id}
  getURL() {return this.#url}
  getSubItems() { return this.#sub_items}
  getParent() {return this.#parent}

  setURL(url) {this.#url = url}
  addSubItem(item) {
    if (!(item instanceof NavigationItem)) throw new TypeError("addSubItem error");
    else this.#sub_items.push(item);
  }
  addSubItems(items) {
    if (items.any((item) => !(item instanceof NavigationItem))) throw new TypeError("addSubItems error");
    else this.#sub_items.push(items);
  }
  resetSubItems() {
    this.#sub_items = [];
  }
  removeSubItem(media_content_id) {
    this.#sub_items = this.#sub_items.filter((item) => item.getContentID() !== media_content_id);
  }

  isURLok() {return this.#url.length > 0}
  isDirectory() {return this.#media_class === "directory"}
  isFile() {return !isDirectory()}
  isVideo() {return this.#media_class === "video"}
  isImage() {return this.#media_class === "image"}
  isAudio() {return this.#media_class === "audio"}

}

class MediaExplorerCard extends LitElement {
  /** @type {NavigationItem | null} */
  rootItem = null;
  /** @type {NavigationItem | null} */
  currentItem = null;
  title = null;
  version = "20251105a";

  static properties = {
    hass: {},
    config: {},
  };

  static styles = cardStyle;

  constructor() {
    super();
    /*this._pathList = [];
    this._itemList = [];*/
    this._playerOn = false;
    this._playerFullScreenOn = false;
    this._openedFile = null;
    this._openedFileUrl = null;
    this._openedFileIndex = null;
    this._navigationLoading = false;
    this._fileLoading = false;
  }

  setConfig(config) { 
    this.config = config; 
    
    //this._pathList.push(config.start_path);
    this.title = config.title ? config.title : null;

    if (!config.start_path) throw new TypeError("Missing start_path");
    this.cacheName = "mec_" + config.start_path.replaceAll(" ","_");
    this.rootItem = this.reloadFromCache();

    if (this.rootItem == null) this.rootItem = new NavigationItem(null,"root","directory",config.start_path);
    this.currentItem = this.rootItem;

  }

  getCardSize() { return 3; }

  firstUpdated() {
    this.getCurrentDirectoryItems();   
  }

  updated(changedProps) { super.updated(changedProps); }

  render() { return renderTemplate(this); }

  saveToCache() {
    const data = {
      version: this.version,
      rootItem: this.rootItem,
    }
    localStorage.setItem(this.cacheName, JSON.stringify(data));
  }
  reloadFromCache() {
    const json = localStorage.getItem(this.cacheName);
    if (!json) return null; // No cache found
    
    try {
      const data = JSON.parse(json);

      if (data.version !== this.version){
        localStorage.removeItem(this.cacheName);
        console.warn("Version changed -> cache cleared");
        return null; // version changed -> clear the cache!
      }
      return NavigationItem.fromJSON(data.rootItem);
    }
    catch (err) { // An error occured -> clear the cache!
      console.warn("Error reading cache:", err);
      localStorage.removeItem(this.cacheName);
      return null;
    }

  }

  async getCurrentDirectoryItems() {
    this._navigationLoading = true;
    if (this.currentItem.getSubItems().length > 0) this.requestUpdate(); // Update immediatly with existing data

    const returnedItems = (await this.hass.callWS({ type: "media_source/browse_media", media_content_id: this.currentItem.getContentID() })).children ?? [];  
    let something_changed = this.mergeHAItemsWithCurrentSubItems(returnedItems,this.currentItem.getSubItems());
    if (something_changed) {
      this.saveToCache();
      this._navigationLoading = false;
      this.requestUpdate();
    }
    else this._navigationLoading = false;
  }

  mergeHAItemsWithCurrentSubItems(HAItems,CurrentSubItems) {
    const currentSubItemsMap = new Map(CurrentSubItems.map(item => [item.getContentID(), item]));
    const HAItemsContentIDs = HAItems.map(item => item.media_content_id);
    let something_changed = false;

    if (CurrentSubItems.some(item => !HAItemsContentIDs.includes(item.getContentID()))) something_changed = true; // At least one element was deleted

    CurrentSubItems.length = 0;

    for (const item of HAItems) {
      const existing = currentSubItemsMap.get(item.media_content_id);
      if (existing) CurrentSubItems.push(existing);
      else {
        CurrentSubItems.push(new NavigationItem(this.currentItem,item.title,item.media_class,item.media_content_id,""));
        something_changed = true; // At least one element was added
      }
    }

    return something_changed;
  }

  openItem(item) {

    if (item.isDirectory()) {
      this.navigateForward(item);
    } else {
      this.openFile(item);
    }
  }

  async openFile(item) {
    //this._openedFileIndex = index;
    this._playerOn = true;
    this._fileLoading = true;
    this._openedFile = item;
    this._abortController = new AbortController();
    this.requestUpdate();
    const resolved = await this.hass.callWS({ type: "media_source/resolve_media", media_content_id: item.getContentID()});
    if (this._playerOn) { // Player is still on
      this._openedFileUrl = resolved.url;
      this._fileLoading = false;
    }
  }

  async navigateForward(item) {
    this.currentItem = item;
    this.getCurrentDirectoryItems();
  }

  async navigateBackward() {
      if (this.currentItem.getParent() == null) return;
      this.currentItem = this.currentItem.getParent();
      this.getCurrentDirectoryItems();
  }

  closeFile() {
    this._playerOn = false;
    this._openedFile = null;
    this._openedFileUrl = null;
    this._openedFileIndex = null;
    this.requestUpdate();
  }
  
  toggleFullscreenPlayer() {
    this._playerFullScreenOn = !this._playerFullScreenOn;
    this.requestUpdate();
  }
}

customElements.define('media-explorer-card', MediaExplorerCard);

export { MediaExplorerCard }; // This is to have JSDoc works, just for development purposes 