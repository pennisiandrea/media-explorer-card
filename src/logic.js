import { CacheManager, devLog } from './utils.js';
import * as JSZip from 'jszip'
import {saveAs} from 'file-saver'

export class NavigationItem extends EventTarget {
  // Private fields
  #title = "";
  #mediaClass = "";
  #mediaContentId = "";
  #url = null;
  #lastUpdateDT = null;
  #previewImage = null;
  #enablePreview = null;
  #previewRunId = 0;
  #previewLoading = false;
  loadChildrenPreview = false;

  // Public fields
  /** @type {Array< NavigationItem >} */
  children = []; 
  /** @type {NavigationItem} */
  parent;
  hass;

  // Constructor
  constructor(hass,parent,title,mediaClass,mediaContentId,lastUpdateDT=null,previewImage,enablePreview) {
    super();
    this.parent = parent;
    this.#title = title;
    this.#mediaClass = mediaClass;
    this.#mediaContentId = mediaContentId;
    this.hass = hass;
    this.#lastUpdateDT = lastUpdateDT;
    this.#enablePreview = enablePreview;
    if (this.#enablePreview) this.#previewImage = previewImage; 
  }

  // Static methods
  static fromJSON(hass, data, parent = null, enablePreview) {
    const newItem = new NavigationItem(hass,parent,data.title,data.mediaClass,data.mediaContentId,data.lastUpdateDT,null,enablePreview);
    if (Array.isArray(data.children)) 
      newItem.children.push(...data.children.map(childData => NavigationItem.fromJSON(hass,childData,newItem,enablePreview)));
    
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
  get previewImage() { return this.#previewImage; }
  get enablePreview() { return this.#enablePreview; }
  get previewLoading() { return this.#previewLoading; }
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
      //previewImage: this.#previewImage,
      children: this.children.map(child => child.toJSON()),
    }
  }

  async getURL() {
    //devLog("NavigationItem.getURL - start");
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
    
    //devLog("NavigationItem.getURL - end");
    return returnVal;
  }

  async loadChildren(previewLoadOrder = 1) {
    /*
      returnVal:
      0 = nothing changed
      1 = something changed
      99 = error
    */

    let returnVal = 0;

    try {
      const { children: updatedChildren = [] } =
        await this.hass.callWS({
          type: "media_source/browse_media",
          media_content_id: this.#mediaContentId
        }) ?? {};

      const currentChildrenMap = new Map(
        this.children.map(item => [
          item.mediaContentId,
          item
        ])
      );

      const updatedChildrenContentIDs = new Set(
        updatedChildren.map(item => item.media_content_id)
      );

      // Controlla se qualche elemento precedente è stato rimosso.
      if (
        this.children.some(
          item => !updatedChildrenContentIDs.has(item.mediaContentId)
        )
      ) {
        returnVal = 1;
      }

      // Ricostruisce l'elenco riutilizzando gli oggetti già esistenti.
      const newChildren = updatedChildren.map(item => {
        const existing =
          currentChildrenMap.get(item.media_content_id);

        if (
          !existing ||
          existing.title !== item.title ||
          existing.mediaClass !== item.media_class
        ) {
          returnVal = 1;

          return new NavigationItem(
            this.hass,
            this,
            item.title,
            item.media_class,
            item.media_content_id,
            null,
            null,
            this.enablePreview
          );
        }

        return existing;
      });

      // Rileva anche un semplice cambiamento di ordinamento.
      const sameOrder =
        this.children.length === newChildren.length &&
        this.children.every(
          (child, index) =>
            child.mediaContentId ===
            newChildren[index].mediaContentId
        );

      if (!sameOrder) {
        returnVal = 1;
      }

      this.children = newChildren;

      // Le anteprime partono in background:
      // loadChildren non aspetta che siano completate.
      if (this.#enablePreview) {
        void this.#loadChildrenPreviewImage(
          previewLoadOrder
        );
      }

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

  startPreviewLoading(order = 1) {
    if (this.#enablePreview) {
      void this.#loadChildrenPreviewImage(order);
    }
  }

  async #loadChildrenPreviewImage(order = 1,concurrency = 3) {
    const runId = ++this.#previewRunId;

    this.loadChildrenPreview = true;

    const source =
      order === 1
        ? this.children
        : [...this.children].reverse();

    const queue = source.filter(child =>
      !child.previewImage &&
      !child.previewLoading &&
      (child.isVideo || child.isImage)
    );

    let active = 0;

    const isCurrentRun = () =>
      this.loadChildrenPreview &&
      runId === this.#previewRunId;

    await new Promise(resolve => {
      const next = () => {
        if (!isCurrentRun()) {
          if (active === 0) {
            resolve();
          }

          return;
        }

        while (
          active < concurrency &&
          queue.length > 0
        ) {
          const child = queue.shift();

          if (
            !child ||
            child.previewImage ||
            child.previewLoading
          ) {
            continue;
          }

          active++;

          child.getPreviewImage()
            .then(changed => {
              if (changed) {
                this.#sendEventItemPreviewReady();
              }
            })
            .finally(() => {
              active--;

              if (
                queue.length === 0 &&
                active === 0
              ) {
                resolve();
              }
              else {
                next();
              }
            });
        }

        if (
          queue.length === 0 &&
          active === 0
        ) {
          resolve();
        }
      };

      next();
    });

    if (runId === this.#previewRunId) {
      this.loadChildrenPreview = false;
    }
  }

  stopOperations() {
    this.loadChildrenPreview = false;
    this.#previewRunId++;
  }

  async getPreviewImage() {
    if (
      (!this.isImage && !this.isVideo) ||
      this.#previewImage ||
      this.#previewLoading
    ) {
      return false;
    }

    this.#previewLoading = true;

    let video = null;

    try {
      await this.getURL();

      if (!this.#url) {
        return false;
      }

      const maxSize = 200;

      const canvas =
        document.createElement("canvas");

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return false;
      }

      if (this.isImage) {
        const img = new Image();

        img.crossOrigin = "anonymous";
        img.src = this.#url;

        await img.decode();

        const scale = Math.min(
          maxSize / img.width,
          maxSize / img.height,
          1
        );

        canvas.width = Math.max(
          1,
          Math.round(img.width * scale)
        );

        canvas.height = Math.max(
          1,
          Math.round(img.height * scale)
        );

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
      else {
        video = document.createElement("video");

        video.crossOrigin = "anonymous";
        video.src = this.#url;
        video.muted = true;
        video.playsInline = true;

        await new Promise((resolve, reject) => {
          video.addEventListener(
            "loadeddata",
            resolve,
            { once: true }
          );

          video.addEventListener(
            "error",
            reject,
            { once: true }
          );
        });

        const targetTime =
          Number.isFinite(video.duration) &&
          video.duration > 0
            ? Math.min(1, video.duration / 2)
            : 0;

        if (targetTime > 0) {
          video.currentTime = targetTime;

          await new Promise((resolve, reject) => {
            video.addEventListener(
              "seeked",
              resolve,
              { once: true }
            );

            video.addEventListener(
              "error",
              reject,
              { once: true }
            );
          });
        }

        const scale = Math.min(
          maxSize / video.videoWidth,
          maxSize / video.videoHeight,
          1
        );

        canvas.width = Math.max(
          1,
          Math.round(video.videoWidth * scale)
        );

        canvas.height = Math.max(
          1,
          Math.round(video.videoHeight * scale)
        );

        ctx.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      this.#previewImage =
        canvas.toDataURL(
          "image/jpeg",
          0.72
        );

      return true;

    } catch (err) {
      console.warn(
        "Preview generation failed:",
        err
      );

      this.#previewImage = null;

      return false;

    } finally {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }

      this.#previewLoading = false;
    }
  }

  #sendEventItemPreviewReady(){
    this.dispatchEvent(new CustomEvent("itemPreviewReady", {
        detail: true
    }));
  }

  resetPreviewImage() {
    this.#previewImage = null;
  }
  
}

export class NavigationMap extends EventTarget {
  // Private fields
  #cacheKey = "";
  #cacheTable = "";
  #initDone = false;
  #startPath = "";
  #enablePreview = null;
  #savePreview = null;
  #previewLoadOrder = 1;
  #cacheMaxAge = 30000;
  #directoryLoadId = 0;
  #previewEventItem = null;
  #previewEventHandler =
    () => this.#sendEventCurrentItemChildrenPreviewChanged();

  // Public fields
  /** @type {NavigationItem} */
  rootItem;
  /** @type {NavigationItem} */
  currentItem;
  hass;
  loading=false;
  selectedItems=[];
  downloading=false;

  // Constructor
  constructor(hass, cacheTable, cacheKey, startPath, enablePreview, savePreview, previewLoadOrder,cacheMaxAge = 30000) { 
    super();
    
    this.hass = hass;
    this.#cacheTable = cacheTable;
    this.#cacheKey = cacheKey;
    this.#startPath = startPath;
    this.#enablePreview = enablePreview;
    this.#savePreview = savePreview;
    this.#previewLoadOrder = previewLoadOrder;
    this.#cacheMaxAge = cacheMaxAge;

    this.#Init();
  }

  // Getters
  get initDone() {return this.#initDone}

  // Instance methods
  navigateBackToRoot() {
    if (
      !this.#initDone ||
      this.currentItem === this.rootItem
    ) {
      return;
    }

    this.currentItem.stopOperations();

    if (
      this.#enablePreview &&
      !this.#savePreview
    ) {
      this.#resetCurrentItemChildrenPreviewImages();
    }

    this.currentItem = this.rootItem;
    this.#openCurrentItem();
  }
  navigateBack() {
    if (
      !this.#initDone ||
      this.currentItem.isRoot
    ) {
      return;
    }

    this.currentItem.stopOperations();

    if (
      this.#enablePreview &&
      !this.#savePreview
    ) {
      this.#resetCurrentItemChildrenPreviewImages();
    }

    this.currentItem =
      this.currentItem.parent;

    this.#openCurrentItem();
  }
  reloadCurrentItem() {
    if (!this.#initDone) {
      return;
    }

    this.currentItem.stopOperations();

    if (
      this.#enablePreview &&
      !this.#savePreview
    ) {
      this.#resetCurrentItemChildrenPreviewImages();
    }

    this.#openCurrentItem(true);
  }
  openChild(child) {
    if (
      !this.#initDone ||
      !child
    ) {
      return;
    }

    this.currentItem.stopOperations();
    this.currentItem = child;
    this.#openCurrentItem();
  }
  openNextSibling() {
    //devLog("NavigationMap.openNextSibling - start");
    if (this.#initDone && !this.loading && this.currentItem?.parent) {

      const siblings = this.currentItem.parent.children;
      if (siblings?.length) {

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
          this.currentItem.stopOperations();
          this.currentItem = sibling;    
          this.#openCurrentItem(); 
        }
      }
    }
    //devLog("NavigationMap.openNextSibling - end");    
  }
  openPrevSibling() {
    //devLog("NavigationMap.openPrevSibling - start");
    if (this.#initDone && !this.loading && this.currentItem?.parent) {

      const siblings = this.currentItem.parent.children;
      if (siblings?.length) {

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
          this.currentItem.stopOperations();
          this.currentItem = sibling;    
          this.#openCurrentItem(); 
        }
      }
    }
    //devLog("NavigationMap.openPrevSibling - end");
  }
  clearMemory() {
    //devLog("NavigationMap.clearMemory - start");
    if (this.#initDone && this.#cacheTable) {
      CacheManager.clearCache(this.#cacheTable,this.#cacheKey);
      this.currentItem.stopOperations();
      this.currentItem = this.rootItem;
      this.rootItem.children = [];
      this.#openCurrentItem(true);
    }
    //devLog("NavigationMap.clearMemory - end");
  }
  ClearSelectedChildren() {
    this.selectedItems.length = 0;    
  }
  SelectChild(item) {
    this.selectedItems.push(item);
    this.#sendEventCurrentItemChanged();
  }
  UnselectChild(item) {
    const idx = this.selectedItems.findIndex(it => it.mediaContentId === item.mediaContentId);
    if (idx !== -1) this.selectedItems.splice(idx,1);
    this.#sendEventCurrentItemChanged();
  }
  DeleteSelectedChildren() {
    if (this.selectedItems.length > 0){
      for (const item of this.selectedItems) this.DeleteItem(item);   
    }
    this.ClearSelectedChildren();
  }
  DeleteItem(item){
    try {
      if (item.isFile) {
        let dummy = false;
        if (item.mediaContentId === this.currentItem.mediaContentId){
          dummy = true;
          if (this.currentItem.siblingIndex < this.currentItem.parent?.lastFileChildIndex) this.openNextSibling();
          else if (this.currentItem.siblingIndex > this.currentItem.parent?.firstFileChildIndex) this.openPrevSibling(); 
        }
        
        var fileToDelete = "";

        if (item.mediaContentId.startsWith("media-source://media_source/local")) {
          fileToDelete = item.mediaContentId.replace("media-source://media_source/local","/media")
        }
        else {
          if (item.mediaContentId.startsWith("media-source://media_source")) {
            fileToDelete = item.mediaContentId.replace("media-source://media_source","/media")
          }
        }

        this.hass.callService("delete", "file", {
          file: fileToDelete
        });
        
        if (dummy){
          const idx = this.currentItem.parent.children.findIndex(it => it.mediaContentId === item.mediaContentId);
          if (idx !== -1) this.currentItem.parent.children.splice(idx,1);
        }
        else {
          const idx = this.currentItem.children.findIndex(it => it.mediaContentId === item.mediaContentId);
          if (idx !== -1) this.currentItem.children.splice(idx,1);
          this.#sendEventCurrentItemChanged();
        }

      }
      else {
        this.hass.callService("delete", "files_in_folder", {
          folder: item.mediaContentId.replace("media-source://media_source","/media"),
          time: 0,
          scan_subfolders: true,
          remove_subfolders: true
        });
        new Promise(r => setTimeout(r, 1000)).then( () =>
          {
            if (item.mediaContentId === this.currentItem.mediaContentId){
              this.navigateBack();
            }

            this.hass.callService("delete", "file", {
              file: item.mediaContentId.replace("media-source://media_source","/media")
            });
          
            const idx = this.currentItem.children.findIndex(it => it.mediaContentId === item.mediaContentId);
            if (idx !== -1) this.currentItem.children.splice(idx,1);
            this.#sendEventCurrentItemChanged();
          });
      }
      
    }
    catch (err) {
      console.error("Failed to delete items:", err);
    }   
  }
  async DownloadSelectedChildren() {
    this.downloading=true;
    
    try {
      const zip = new JSZip.default();
      var fileFound = false;
      
      for (const item of this.selectedItems) {
        if (item.isFile) {
          fileFound = true;
          const response = await fetch(item.url);
          const blob = await response.blob();
          zip.file(item.title, blob);
        }
      }
      
      if (fileFound) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'media_explorer_card_download.zip');
      }

    } catch (error) {
      console.error('Errore:', error);
    } finally {
      this.downloading = false;
      this.ClearSelectedChildren();
    }
  }

