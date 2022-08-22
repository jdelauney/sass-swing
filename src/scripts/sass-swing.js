import { debounce } from './core/helpers/miscUtils.js';
import ThemeSwitcher from './components/theme-switcher.js';
import Slidify from './components/slidify.js';
import Tabify from './components/tabify.js';
import Dropdownify from './components/dropdownify.js';

export const fixDocumentHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
};

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
    fixDocumentHeight();
  });
})();
