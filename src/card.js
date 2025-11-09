import { renderTemplate } from './template.js';
import { cardStyle } from './style.js';
import { NavigationItem, NavigationMap} from './logic.js';
import { CacheManager } from './utils.js';
import { LitElement } from 'lit';

class MediaExplorerCard extends LitElement {
  
  // private fields
  #version = "20251107a";
  cacheManager;
  #cacheDBName = "MediaExplorerCard";
  #cacheDBVersion = 1;
  #cacheTableName = "";
  #cacheMapKey = "map";
  #cacheVersionKey = "cardVersion";
  #initDone = false;

  // public fields
  /** @type {NavigationMap} */
  navigationMap;
  /** @type {NavigationItem} */
  currentItemLink = null;
  config;

  static properties = {
    hass: {},
    config: {},
    currentItemLink: { state: true, hasChanged: () => true },
    fullScreenPlayerOn: { type: Boolean},
    menuOn: { type: Boolean},
  };

  static styles = cardStyle;

  constructor() {
    super();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.navigationMap && this.config) this.#initCard();
  }

  get hass() {return this._hass}

  setConfig(config) { 
    if (!config) throw new Error("No configuration provided");
    if (!config.startPath) throw new TypeError("Missing startPath");

    this.config = {
      showMenuButton: true,
      showNavigationInfo: true,
      enableCache: true,
      ...config,
    };

    if (this._hass) this.#initCard();
  }

  async #initCard(){
    this.#cacheTableName = "mec_" + this.config.startPath.replace(/\s+/g, "_");
    this.cacheManager = new CacheManager(this.#cacheDBName,this.#cacheDBVersion,this.#cacheTableName);

    let cachedVersion = await this.cacheManager.getCachedData(this.#cacheVersionKey);

    if (!cachedVersion || cachedVersion !== this.#version){
      await this.cacheManager.clearCache(this.#cacheVersionKey);
      await this.cacheManager.clearCache(this.#cacheMapKey);
      await this.cacheManager.saveOnCache(this.#cacheVersionKey,this.#version);
    }

    if (!this.config.enableCache){
      await this.cacheManager.clearCache(this.#cacheMapKey);
      this.navigationMap = new NavigationMap(this._hass,null,null,this.config.startPath);
    }
    else this.navigationMap = new NavigationMap(this._hass,this.cacheManager,this.#cacheMapKey,this.config.startPath);

    this.navigationMap.addEventListener("currentItemChanged", (e) => {
      this.currentItemLink = e.detail;
      this.requestUpdate();
    });
    this.currentItemLink = this.navigationMap.currentItem;
    this.#initDone = true;
  }

  getCardSize() { return 3; }

  firstUpdated() {
  }

  render() { 
    if (!this.#initDone || !this.navigationMap.initDone) return null;
    return renderTemplate(this); 
  }
}

customElements.define('media-explorer-card', MediaExplorerCard);

export { MediaExplorerCard }; // This is to have JSDoc works, just for development purposes 