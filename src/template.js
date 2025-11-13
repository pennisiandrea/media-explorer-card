import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

const folderIcon = "mdi:folder";
const fileIcon = "mdi:file";
const imageIcon = "mdi:image";
const videoIcon = "mdi:movie";
const backIcon = "mdi:arrow-left"
const zoomIcon = "mdi:fullscreen";
const nextIcon = "mdi:skip-next"
const prevIcon = "mdi:skip-previous";
const closeIcon = "mdi:close";
const dotsIcon = "mdi:dots-vertical";
const homeIcon = "mdi:home";
const refreshIcon = "mdi:refresh";
const clearIcon = "mdi:trash-can";
const checkboxIcon = "mdi:checkbox-multiple-outline";
const checkboxIconMarked = "mdi:checkbox-multiple-marked";
const trashcanIcon = "mdi:trash-can-outline";


/** @param {import('./card.js').MediaExplorerCard} card */
export const renderTemplate = (card) => html`
    <ha-card>
      <div id="mec-card">
        ${card.browserMode ? [renderHeaderBrowser(card), renderContentBrowser(card)]
          : !card.fullScreenPlayerOn ? [renderHeaderPlayer(card), renderContentPlayer(card)]
          : null
        }
      </div>
    </ha-card>
              
    ${card.menuOn ? renderMenu(card) : null}
  
    ${!card.browserMode && card.fullScreenPlayerOn ? renderPlayerFullscreen(card) : null }
`;

const renderHeaderBrowser = (card) => html`
  <div id="mec-header">

    <div id="mec-header-browser-buttons">
      <button class="mec-button" ?disabled="${card.currentItemLink.isRoot}" @click="${() => {card.navigationMap.navigateBack(); scrollToTop(card); card.selectionMode = false;}}"><ha-icon icon=${backIcon}></button>
      <button class="mec-button" ?hidden=${true} ?disabled="${!card.selectionMode && card.currentItemLink.children.length == 0}" @click="${() => {
        if (card.selectionMode) {
          card.navigationMap.ClearSelectedItems();
          card.selectionMode = false;
        }
        else card.selectionMode = true;
      }}"><ha-icon icon=${card.selectionMode ? checkboxIconMarked : checkboxIcon }></button>
      <button class="mec-button" ?hidden=${true} ?disabled="${!card.selectionMode || card.navigationMap.selectedItems.length == 0}" @click="${() => {
        card.navigationMap.deleteSelectedItems();
        card.navigationMap.reloadCurrentItem();
        card.selectionMode = false;      
        scrollToTop(card);
      }}"><ha-icon icon=${trashcanIcon}></button>
      
    </div>

    ${renderHeaderStaticFileds(card)}
  </div>
`;

const renderHeaderPlayer = (card) => html`
  <div id="mec-header">

    <div id="mec-header-player-buttons">
      <button class="mec-button" @click="${() => {
        card.navigationMap.navigateBack();
        card.fullScreenPlayerOn = false;
      }}"><ha-icon icon=${closeIcon}></button>
      <button class="mec-button" @click=${() => card.fullScreenPlayerOn = true}><ha-icon icon=${zoomIcon}></button>
      <button class="mec-button" ?disabled="${card.currentItemLink.siblingIndex <= card.currentItemLink.parent?.firstFileChildIndex}" @click=${() => card.navigationMap.openPrevSibling()}><ha-icon icon=${prevIcon}></button>
      <button class="mec-button" ?disabled="${card.currentItemLink.siblingIndex >= card.currentItemLink.parent?.lastFileChildIndex}" @click=${() => card.navigationMap.openNextSibling()}><ha-icon icon=${nextIcon}></button>
    </div>

    ${renderHeaderStaticFileds(card)}
  </div>
`;

const renderHeaderStaticFileds = (card) => html`
    <div id="mec-header-title" ?hidden="${!card.config.title}"> ${card.config.title} </div>
    
    <div id="mec-header-info-area" ?hidden="${!card.config.showNavigationInfo}">
      <div class="mec-header-txt-info" ?hidden="${card.currentItemLink.isRoot}">${card.currentItemLink.mediaContentId.replace(card.config.startPath,".")}</div>
      <div class="mec-header-txt-info" ?hidden="${!card.currentItemLink.isRoot}">./</div>
    </div>
    
    <div id="mec-header-right-area">
      <button id="mec-menu-button" ?hidden="${!card.config.showMenuButton}" class="mec-button" @click="${() => card.menuOn = true}"><ha-icon icon=${dotsIcon}></button>
    </div>
`;

