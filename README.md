# x-enhanced 
* Author: xelm
* Created: 2026-23-09

This plugin is a complete re-work and update of [renhanced](https://github.com/Arkadyzja/fcade-renhanced)
<img width="1488" height="795" alt="10" src="https://github.com/user-attachments/assets/e5cc0711-4efa-49ba-ac52-64b800d95dd6" />
<img width="1488" height="796" alt="x-enhanced" src="https://github.com/user-attachments/assets/8b6fc2fc-979d-41f6-85b3-123f12904606" />

## Plugins:
* Theme creator - a very customizable theme editor with color picking option that supports RGB, HSL and hex. a field entry box to manually write hex color codes for those who wish to write and test their own themes. if not there are 11 default presets to choose from by right clicking the selected theme profile and clicking reset to default preset which will cycle through all the 11 default presets or you could create a new theme and it will generate you a random color template by default. Right click and set the default on startup once you've found your color scheme.
* Favorite "star" button on the left side panel - for fast access
* Favorite navigation arrow buttons - quickly switch between next or previous favorite channels to check for active players

## Installation
1. Download `x-enhanced.zip` and place all of the contents from .zip inside your `Fightcade\fc2-electron\resources\app\inject` directory.

## Configuration
You can enable/disable each plugin changing `true` to `false` for individual options in `CONFIG` section on top of the `inject.js` file. Additionally you can select startup theme:

```javascript
const CONFIG = {
    addMorePlayerInfoToChat: true,
    showThemeButtons: true,
    showFavoritesButton: true,
    showFavoriteNavigationButtons: true,
    startupTheme: "Default"
};
```

#### have fun :) 

If you would like to support me on this project.
Thank you! <3 

<div align="center">
  <a href="https://www.buymeacoffee.com/xelm" target="_blank">
    <img src="https://buymeacoffee.com" alt="Buy Me A Coffee" height="60" width="217">
  </a>
</div>
