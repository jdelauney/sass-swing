import { waitForDOMEvent } from '../core/helpers/domUtils.js';
import CustomComponent from '../core/CustomComponent.js';

export class Modalify extends CustomComponent {
  /**
   * Paramètres des notifications cf _defaultConfig
   * @type {Object}
   * @private
   */
  _config = {};

  /**
   * Code de retour du bouton cliqué
   * @type {String}
   * @private
   */
  _modalResult = '';

  /**
   * @param {HTMLDialogElement, String} element
   */
  constructor(element) {
    super(element);
    try {
      this.buttons = this.element.querySelectorAll('button');
      this.buttons.forEach((btn) => {
        if (btn.hasAttribute('value') || btn.hasAttribute('data-modal-result')) {
          btn.addEventListener('click', this._buttonHandlerClick.bind(this));
        }
      });
    } catch (error) {
      console.error(error);
      return null;
    }

    this.element.addEventListener('close', () => {
      const htmlRoot = document.querySelector('html');
      htmlRoot.classList.remove('disabled-scroll');
    });
  }

  _buttonHandlerClick(evt) {
    const target = evt.currentTarget;
    this._modalResult = '';
    if (target.hasAttribute('value')) {
      this._modalResult = target.value;
    } else if (target.hasAttribute('data-modal-result')) {
      this._modalResult = target.getAttribute('data-modal-result');
    }
  }

  _animationsCompleted() {
    return Promise.allSettled(this.element.getAnimations().map((animation) => animation.finished));
  }

  async close() {
    await this._animationsCompleted();
    this.element.close();
  }

  async showModal() {
    const htmlRoot = document.querySelector('html');
    htmlRoot.classList.add('disabled-scroll');
    this.element.showModal();
    const btns = [...this.buttons];
    const buttonsRace = btns.map((btn) => {
      return waitForDOMEvent(btn, 'click');
    });

    await Promise.race(buttonsRace);

    await this.close();

    return new Promise((resolve) => {
      resolve(this._modalResult);
    });
  }

  getFormData() {
    const form = this.getForm();
    if (form) {
      return new FormData(form);
    }
    return null;
  }

  getForm() {
    const form = this.element.querySelector('form');
    if (form) {
      return form;
    }
    return undefined;
  }

  forceFormInputFileReset() {
    const form = this.getForm();
    const files = form.querySelectorAll('input[type="file"]');
    if (files) {
      files.forEach((inputFileElement) => {
        inputFileElement.value = '';
      });
    }
  }
}