const renderContentBrowser = (card) => html`
  <div id="mec-content">       

    <div id="mec-browser-content">
      ${card.currentItemForceLitUpdate && card.currentItemLink.children.length > 0 ? getItemList(card) : card.navigationMap.loading ? html`<div class="loading">Loading...</div>` : html`<div class="p-4">No files found.</div>`}
    </div>

  </div>
`;

const renderContentPlayer = (card) => html`
  <div id="mec-content">       

    <div id="mec-player-content">
      ${card.currentItemForceLitUpdate && card.navigationMap.loading ? html`<div class="loading">Loading...</div>` : getPlayer(card)}
    </div>

  </div>
`;

const renderPlayerFullscreen = (card) => html`
  <div id="fullscreen-player">
    <div class="fullscreen-overlay">
      ${getPlayer(card)}
      <button class="fullscreen-close" @click="${() => card.fullScreenPlayerOn = false}"><ha-icon icon=${closeIcon}></button>
    </div>
  </div>
`;

const renderMenu = (card) => html`
  <div class="mec-menu-overlay" @click=${() => card.menuOn = false}></div>
  <div class="mec-menu">
    <button class="mec-menu-item" @click=${() => {
      card.navigationMap.navigateBackToRoot();
      card.menuOn = false;
      scrollToTop(card);
    }}><ha-icon icon=${homeIcon}></ha-icon> Back to root </button>
    <button class="mec-menu-item" @click=${() => {
      card.navigationMap.reloadCurrentItem();
      card.menuOn = false;
      scrollToTop(card);
    }}><ha-icon icon=${refreshIcon}></ha-icon> Refresh </button>
    <button class="mec-menu-item" @click=${() => {
      card.navigationMap.clearMemory();
      card.menuOn = false;
    }}><ha-icon icon=${clearIcon}></ha-icon> Clear memory </button>
  </div>
`;

/** @param {import('./card.js').MediaExplorerCard} card */
const getItemList = (card) => {
  return html`
    ${repeat(card.currentItemLink.children,
         (it) => it.mediaContentId,
         (item, index) => html`
            <div class="mec-browser-content-item" @click="${() => {if (!card.selectionMode) {card.navigationMap.openChild(index); scrollToTop(card);}}}">
              ${card.selectionMode ? html`<input type="checkbox" class="mec-browser-content-item-checkbox" @change=${(e) => {
                if(e.target.checked) card.navigationMap.SelectItem(item); 
                else card.navigationMap.UnselectItem(item);
              }}>`:``}
              ${card.previewImageForceLitUpdate && item.previewImage 
                ? html`<img class="mec-preview" src="${item.previewImage}" loading="lazy" />`
                : html`<ha-icon class="mec-browser-content-item-icon" icon=${
                    item.isDirectory ? folderIcon 
                    : item.isImage ? imageIcon 
                    : item.isVideo ? videoIcon 
                    : fileIcon
                  }></ha-icon>`}
              <div class="mec-browser-content-item-name">${item.title ?? "NA"}</div>
            </div>`
      )}
    ${card.navigationMap.loading && card.currentItemLink.children.length == 0 ? html`
      <div class="mec-browser-content-item">
        <div class="mec-browser-content-item-icon"><ha-icon icon=${fileIcon}></div>
        <div class="mec-browser-content-item-name">Loading...</div>
      </div>
      ` : ``}
  `;
}

const getPlayer = (card) => {
  const item = card.currentItemLink;

  return html`
    ${item.isImage ? html`<img src="${item.url}" @error=${() => card.navigationMap.navigateBack()} alt="${item.title}" />`
      : item.isVideo ? html`<video src="${item.url}" @error=${() => card.navigationMap.navigateBack()} controls autoplay></video>`
      : item.isAudio ? html`<audio src="${item.url}" @error=${() => card.navigationMap.navigateBack()} controls autoplay></audio>`
      : html`<a href="${item.url}" target="_blank">File not supported</a>`}
  `;
}

const scrollToTop = (card) => {
  card.shadowRoot.getElementById("mec-browser-content")?.scrollTo({ top: 0, behavior: 'auto' });
}