  // Private methods
  async #Init() {
    //devLog("NavigationMap.#Init - start");

    let cachedData = null;
    if (this.#cacheTable) cachedData = await CacheManager.getCachedData(this.#cacheTable,this.#cacheKey);

    if (!cachedData) this.rootItem = new NavigationItem(this.hass,null,"root","directory",this.#startPath,null,null,this.#enablePreview);
    else this.rootItem = NavigationItem.fromJSON(this.hass,cachedData,null,this.#enablePreview);

    this.rootItem.clearURL();

    this.currentItem = this.rootItem;
    this.#openCurrentItem(); 
    this.#initDone = true;
    //devLog("NavigationMap.#Init - end");
  }
  #unsubscribeFromPreviewEvents() {
    if (!this.#previewEventItem) {
      return;
    }

    this.#previewEventItem.removeEventListener(
      "itemPreviewReady",
      this.#previewEventHandler
    );

    this.#previewEventItem = null;
  }
  #subscribeToCurrentItemEvents() {
    this.#unsubscribeFromPreviewEvents();

    this.#previewEventItem =
      this.currentItem;

    this.#previewEventItem.addEventListener(
      "itemPreviewReady",
      this.#previewEventHandler
    );
  }
  #openCurrentItem(forceRefresh = false) {
    // Invalida eventuali richieste appartenenti
    // alla schermata precedente.
    this.#directoryLoadId++;

    this.#unsubscribeFromPreviewEvents();
    this.ClearSelectedChildren();

    if (this.currentItem.isDirectory) {
      if (this.#enablePreview) {
        this.#subscribeToCurrentItemEvents();
      }

      // La cartella può essere subito mostrata
      // con gli elementi già presenti in memoria.
      this.loading = false;
      this.#sendEventCurrentItemChanged();

      const cacheIsFresh =
        this.currentItem.lastUpdateDT !== null &&
        Date.now() -
          this.currentItem.lastUpdateDT <
          this.#cacheMaxAge;

      if (
        forceRefresh ||
        !cacheIsFresh
      ) {
        this.#loadCurrentItemChildren();
      }
      else {
        // La directory è ancora valida:
        // riprende solo le anteprime mancanti.
        this.currentItem.startPreviewLoading(
          this.#previewLoadOrder
        );
      }
    }
    else {
      const item = this.currentItem;

      this.loading = true;
      this.#sendEventCurrentItemChanged();

      item.getURL().then(returnVal => {
        // Nel frattempo è stato aperto
        // un altro elemento.
        if (this.currentItem !== item) {
          return;
        }

        this.loading = false;

        if (returnVal === 99) {
          this.navigateBack();
          return;
        }

        this.#sendEventCurrentItemChanged();
      });
    }
  }
  #saveMapOnCache() {
    if (this.#cacheTable) CacheManager.saveOnCache(this.#cacheTable,this.#cacheKey, this.rootItem.toJSON());
  }
  #loadCurrentItemChildren() {
    const item = this.currentItem;

    const requestId =
      ++this.#directoryLoadId;

    const hasCachedState =
      item.lastUpdateDT !== null;

    /*
      Una directory già presente in memoria
      resta navigabile mentre viene aggiornata.
      Loading viene mostrato solamente al primo
      caricamento.
    */
    this.loading = !hasCachedState;

    item.loadChildren(
      this.#previewLoadOrder
    ).then(returnVal => {
      /*
        Salva comunque lastUpdateDT e la nuova
        struttura se il caricamento è riuscito.
      */
      if (returnVal !== 99) {
        this.#saveMapOnCache();
      }

      /*
        La risposta appartiene a una directory
        che l'utente ha già lasciato.
      */
      if (
        requestId !== this.#directoryLoadId ||
        this.currentItem !== item
      ) {
        return;
      }

      this.loading = false;

      if (returnVal === 99) {
        this.navigateBack();
        return;
      }

      /*
        Aggiorna sempre l'interfaccia, anche se
        la cartella è vuota o il contenuto non
        è cambiato.
      */
      this.#sendEventCurrentItemChanged();
    });
  }
  #resetCurrentItemChildrenPreviewImages() {
    for(const child of this.currentItem.children) child.resetPreviewImage();
  }
  #sendEventCurrentItemChanged(){
    this.dispatchEvent(new CustomEvent("currentItemChanged", {
        detail: this.currentItem
    }));
  }
  #sendEventCurrentItemChildrenPreviewChanged(){
    this.dispatchEvent(new CustomEvent("currentItemChildrenPreviewChanged", {
        detail: null
    }));
  }

}
