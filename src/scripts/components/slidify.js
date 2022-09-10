import { CustomComponent } from '../core/CustomComponent.js';
import { clamp } from '../core/helpers/mathUtils.js';

export class Slidify extends CustomComponent {
  constructor(element) {
    super(element);

    this.options = this._parseAttributs();

    this.slidesPerPage = Number(getComputedStyle(this.element).getPropertyValue('--slides-per-page'));

    this.slidesContainer = this.element.querySelector('.slider__slides-wrapper > .slider__slides-inner > .slider__slides');
    this.slides = this.slidesContainer.querySelectorAll('.slider__slide');
    this.totalSlide = this.slides.length;
    this.element.style.setProperty('--slide-count', `"${this.totalSlide}"`);

    this.btnPrev = this.element.querySelector('.slider__controls-prev');
    this.btnNext = this.element.querySelector('.slider__controls-next');
    this.hasButtonControls = this.btnPrev !== null && this.btnNext !== null;

    this._indicators = [];
    this.setFocus = this.options.showFocus;

    this.timer = null;
    this.animated = false;
    this.animationSuspended = true;

    this._elementWidth = this.element.offsetWidth;
    this._dragStartPos = 0;
    this._dragThreshold = 0.2;
    this._dragDelta = 0;
    this._isDragging = false;
    this._dragRAFRef = null;
    this._grabElement = null;

    this.onButtonPrevClick = this._prevButtonClickHandler.bind(this);
    this.onButtonNextClick = this._nextButtonClickHandler.bind(this);
    this.onTransitionEnd = this._updateSlides.bind(this);
    this.onActionButtonClick = this._actionButtonClickHandler.bind(this);
    this.onSliderMouseenter = this._sliderMouseEnterEventHandler.bind(this);
    this.onSliderMouseleave = this._sliderMouseLeaveEventHandler.bind(this);
    this.onSliderfocusin = this._sliderMouseEnterEventHandler.bind(this);
    this.onSliderfocusout = this._sliderMouseLeaveEventHandler.bind(this);
    this.onTouchStart = this._touchStartHandler.bind(this);
    this.onTouchMove = this._touchMoveHandler.bind(this);
    this.onTouchEnd = this._touchEndHandler.bind(this);

    this.dragAnimBind = this._dragAnim.bind(this);

    if (this.hasButtonControls) {
      this.btnPrev.addEventListener('click', this.onButtonPrevClick);
      this.btnNext.addEventListener('click', this.onButtonNextClick);
    }
    this.slidesContainer.addEventListener('transitionend', this.onTransitionEnd);

    /* START INIT */
    this._nbIndicators = this.totalSlide;
    if (this.options.infinite) {
      this._cloneSlides();
    }

    this.options.slideByPage = this.slidesPerPage > 1 ? this.options.slideByPage : false;
    if (this.options.slideByPage) {
      this.totalSlide = Math.floor(this.totalSlide / this.slidesPerPage);
      this._nbIndicators = this.options.infinite ? this.totalSlide - 2 : this.totalSlide;
      this.slidesContainer.style.setProperty('--translate-slide-width', '100%');
    }

    if (this.options.showIndicators) {
      this._createIndicators();
    }
    this._createLiveRegion();

    let minSlide = 0;
    let maxSlide = this.totalSlide - 1;
    if (this.options.slideByPage) {
      if (this.options.infinite) {
        minSlide = 1;
        maxSlide = this.totalSlide - 2;
      }
    } else {
      if (this.options.infinite) {
        minSlide = this.slidesPerPage;
        maxSlide = this.totalSlide - this.slidesPerPage - 1;
      }
    }

    this.currentSlide = clamp(this.options.startIndex, minSlide, maxSlide);

    this.slides.forEach((slide) => {
      slide.addEventListener('mouseenter', this.onSliderMouseenter);
      slide.addEventListener('mouseleave', this.onSliderMouseleave);

      slide.addEventListener('touchstart', this.onTouchStart);
      slide.addEventListener('touchmove', this.onTouchMove);
      slide.addEventListener('touchend', this.onTouchEnd);
      // mouse events
      slide.addEventListener('mousedown', this.onTouchStart);
      slide.addEventListener('mousemove', this.onTouchMove);
      slide.addEventListener('mouseup', this.onTouchEnd);
      slide.addEventListener('mouseleave', this.onTouchEnd);
    });

    // this.element.addEventListener("focusin", this.onSliderfocusin);
    // this.element.addEventListener("focusout", this.onSliderfocusout);

    this.slidesContainer.style.transition = 'none';
    this._gotoSlide(this.currentSlide, this.setFocus);
    setTimeout(() => {
      this.slidesContainer.style.transition = `all ${this.options.transitionSpeedInMs}ms ${this.options.transitionTimingFunc}`;
    });

    /* END INIT */

    if (this.options.autoplay) {
      this._startAnimation();
    }
  }

