import { CustomComponent } from '../core/CustomComponent.js';

export class Revealify extends CustomComponent {
  constructor(element) {
    super(element);

    this.options = this._parseAttributs();
    this.onHandleIntersect = this._handleIntersect.bind(this);
    this._initIntersectObserver();
  }

  _parseAttributs() {
    const defaultOptions = {
      root: null,
      rootMargin: '0px 100% 0px 100%',
      threshold: 0.5,
      addClass: 'reveal',
    };
    let options = {};
    if (this.element.hasAttribute('data-js-reveal')) {
      if (this.element.dataset.jsReveal.startsWith('{')) {
        options = {
          ...defaultOptions,
          ...JSON.parse(this.element.dataset.jsReveal),
        };
        if (options.root !== null && options.root !== '') {
          options.root = document.getElementById(options.root);
        }
        return options;
      }
    }
    return { ...defaultOptions };
  }

  _handleIntersect(entries, observer) {
    entries.forEach((entry) => {
      // console.log(entry.intersectionRatio);
      if (entry.isIntersecting) {
        if (entry.intersectionRatio > this.options.threshold) {
          entry.target.classList.add(this.options.addClass);
          observer.unobserve(entry.target);
        }
      }
    });
  }

  _initIntersectObserver() {
    const options = { root: this.options.root, rootMargin: this.options.rootMargin, threshold: this.options.threshold };
    this.observer = new IntersectionObserver(this.onHandleIntersect, options);
    this.observer.observe(this.element);
  }

  /**
   * Attache une classe "Slidify" sur les éléments contenant l'attribut [data-js-slider]
   * @return {Slidify[]}
   */
  static bind() {
    return Array.from(document.querySelectorAll("[class*='reveal--'], [class='reveal'], [data-js-reveal]")).map((element) => {
      return new Revealify(element);
    });
  }
}
