import { css } from 'lit';

export const cardStyle = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  ha-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
  }

  #mec-card {
    display: flex;
    flex-direction: column;
    height: 100%;
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
    overflow: hidden;
    padding-bottom: 0.5rem;
  }

  #mec-browser-content[hidden],
  #mec-player-content[hidden] {
    display: none;
  }

  #mec-browser-content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
    overflow-y: auto;
    box-sizing: border-box;
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
  }

  .mec-browser-content-item-icon {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 100%;
    color: var(--state-icon-color);
  }

  .mec-browser-content-item-name {
    text-align: center;
    word-break: break-word;
  }

  .loading {
    text-align: center;
    height: 100%;
    align-content: center;
  }

  /* --- PLAYER AREA --- */
  #mec-player-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }

  #mec-player-content img,
  #mec-player-content video,
  #mec-player-content audio {
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
  #fullscreen-player {
    position: fixed;
    inset: 0;
    z-index: 9999;
  }

  .fullscreen-overlay {
    width: 100%;
    height: 100%;
    background: var(--card-background-color);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .fullscreen-overlay img,
  .fullscreen-overlay video,
  .fullscreen-overlay audio {
    width: 90%;
    height: auto;
    max-height: 90vh;
    object-fit: contain;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  }

  .fullscreen-close {
    position: absolute;
    top: 20px;
    right: 30px;    
    padding: 0.5rem;
    cursor: pointer;
    background: none;
    border: 1px solid var(--secondary-text-color, #ccc);
    color: var(--primary-text-color);
    border-radius: 50%;
  }
`;