  _parseAttributs() {
    const defaultOptions = {
      showIndicators: true,
      indicatorsPosition: 'bottom',
      showButtonAction: false,
      showFocus: false,
      slideByPage: false,
      infinite: true,
      autoplay: false,
      // centerActiveSlide:false,
      direction: 1,
      startIndex: 0,
      intervalInMs: 5000,
      transitionSpeedInMs: 300,
      transitionTimingFunc: 'ease-in-out',
    };
    if (this.element.dataset.jsSlider.startsWith('{')) {
      return {
        ...defaultOptions,
        ...JSON.parse(this.element.dataset.jsSlider),
      };
    }
    return { ...defaultOptions };
  }

  _cloneSlides() {
    for (let i = 0; i < this.slidesPerPage; i++) {
      const firstClone = this.slides[i].cloneNode(true);
      const lastClone = this.slides[this.slides.length - 1 - i].cloneNode(true);

      this.slidesContainer.append(firstClone);
      this.slidesContainer.prepend(lastClone);
    }
    this.slides = this.slidesContainer.querySelectorAll('.slider__slide');
    this.totalSlide = this.slides.length;
    this.element.style.setProperty('--slide-count', this.totalSlide);
  }

  _createLiveRegion() {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('class', 'slider__liveRegion sr-only');
    this.element.appendChild(this.liveRegion);
  }

  _createActionButton() {
    const btnAction = document.createElement('button');

    const innerSRSpan = document.createElement('span');
    innerSRSpan.className = 'sr-only';
    innerSRSpan.textContent = this.options.autoplay ? 'Stop animation' : 'Start animation';
    btnAction.appendChild(innerSRSpan);

    const innerSpan = document.createElement('span');
    innerSpan.textContent = this.options.autoplay ? '￭' : '▶';
    btnAction.appendChild(innerSpan);

    const action = this.options.autoplay ? 'stop' : 'start';
    btnAction.setAttribute('data-action', action);

    btnAction.addEventListener('click', this.onActionButtonClick);

    return btnAction;
  }

