import { renderTemplate } from './template.js';
import { cardStyle } from './style.js';
import { } from './logic.js';
import { isDirectory } from './utils.js';
import { LitElement } from 'lit';

class MediaExplorerCard extends LitElement {

  static properties = {
    hass: {},
    config: {},
  };

  static styles = cardStyle;

  constructor() {
    super();
    this._pathList = [];
    this._itemList = [];
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
    
    this._pathList.push(config.start_path);
    this._title = config.title ? config.title : null;
  }

  getCardSize() { 
    return 3; 
  }

  firstUpdated() {
    this.getCurrentDirectoryItems();   
  }

  updated(changedProps) {
    super.updated(changedProps);
  }

  render() {
    return renderTemplate(this);
  }

  async getCurrentDirectoryItems() {
    this._navigationLoading = true;
    this._itemList = (await this.hass.callWS({ type: "media_source/browse_media", media_content_id: this._pathList.at(-1) })).children ?? [];
    this._navigationLoading = false;
    this.requestUpdate();
  }

  openItem(item,index) {

    if (isDirectory(item)) {
      this.navigateForward(item);
    } else {
      this.openFile(item,index);
    }
  }

  async openFile(item,index) {
    this._openedFileIndex = index;
    this._playerOn = true;
    this._fileLoading = true;
    this._openedFile = item;
    this._abortController = new AbortController();
    this.requestUpdate();
    const resolved = await this.hass.callWS({ type: "media_source/resolve_media", media_content_id: item.media_content_id});
    if (this._playerOn) { // Player is still on
      this._openedFileUrl = resolved.url;
      this._fileLoading = false;
    }
  }

  async navigateForward(item) {
      this._pathList.push(item.media_content_id);
      this._itemList = [];
      this.getCurrentDirectoryItems();
  }

  async navigateBackward() {
      if (this._pathList.length <= 1) return;
      this._pathList.pop();
      this._itemList = [];
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