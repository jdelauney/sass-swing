import { debounce } from './core/helpers/miscUtils.js';
import { ThemeSwitcher } from './components/theme-switcher.js';
import { Slidify } from './components/slidify.js';
import { Tabify } from './components/tabify.js';
import { Dropdownify } from './components/dropdownify.js';
import { Revealify } from './components/revealify.js';
import { AccesibilityInputSwitch } from './components/accesibilityInputSwitch';
// import {Modalify} from "./components/modalify.js";

const fixDocumentHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
};

export { clamp, randomBetween, safeRandomBetween } from './core/helpers/mathUtils.js';
export { capitalize, escapeHTML, unescapeHTML, removeAccents } from './core/helpers/stringUtils.js';
export { wait, debounce, debounceAsync, throttle } from './core/helpers/miscUtils.js';
export { waitForDOMEvent } from './core/helpers/domUtils.js';

export { notify } from './components/notify.js';
export { Modalify } from './components/modalify.js';

// Sass Swing initialization entry point
(() => {
  document.addEventListener('resize', debounce(fixDocumentHeight));
  window.addEventListener('DOMContentLoaded', () => {
    ThemeSwitcher.bind();
    Tabify.bind();
    Dropdownify.bind();
    Slidify.bind();
    Revealify.bind();
    AccesibilityInputSwitch.bind();
    fixDocumentHeight();
  });
})();
