# x-enhanced 
* Author: xelm
* Created: 2026-23-09

This plugin is a complete re-work of renhanced
<img width="1488" height="795" alt="10" src="https://github.com/user-attachments/assets/e5cc0711-4efa-49ba-ac52-64b800d95dd6" />
<img width="1488" height="796" alt="x-enhanced" src="https://github.com/user-attachments/assets/8b6fc2fc-979d-41f6-85b3-123f12904606" />

## Plugins
### **Theme Creator**
* **Custom Color Picker:** Easily customize themes using RGB, HSL, or Hex values, or manually enter Hex codes to build and test custom themes.
* **Presets & Quick Generation:** Choose from 11 built-in presets by right-clicking a theme profile and selecting **Reset to Default Preset** (cycles through all presets), or create a new theme to generate a randomized color template.
* **Startup Preference:** Set your preferred theme as the default on launch by right-clicking the theme profile.

### **Favorites**
* **Quick Access Button:** Access your saved favorites instantly via the "star" icon on the left panel.
* **Favorite Navigation:** Use the navigation arrows to swiftly cycle through favorited channels and check for active players.

## Installation: 
Download `x-enhanced-main.zip`

<br/>
<img src="https://github.com/user-attachments/assets/be5dc3fe-858c-473f-8f51-22acc11b044d" width="225" height="225" alt="example0" />

## unpack:
drag & drop all of the contents from `x-enhanced-main.zip` into your default `Fightcade\fc2-electron\resources\app\inject` directory.
<div style="text-align: center;">
  example:
     <br/>
<img width="927" height="296" alt="example" src="https://github.com/user-attachments/assets/e019310c-e1af-40d7-a25c-d32ecbd77279" />
</div>

## Advanced Configuration (optional)
if you wish to toggle settings, you can do so by changing each value in `CONFIG` section on top of the `inject.js` file to `true` or `false`
additionally you can set your default startup theme by setting the name of the 11 default presets. ( first launch not recommended )  

```javascript
const CONFIG = {
    addMorePlayerInfoToChat: true,
    showThemeButtons: true,
    showFavoritesButton: true,
    showFavoriteNavigationButtons: true,
    startupTheme: "Default"
};
```

# Done! Launch Fcade and start creating :) 

---

<div align="center">

---

If you find this project valuable and would like to support its continued development, please consider making a contribution. Every contribution directly supports ongoing development, improvements and future features. Your support is greatly appreciated and helps a lot to ensure the project can continue to grow.

### Thank you! ❤️️
### ~xelm

<a href="https://buymeacoffee.com/xelm" target="_blank">
  <img src="https://github.com/user-attachments/assets/cdc1b7e6-4284-4f83-95d9-5643a083d90a" alt="Support xelm" width="220" />
  <img src="https://github.com/user-attachments/assets/964a8c59-eff3-4172-9767-7aa8dfc6debc" width="220" height="220" alt="bmc_qr"/>
</a>

</div>
