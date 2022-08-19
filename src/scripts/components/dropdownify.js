import CustomComponent from '../core/customcomponent.js';
/**
 * Gestion d'un composant de type "dropdown", au click ou au survol suivant les options passées en paramètre
 *
 * @property {HTMLElement} element
 */
export default class Dropdownify extends CustomComponent {
  /**
   *
   * @param {HTMLElement} element
   */
  constructor(element) {
    super(element);

    this.options = this.parseAttribute();
    //	console.log('Options', this.options);
    this.target = this.element.querySelector('ul');

    this.onClick = this.onClick.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.collapsed = true;
    this.initListener();
  }

  /**
   * Traite les options au format Json passées dans l'attribut de l'élément HTML
   * @return {{showOnHover: boolean, hideOnClickOutside: boolean}|any}
   */
  parseAttribute() {
    const defaultOptions = {
      hideOnClickOutside: true,
      showOnHover: false,
    };
    if (this.element.dataset.jsDropdown.startsWith('{')) {
      return {
        ...defaultOptions,
        ...JSON.parse(this.element.dataset.jsDropdown),
      };
    }
    return { ...defaultOptions };
  }

  /**
   * Initialisation des évènements du DOM
   */
  initListener() {
    if (this.options.showOnHover) {
      this.element.addEventListener('mouseenter', this.onMouseEnter);
      this.element.addEventListener('mouseleave', this.onMouseLeave);
    } else {
      this.element.addEventListener('click', this.onClick);
    }
    if (this.options.hideOnClickOutside) {
      document.addEventListener('click', this.onClickOutside);
    }
  }

  /**
   * Affiche l'élément pointé par l'option "target"
   */
  show() {
    this.target.classList.add('expanded');
    this.element.setAttribute('aria-expanded', 'true');
    this.target.setAttribute('aria-hidden', 'false');
    this.collapsed = false;
  }

  /**
   * Cache l'élément pointé par l'option "target"
   */
  hide() {
    this.target.classList.remove('expanded');
    this.element.setAttribute('aria-expanded', 'false');
    this.target.setAttribute('aria-hidden', 'true');
    this.collapsed = true;
  }

  /**
   * Action déclenchée par l'évènement mouseEnter
   */
  onMouseEnter() {
    this.show();
  }

  /**
   * Action déclenchée par l'évènement mouseLeave
   */
  onMouseLeave() {
    this.hide();
  }

  /**
   * Action déclenchée par l'évènement click du "bouton"
   */
  onClick() {
    if (this.collapsed) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Action déclenchée par l'évènement d'un click à l'extérieur de l'élément "Target"
   */
  onClickOutside(event) {
    const isClickInside = this.element.contains(event.target);
    if (!isClickInside) {
      this.hide();
    }
    event.stopPropagation();
    // if (!this.collapsed) { this.hide(); }
  }

  /**
   * Attache une classe "dropdown" sur les éléments contenant l'attribut [data-js-dropdown]
   * @returns {Dropdownify[]}
   */
  static bind() {
    return Array.from(document.querySelectorAll('[data-js-dropdown]')).map((element) => {
      return new Dropdownify(element);
    });
  }
}
