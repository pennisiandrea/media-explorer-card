# Media Explorer Card

A **Lovelace custom card** for Home Assistant that allows browsing media resources, similar to the built-in "Media" dashboard.  
Supports **image viewing** and **video playback** with a simple user interface.

*Even though the functionality of this card is almost complete, a complete debug and error handling has not yet been done. For this reason, this card should be considered a BETA version. Please report issues.* 

---

## Screenshot

![Card Screenshot](./screenshots/screenshot_1.png)
![Card Screenshot](./screenshots/screenshot_2.png)
![Card Screenshot](./screenshots/screenshot_3.png)

## Usage

```yaml
type: custom:media-explorer-card
startPath: media-source://media_source/home_nas_antifurto/telecamere
title: Archivio telecamere
grid_options:
  rows: 8
  columns: 20
```

| Option    | Values | Description       |
| --------- | ------ | ----------------- |
| startPath | string | Start directory   |
| title     | string | Title of the card |

Use grid_options to properly size the card in your dashboard.

This card implements resource caching in the browser, providing a very fast navigation experience. It saves the entire navigation map in the background. By clicking the 3-dot icon in the top-right corner you can clear that memory, which might be useful in certain situations.  
![Card Screenshot](./screenshots/screenshot_4.png)

## Installation

### Using HACS
