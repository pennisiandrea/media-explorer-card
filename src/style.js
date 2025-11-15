import { css } from 'lit';

export const cardStyle = css`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
  }
  ha-card {
    display: flex;
    box-sizing: border-box;
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
    height: 100%;
  }

  #mec-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

/* --------- HEADER -----------*/
  #mec-header {
    display: grid;
    padding: 0.5rem 0.5rem 0rem 0.5rem;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr auto;
    align-items: center; 
  }

  #mec-header-browser-buttons,
  #mec-header-player-buttons {
    display: flex;
    gap: 0.5rem;
    grid-column: 1;
    grid-row: 1;
  }
  #mec-header-browser-buttons[hidden],
  #mec-header-player-buttons[hidden] {
    display: none;
  }

  .mec-button {
    padding: 0.5rem;
    cursor: pointer;
    background: none;
    border: 1px solid var(--secondary-text-color, #ccc);
    color: var(--secondary-text-color);
    border-radius: 50%;
    transition: background 0.2s;
  }
  .mec-button[disabled] {
    color: var(--state-inactive-color);
    border: 1px solid var(--state-inactive-color, #ccc);
    cursor: not-allowed;
    opacity: 0.6;
  }
  .mec-button[hidden] {
    display: none;
  }
  #mec-button-icon-selectionMode[active] {
    --icon-primary-color: var(--state-active-color);
  }
  
  #mec-header-title {
    font-size: var(--paper-font-headline_-_font-size, 20px);
    color: var(--primary-text-color);
    grid-column: 2;
    grid-row: 1;
    text-align: center;
  }

  #mec-header-info-area {
    display: flex;
    gap: 0.5rem;
    grid-column: 1 / -1;
    grid-row: 2;
    margin: 5px 5px 0px 5px;
  }
  #mec-header-info-area[hidden] {
    display: none;
  }

  .mec-header-txt-info {
    color: var(--secondary-text-color);
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
  }
  mec-header-txt-info[hidden] {
    display: none;
  }

  @media (max-width: 600px) {
    #mec-header {
      grid-template-rows: 1fr auto auto;
      grid-template-columns: 1fr 1fr;
    }
    #mec-header-title {
      grid-row: 1;
      grid-column: 1 / -1;
    }
    #mec-header-browser-buttons,
    #mec-header-player-buttons {
      grid-row: 2;
      grid-column: initial;
    }
    #mec-header-right-area {
      grid-row: 2;
      grid-column: end;
    }
    #mec-header-info-area {
      grid-row: 3;
      grid-column: 1 / -1;
    }
  }

/* --------- CONTENT -----------*/
  #mec-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding-bottom: 0.5rem;
    min-height: 0;
    max-height: var(--mec-content-max-height);
  }

  #mec-browser-content[hidden],
  #mec-player-content[hidden] {
    display: none;
  }

  #mec-browser-content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--mec-icon-size), 1fr));
    grid-template-rows: max-content;
    gap: 0.5rem;
    overflow-y: auto;
    box-sizing: border-box;
    align-content: start;
  }
  @media (max-width: 600px) {
    #mec-browser-content {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }

  .mec-browser-content-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background 0.2s;
    cursor: pointer;

    position: relative;
  }

  .mec-browser-content-item-icon {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 100%;
    color: var(--state-icon-color);
    
    position: relative;
    z-index: 1;
  }

  .mec-browser-content-item-name {
    text-align: center;
    word-break: break-word;
  }
  .mec-browser-content-item-preview {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 4px;

    position: relative;
    z-index: 1;
  }
  .loading {
    text-align: center;
    height: 100%;
    align-content: center;
  }
  .mec-browser-content-item-checkbox-container {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
    cursor: pointer;
  }
  .mec-browser-content-item-checkbox-container[hidden] {
    display: none;
  }
  .mec-browser-content-item-graphics {
    position: relative;
  }
  .mec-browser-content-item-checkbox-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
  }
  .mec-browser-content-item-checkmark {
    position: absolute;
    top: calc(50% - 13px);
    left: calc(50% - 13px);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: white;
    border: 1px solid var(--primary-text-color);
    box-sizing: border-box;
    transition: 0.2s;
  }

  .mec-browser-content-item-checkbox-input:checked + .mec-browser-content-item-checkmark {
    background-color: var(--state-active-color);
  }

  .mec-browser-content-item-checkbox-input:checked + .mec-browser-content-item-checkmark::after {
    content: "";
    position: absolute;
    left: 7px;
    top: 3px;
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
    
  /*--------------------------------------------------------------------*/
  /* --- PLAYER AREA --- */
  .mec-player-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }

  .mec-player-content img,
  .mec-player-content video,
  .mec-player-content audio {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 4px;
  }

  /* --- MENU --- */
  #mec-header-right-area {
    display: flex;
    gap: 0.5rem;
    grid-column: 3;
    grid-row: 1;
    justify-content: end;
  }
  #mec-menu-button {
    border: none;
  }
  #mec-menu-button[hidden] {
    display: none;
  }
  .mec-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
  }

  .mec-menu {
    position: absolute;
    top: 40px;
    right: 8px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 999;
    animation: mec-menu-fadein 0.15s ease-out;
  }

  .mec-menu-item {
    display: flex;
    width: 100%;
    padding: 8px 16px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--secondary-text-color);
    font: inherit;
    border-radius: 6px;
    align-items:center;
    gap: 6px;
  }
  .mec-menu-item[hidden]{
    display: none;
  }
  .mec-menu-item:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  @keyframes mec-menu-fadein {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* --- FULLSCREEN --- */
  #mec-fullscreen-player-container {
    position: fixed;
    inset: 0;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    background: var(--primary-background-color);
  }

`;
