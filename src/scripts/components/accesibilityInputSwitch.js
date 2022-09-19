import { CustomComponent } from '../core/CustomComponent.js';

export class AccesibilityInputSwitch extends CustomComponent {
  constructor(element) {
    super(element);

    if (!this.element.hasAttribute('aria-checked')) {
      const currentState = this.element.hasAttribute('checked');
      const newState = Boolean(!currentState);
      this.element.setAttribute('aria-checked', newState.toString());
    }

    this.onClick = this._handlerInputSwitchClick.bind(this);
    this.element.addEventListener('click', this.onClick);
  }

  _handlerInputSwitchClick(event) {
    const currentState = this.element.getAttribute('aria-checked') === ('true' || true);
    const newState = Boolean(!currentState);
    this.element.setAttribute('aria-checked', newState.toString());
  }

  static bind() {
    return Array.from(document.querySelectorAll('[role="switch"]')).map((element) => {
      return new AccesibilityInputSwitch(element);
    });
  }
}
