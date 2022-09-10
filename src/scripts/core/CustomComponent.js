import { CustomEventListener } from './CustomEventListener.js';

export class CustomComponent extends CustomEventListener {
  /**
   * @param {HTMLDialogElement, String} element
   */
  constructor(element) {
    super();
    if (typeof element === 'string') {
      this.element = document.querySelector(element);
    } else {
      this.element = element;
    }

    if (this.element === null || this.element === undefined) {
      return false;
    }

    this.isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTounchPoints > 0;
  }
}
