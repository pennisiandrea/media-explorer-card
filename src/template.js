import { html } from 'lit';
import { isDirectory } from './utils.js';

const folderIcon = html`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
`;
const fileIcon = html`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
`;
const imageIcon = html`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M8 11l2.5 3 3.5-4.5L18 17H6z" />
    <circle cx="9" cy="7" r="1.5" stroke-width="2" />
  </svg>
`;
const videoIcon = html`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" />
    <rect x="3" y="7" width="12" height="10" rx="2" ry="2" stroke-width="2" />
  </svg>
`;

/**
 * @param {import('./card.js').MediaExplorerCard} card
*/
export const renderTemplate = (card) => html`
  <ha-card>
    <div id="mec-card">
      
      <div id="mec-header">
        <div id="mec-header-browser-buttons" ?hidden="${card._playerOn}">
          <button class="mec-button" ?disabled="${card._pathList.length <= 1}" @click="${() => card.navigateBackward()}">Back</button>
        </div>
        <div id="mec-header-player-buttons" ?hidden="${!card._playerOn}">
          <button class="mec-button" @click="${() => card.closeFile()}">Back</button>
          <button class="mec-button" @click=${() => card.toggleFullscreenPlayer()}>Zoom</button>
          <button class="mec-button" ?disabled="${card._openedFileIndex <= 0}" @click=${() => card.openFile(card._itemList[card._openedFileIndex-1],card._openedFileIndex-1)}>Prev</button>
          <button class="mec-button" ?disabled="${card._openedFileIndex >= card._itemList?.length-1}" @click=${() => card.openFile(card._itemList[card._openedFileIndex+1],card._openedFileIndex+1)}>Next</button>
        </div>

        <div id="mec-header-title" ?hidden="${!card._title}"> ${card._title} </div>
        
        <div class="mec-header-txt-info" ?hidden="${card._playerOn || card._pathList.length <= 1}">${card._pathList.at(-1).replace(card._pathList[0],".")}</div>
        <div class="mec-header-txt-info" ?hidden="${!card._playerOn}">${card._openedFile?.title}</div>
      </div>
      
      <div id="mec-content">       

        <div id="mec-browser-content" ?hidden="${card._playerOn}">
          ${card._navigationLoading ? html`<div class="loading">Loading...</div>` : card._itemList.length ? getItemList(card) : html`<div class="p-4">No files found.</div>`}
        </div>

        <div id="mec-player-content" ?hidden="${!card._playerOn}">
          ${card._fileLoading ? 
            html`<div class="loading">Loading...</div>` :
            card._openedFileUrl && !card._playerFullScreenOn
            ? getPlayer(card._openedFile?.media_content_type,card._openedFileUrl)
            : html`<div>I'm confused</div>`}
        </div>

      </div>
    </div>
  </ha-card>

  ${card._openedFileUrl && card._playerFullScreenOn
    ? html`
        <div id="fullscreen-player">
          <div class="fullscreen-overlay">
            ${getPlayer(card._openedFile?.media_content_type,card._openedFileUrl)}
            <button class="fullscreen-close" @click="${() => card.toggleFullscreenPlayer()}">❌</button>
          </div>
        </div>
    ` : null}
`;

/**
 * @param {import('./card.js').MediaExplorerCard} card
*/
const getItemList = (card) => html`
    ${card._itemList.map((item, index) => html`
      <div class="mec-browser-content-item" @click="${() => {card.openItem(item, index)}}">
        <div class="mec-browser-content-item-icon">${fileIcon}</div>
        <div class="mec-browser-content-item-name">${item?.title}</div>
      </div>`
    )}
  `;


const getPlayer = (type, url) => html`
    ${type?.startsWith("image")
      ? html`<img src="${url}" alt="preview" />`
      : type?.startsWith("video")
      ? html`<video src="${url}" controls autoplay></video>`
      : type?.startsWith("audio")
      ? html`<audio src="${url}" controls autoplay></audio>`
      : html`<a href="${url}" target="_blank">I'm confused</a>`}
  `;