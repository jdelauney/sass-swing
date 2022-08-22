import CustomComponent from '../core/CustomComponent.js';

export default class Tabify extends CustomComponent {
  constructor(element) {
    super(element);

    this.tablist = this.element.querySelector('[role="tablist"]');
    this.tabs = this.tablist.querySelectorAll('li > [role="tab"]');
    this.panelSection = this.element.querySelector('section');
    this.panels = this.panelSection.querySelectorAll('[role="tabpanel"]');

    this.onTabClick = this._navClickHandler.bind(this);
    this.onTabKeydown = this._navKeydownHandler.bind(this);
    this.onTabKeyup = this._navKeyupHandler.bind(this);
    this.onWindowResize = this._windowResizeHandler.bind(this);

    this._init();
  }

  _switchTab(evt) {
    const direction = {
      ArrowLeft: -1,
      ArrowRight: +1,
    };

    const keypress = evt.key;
    const dir = direction[keypress];
    const target = evt.target;

    const idx = target.index;
    if (idx !== undefined) {
      if (this.tabs[idx + dir]) {
        this.tabs[idx + dir].focus();
      } else if (keypress === 'ArrowRight') {
        this._focusLastTab();
      } else if (keypress === 'ArrowLeft') {
        this._focusFirstTab();
      }
    }
  }

  _windowResizeHandler() {
    this._setPanelSectionHeight();
  }

  _navClickHandler(evt) {
    evt.preventDefault();
    const tab = evt.target;
    this._showTab(tab);
  }

  _navKeydownHandler(evt) {
    switch (evt.key) {
      case 'Home':
        evt.preventDefault();
        this._focusFirstTab();
        break;
      case 'End':
        evt.preventDefault();
        this._focusLastTab();
        break;
      case ' ':
        evt.stopImmediatePropagation();
        evt.preventDefault();
        evt.stopPropagation();
        break;
    }
  }

  _navKeyupHandler(evt) {
    switch (evt.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        evt.preventDefault();
        this._switchTab(evt);
        break;
      case ' ':
      case 'Enter':
        evt.preventDefault();
        this._showTab(evt.target);
        break;
    }
  }

  _getPanelHeight(panel) {
    const display = getComputedStyle(panel).display;
    if (display !== 'none') {
      return panel.offsetHeight + 4;
    }

    panel.style.display = 'block';
    const height = panel.offsetHeight + 4;
    panel.style.display = '';

    return height;
  }

  _setPanelSectionHeight() {
    let maxHeight = 0;
    this.panels.forEach((panel) => {
      const currentHeight = this._getPanelHeight(panel);
      maxHeight = Math.max(maxHeight, currentHeight);
    });

    this.panelSection.style.height = maxHeight + 'px';
  }

  _init() {
    this._setPanelSectionHeight();
    this.tabs.forEach((tab, index) => {
      tab.addEventListener(this.isTouchScreen ? 'touchend' : 'click', this.onTabClick);
      tab.addEventListener('keydown', this.onTabKeydown);
      tab.addEventListener('keyup', this.onTabKeyup);
      tab.index = index;
    });
    window.addEventListener('resize', this.onWindowResize);
  }

  _focusFirstTab() {
    this.tabs[0].focus();
  }

  _focusLastTab() {
    this.tabs[this.tabs.length - 1].focus();
  }

  _showTab(tab, setFocus = true) {
    this._hideAllTabs();
    tab.setAttribute('tabindex', '0');
    tab.setAttribute('aria-selected', 'true');

    const panelID = tab.getAttribute('aria-controls');
    const panel = document.getElementById(panelID);
    panel.setAttribute('aria-hidden', 'false');
    panel.setAttribute('aria-expanded', 'true');

    if (setFocus) {
      tab.focus();
    }
  }

  _hideAllTabs() {
    this.tabs.forEach((tab) => {
      tab.setAttribute('tabindex', '-1');
      tab.setAttribute('aria-selected', 'false');
    });

    this.panels.forEach((panel) => {
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Attache une classe "Tabify" sur les éléments contenant la classe css ".tabs"
   * @return {Tabify[]}
   */
  static bind() {
    return Array.from(document.querySelectorAll('.tabs')).map((element) => {
      return new Tabify(element);
    });
  }
}