  _createIndicators() {
    const nav = document.createElement('ul');
    nav.className = 'slider__indicators';
    if (this.options.showButtonAction) {
      const li = document.createElement('li');
      this.btnAction = this._createActionButton();
      li.appendChild(this.btnAction);
      nav.appendChild(li);
    }

    for (let i = 0; i < this._nbIndicators; i++) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      const span = document.createElement('span');
      span.className = 'sr-only';
      span.textContent = 'Item ' + i.toString() + ' sur ' + this._nbIndicators.toString();
      btn.appendChild(span);
      btn.addEventListener('click', () => {
        const index = this.options.slideByPage ? i + 1 : this.options.infinite ? i + this.slidesPerPage : i;
        this._gotoSlide(index, true);
      });
      this._indicators.push(btn);
      li.appendChild(btn);
      nav.appendChild(li);
    }
    if (this.options.indicatorsPosition === 'top') {
      this.element.prepend(nav);
    } else {
      this.element.append(nav);
    }
  }

  /**
   * @param {number} activeIndex
   * @private
   */
  _updateIndicators(activeIndex) {
    this._indicators.forEach((btn) => {
      btn.removeAttribute('aria-current');
    });

    if (this.options.infinite) {
      if (activeIndex > 0) {
        if (activeIndex === this._nbIndicators + 1) {
          activeIndex = 0;
        } else {
          --activeIndex;
        }
      }
    }
    this._indicators[activeIndex].setAttribute('aria-current', 'true');
  }

  _updateLiveRegion() {
    this.liveRegion.textContent = 'Item ' + this.currentSlide + ' sur ' + (this.totalSlide - 2);
  }

  /**
   * @param {number } index
   * @param {boolean} setFocus
   * @private
   */
  _setSlideIndex(index, setFocus) {
    console.log('SLIDE INDEX = ', index);
    this.slides.forEach((slide) => {
      slide.removeAttribute('aria-current');
      slide.setAttribute('aria-hidden', 'true');
    });

    const slide = this.slides[index];
    this.slidesContainer.style.setProperty('--slide-index', index.toString());
    slide.setAttribute('aria-hidden', 'false');
    slide.setAttribute('aria-current', 'true');

    if (setFocus) {
      slide.setAttribute('tabindex', '-1');
      slide.focus();
    }

    if (this.options.showIndicators) {
      this._updateIndicators(index);
    }
    this._updateLiveRegion();

    this.currentSlide = index;
  }

  /**
   * @param {number} index
   * @param {boolean} setFocus
   * @private
   */
  _gotoSlide(index, setFocus = false) {
    const newIndex = clamp(index, 0, this.totalSlide - 1);
    this._setSlideIndex(newIndex, setFocus);
  }

  /**
   * @param {number} direction -1 slide to left, +1 slide to right
   * @param setFocus
   * @private
   */
  _shiftSlide(direction, setFocus = false) {
    const nextIndex = this.currentSlide + direction;

    let newIndex = clamp(nextIndex, 0, this.totalSlide - 1);

    if (this.animated && this.options.infinite) {
      newIndex = clamp(nextIndex, -1, this.totalSlide);
    } else if (!this.animated && !this.options.infinite) {
      if (nextIndex < 0) {
        newIndex = this.totalSlide - 1;
      } else if (nextIndex > this.totalSlide - 1) {
        newIndex = 0;
      }
    }

    this._gotoSlide(newIndex, setFocus);
  }

  /**
   * @param {boolean} setFocus
   * @private
   */
  _gotoPreviousSlide(setFocus = false) {
    this._shiftSlide(-1, setFocus);
  }

  /**
   * @param {boolean} setFocus
   * @private
   */
  _gotoNextSlide(setFocus = false) {
    this._shiftSlide(+1, setFocus);
  }

  _updateSlides() {
    if (this.options.infinite) {
      const minSlide = this.options.slideByPage ? 0 : this.slidesPerPage - 1;
      const maxSlide = this.options.slideByPage ? this.totalSlide - 1 : this.totalSlide - this.slidesPerPage;
      if (this.currentSlide === minSlide) {
        this.slidesContainer.style.transition = 'none';
        const newIndex = this.options.slideByPage ? this.totalSlide - 2 : this.totalSlide - this.slidesPerPage - 1;
        this._gotoSlide(newIndex, this.setFocus && !this.animated);
      } else if (this.currentSlide === maxSlide) {
        this.slidesContainer.style.transition = 'none';
        const newIndex = this.options.slideByPage ? 1 : this.slidesPerPage;
        this._gotoSlide(newIndex, this.setFocus && !this.animated);
      }
    }
    // const targetIndex = (this.options.slideByPage) ? (this.currentSlide * this.slidesPerPage) : this.currentSlide;

    if (this.options.infinite) {
      setTimeout(() => {
        this.slidesContainer.style.transition = `all ${this.options.transitionSpeedInMs}ms ${this.options.transitionTimingFunc}`;
      });
    }
  }

  _animate() {
    if (this.animated) {
      this.animationSuspended = false;
      if (this.options.direction === 1) {
        this.timer = setInterval(() => {
          this._gotoNextSlide();
        }, this.options.intervalInMs);
      } else {
        this.timer = setInterval(() => {
          this._gotoPreviousSlide();
        }, this.options.intervalInMs);
      }
    }
  }

  _startAnimation() {
    this.animated = true;
    if (this.options.showIndicators && this.options.showButtonAction) {
      this.btnAction.innerHTML = '<span class="sr-only">Stop animation</span><span>￭</span>';
      this.btnAction.setAttribute('data-action', 'stop');
    }
    this._animate();
  }

  _suspendAnimation() {
    if (!this.animationSuspended && this.animated) {
      clearInterval(this.timer);
      this.timer = null;
      this.animationSuspended = true;
    }
  }

  _resumeAnimation() {
    if (this.animationSuspended) {
      this.animationSuspended = false;
      this._animate();
    }
  }

  _stopAnimation() {
    this._suspendAnimation();
    this.animated = false;
    if (this.options.showIndicators && this.options.showButtonAction) {
      this.btnAction.innerHTML = '<span class="sr-only">Start animation</span><span>▶</span>';
      this.btnAction.setAttribute('data-action', 'start');
    }
  }

  /**
   * @param {MouseEvent} event
   * @returns {number}
   * @private
   */
  _getMousePositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  _prevButtonClickHandler() {
    this._gotoPreviousSlide(this.setFocus);
  }

  _nextButtonClickHandler() {
    this._gotoNextSlide(this.setFocus);
  }

  _actionButtonClickHandler() {
    if (this.btnAction.getAttribute('data-action') === 'start') {
      this._startAnimation();
    } else {
      this._stopAnimation();
    }
  }

  _sliderMouseLeaveEventHandler() {
    this._resumeAnimation();
  }

  _sliderMouseEnterEventHandler() {
    this._suspendAnimation();
  }

  _dragAnim() {
    if (this._isDragging) {
      this.slidesContainer.style.setProperty('--slide-index', (this.currentSlide + this._dragDelta).toString());
      requestAnimationFrame(this.dragAnimBind);
    }
  }

  /**
   * @param {MouseEvent} event
   * @private
   */
  _touchStartHandler(event) {
    this._isDragging = true;
    this._dragStartPos = this._getMousePositionX(event);
    this._grabElement = event.currentTarget;
    // this.slides[this.currentSlide].classList.add('grabbing');
    this._grabElement.classList.add('grabbing');
    // this.slides[this.currentSlide].style.userSelect = "none";
    this._dragRAFRef = requestAnimationFrame(this.dragAnimBind);
  }

  /**
   * @param {MouseEvent} event
   * @private
   */
  _touchMoveHandler(event) {
    if (this._isDragging) {
      const currentPosition = this._getMousePositionX(event);
      const movedBy = this._dragStartPos - currentPosition;
      this._dragDelta = movedBy / this._elementWidth;
    }
  }

  /**
   * @param {MouseEvent} event
   * @private
   */
  _touchEndHandler(event) {
    if (this._isDragging) {
      cancelAnimationFrame(this._dragRAFRef);
      this._isDragging = false;
      this._grabElement.classList.remove('grabbing');
      // this.slides[this.currentSlide].style.removeProperty("user-select");
      const currentPosition = this._getMousePositionX(event);
      const movedBy = this._dragStartPos - currentPosition;
      this._dragDelta = movedBy / this._elementWidth;
      if (this._dragDelta >= this._dragThreshold) {
        this._gotoNextSlide(this.setFocus);
      } else if (this._dragDelta <= -this._dragThreshold) {
        this._gotoPreviousSlide(this.setFocus);
      } else {
        this._gotoSlide(this.currentSlide, true);
      }
      this._dragDelta = 0;
      this._dragStartPos = 0;
    }
  }

  /**
   * Attache une classe "Slidify" sur les éléments contenant l'attribut [data-js-slider]
   * @return {Slidify[]}
   */
  static bind() {
    return Array.from(document.querySelectorAll('[data-js-slider]')).map((element) => {
      return new Slidify(element);
    });
  }
}
