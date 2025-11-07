import { renderTemplate } from './template.js';
import { cardStyle } from './style.js';
import { NavigationItem, NavigationMap} from './logic.js';
import { saveOnCache, getCachedData, clearCache } from './utils.js';
import { LitElement } from 'lit';

class MediaExplorerCard extends LitElement {
  
  // private fields
  #version = "20251107a";
  #cacheMapItem = "";
  #cacheGeneralItem = "";

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
    this.config = config; 

    // Check parameters
    if (!this.config.startPath) throw new TypeError("Missing startPath");

    if (this._hass) this.#initCard();
  }

  #initCard(){
    this.#cacheMapItem = "mec_" + this.config.startPath.replace(/\s+/g, "_") + "_map";
    this.#cacheGeneralItem = "mec_" + this.config.startPath.replace(/\s+/g, "_") + "_general";
    
    let cachedData = getCachedData(this.#cacheGeneralItem);
    if (!cachedData || cachedData.version !== this.#version){
      clearCache(this.#cacheGeneralItem);
      clearCache(this.#cacheMapItem);
      saveOnCache(this.#cacheGeneralItem,{version: this.#version});
    }
    
    this.navigationMap = new NavigationMap(this._hass,this.#cacheMapItem,this.config.startPath);
    this.navigationMap.addEventListener("currentItemChanged", (e) => {
      this.currentItemLink = e.detail;
      this.requestUpdate();
    });
    this.currentItemLink = this.navigationMap.currentItem;
  }

  getCardSize() { return 3; }

  render() { return renderTemplate(this); }
}

customElements.define('media-explorer-card', MediaExplorerCard);

export { MediaExplorerCard }; // This is to have JSDoc works, just for development purposes 