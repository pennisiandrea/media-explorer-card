import { html } from 'lit';

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

/** @param {import('./card.js').MediaExplorerCard} card */
export const renderTemplate = (card) => html`
  <ha-card>
    <div id="mec-card">
      
      <div id="mec-header">
        <div id="mec-header-browser-buttons" ?hidden="${card.currentItemLink.isFile}">
          <button class="mec-button" ?disabled="${card.currentItemLink.isRoot}" @click="${() => card.navigationMap.navigateBack()}"><ha-icon icon=${backIcon}></button>
        </div>
        <div id="mec-header-player-buttons" ?hidden="${!card.currentItemLink.isFile}">
          <button class="mec-button" @click="${() => {
            card.navigationMap.navigateBack();
            card.fullScreenPlayerOn = false;
          }}"><ha-icon icon=${closeIcon}></button>
          <button class="mec-button" @click=${() => card.fullScreenPlayerOn = true}><ha-icon icon=${zoomIcon}></button>
          <button class="mec-button" ?disabled="${card.currentItemLink.siblingIndex <= card.currentItemLink.parent?.firstFileChildIndex}" @click=${() => card.navigationMap.openPrevSibling()}><ha-icon icon=${prevIcon}></button>
          <button class="mec-button" ?disabled="${card.currentItemLink.siblingIndex >= card.currentItemLink.parent?.lastFileChildIndex}" @click=${() => card.navigationMap.openNextSibling()}><ha-icon icon=${nextIcon}></button>
        </div>

        <div id="mec-header-title" ?hidden="${!card.config.title}"> ${card.config.title} </div>
        
        <div id="mec-header-info-area" ?hidden="${!card.config.showNavigationInfo}">
          <div class="mec-header-txt-info" ?hidden="${!(card.currentItemLink.isFile)}">${card.currentItemLink.title}</div>
          <div class="mec-header-txt-info" ?hidden="${!(card.currentItemLink.isDirectory && !card.currentItemLink.isRoot)}">${card.currentItemLink.mediaContentId.replace(card.config.startPath,".")}</div>
          <div class="mec-header-txt-info" ?hidden="${!(card.currentItemLink.isDirectory && card.currentItemLink.isRoot)}">./</div>
        </div>
        
        <div id="mec-header-right-area">
          <button id="mec-menu-button" ?hidden="${!card.config.showMenuButton}" class="mec-button" @click="${() => card.menuOn = true}"><ha-icon icon=${dotsIcon}></button>
        </div>
      </div>
      
      <div id="mec-content">       

        <div id="mec-browser-content" ?hidden="${card.currentItemLink.isFile}">
          ${card.currentItemLink.children.length > 0 ? getItemList(card) : card.navigationMap.loading ? html`<div class="loading">Loading...</div>` : html`<div class="p-4">No files found.</div>`}
        </div>

        <div id="mec-player-content" ?hidden="${!card.currentItemLink.isFile || card.fullScreenPlayerOn}">
          ${card.navigationMap.loading && !card.fullScreenPlayerOn ? html`<div class="loading">Loading...</div>` : getPlayer(card)}
        </div>

      </div>
    </div>
  </ha-card>
            
  ${card.menuOn
    ? html`
        <div class="mec-menu-overlay" @click=${() => card.menuOn = false}></div>
        <div class="mec-menu">
          <button class="mec-menu-item" @click=${() => {
            card.navigationMap.navigateBackToRoot();
            card.menuOn = false;
          }}><ha-icon icon=${homeIcon}></ha-icon> Back to root </button>
          <button class="mec-menu-item" @click=${() => {
            card.navigationMap.reloadCurrentItem();
            card.menuOn = false;
          }}><ha-icon icon=${refreshIcon}></ha-icon> Refresh </button>
          <button class="mec-menu-item" ?hidden="${!card.config.enableCache}" @click=${() => {
            card.navigationMap.clearCache();
            card.menuOn = false;
          }}><ha-icon icon=${clearIcon}></ha-icon> Clear cache </button>
        </div>
    ` : null}

  ${card.currentItemLink.isFile && card.fullScreenPlayerOn
    ? html`
        <div id="fullscreen-player">
          <div class="fullscreen-overlay">
            ${getPlayer(card)}
            <button class="fullscreen-close" @click="${() => card.fullScreenPlayerOn = false}"><ha-icon icon=${closeIcon}></button>
          </div>
        </div>
    ` : null}
`;

/** @param {import('./card.js').MediaExplorerCard} card */
const getItemList = (card) => {
  return html`
    ${card.currentItemLink.children.map((item,index) => html`
      <div class="mec-browser-content-item" @click="${() => {card.navigationMap.openChild(index)}}">
        <ha-icon class="mec-browser-content-item-icon" icon=${
          item?.isDirectory ? folderIcon 
            : item?.isImage ? imageIcon 
            : item?.isVideo ? videoIcon 
            : fileIcon
          }>
        </ha-icon>
        <div class="mec-browser-content-item-name">${item.title ?? "NA"}</div>
      </div>`
    )}

    ${card.navigationMap.loading && card.currentItemLink.children.length == 0 ? html`
      <div class="mec-browser-content-item">
        <div class="mec-browser-content-item-icon"><ha-icon icon=${fileIcon}></div>
        <div class="mec-browser-content-item-name">Loading...</div>
      </div>
      ` : ``}
  `
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




  /*

*/