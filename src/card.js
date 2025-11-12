import { cardStyle } from './style.js';
import { NavigationItem, NavigationMap} from './logic.js';
import { CacheManager, devLog } from './utils.js';
import { LitElement } from 'lit';
import { renderTemplate} from './template.js';

class MediaExplorerCard extends LitElement {
  // private fields
  #version = "20251111a";
  #cacheDBName = "MediaExplorerCard";
  #cacheTableName = "";
  #cacheMapKey = "map";
  #cacheVersionKey = "cardVersion";
  #initDone = false;
  #initStarted = false;

  // public fields
  /** @type {NavigationMap} */
  navigationMap;
  /** @type {NavigationItem} */
  currentItemLink = null;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    menuOn: { state: true },
    fullScreenPlayerOn: { state: true },
    browserMode: { state: true },
    currentItemForceLitUpdate: { state: true },
    previewImageForceLitUpdate: { state: true },
  };

  static styles = cardStyle;

  constructor() {
    super();

    // Reactive properties declaration
    this._hass = null;
    this.config = null;
    this.menuOn = false;
    this.fullScreenPlayerOn = false;
    this.browserMode = true;
    this.previewImageForceLitUpdate = 0;
    this.currentItemForceLitUpdate = 0;
  }

  set hass(hass) {
    this._hass = hass;
  }

  get hass() {return this._hass}
  get isEditMode() {
    return (
      this.closest("hui-card-editor") !== null ||
      this.closest("hui-dialog-edit-card") !== null ||
      this.editMode
    );
  }

  setConfig(config) { 
    if (!config) throw new Error("No configuration provided");
    if (!config.startPath) throw new TypeError("Missing startPath");

    this.config = {
      showMenuButton: true,
      showNavigationInfo: true,
      enableCache: true,
      enablePreview: true,
      savePreview: true,
      itemSize: "200px",
      ...config,
    };
    
  }

  async #initCard(){
    devLog("InitCard - start");
    this.#initStarted = true;
    this.#cacheTableName = "mec_" + this.config.startPath.replace(/\s+/g, "_");
    
    CacheManager.dbName = this.#cacheDBName;
    await CacheManager.addTable(this.#cacheTableName);

    let cachedVersion = await CacheManager.getCachedData(this.#cacheTableName,this.#cacheVersionKey);

    if (!cachedVersion || cachedVersion !== this.#version){
      await CacheManager.clearCache(this.#cacheTableName,this.#cacheVersionKey);
      await CacheManager.clearCache(this.#cacheTableName,this.#cacheMapKey);
      await CacheManager.saveOnCache(this.#cacheTableName,this.#cacheVersionKey,this.#version);
    }

    if (!this.config.enableCache){
      await CacheManager.clearCache(this.#cacheTableName,this.#cacheMapKey);
      this.navigationMap = new NavigationMap(this._hass,null,null,this.config.startPath,this.config.enablePreview,this.config.savePreview);
    }
    else this.navigationMap = new NavigationMap(this._hass,this.#cacheTableName,this.#cacheMapKey,this.config.startPath,this.config.enablePreview,this.config.savePreview);

    this.navigationMap.addEventListener("currentItemChanged", (e) => {
      this.currentItemLink = e.detail;
      this.browserMode = this.currentItemLink.isDirectory;
      if (this.browserMode) this.fullScreenPlayerOn = false;
      this.currentItemForceLitUpdate++; 
    });
    this.navigationMap.addEventListener("currentItemChildrenPreviewChanged", (e) => {
      this.previewImageForceLitUpdate++;
    });
    this.currentItemLink = this.navigationMap.currentItem;
    this.#initDone = true;
    devLog("InitCard - end");
  }

  getCardSize() { return 6; }

  getGridOptions() {
    return {
      rows: 7,
      columns: 12,
      min_rows: 5,
      max_rows: 24,
    };
  }

  updated(changedProps) {
    if (this.#initDone || this.#initStarted) return;
    
    if (this.config && this._hass && !this.isEditMode) {
      this.#initCard();
    }
  }

  firstUpdated() {
    //if (this.config && this._hass && !this.#initStarted) this.#initCard();
    this.style.setProperty("--mec-icon-size", this.config.itemSize);
  }

  render() { 
    if (!this.#initDone || !this.navigationMap.initDone) return null;
    return renderTemplate(this);
  }
}

customElements.define('media-explorer-card', MediaExplorerCard);

export { MediaExplorerCard }; // This is to have JSDoc works, just for development purposes 