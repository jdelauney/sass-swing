import CustomComponent from '../core/CustomComponent';
import { clamp } from '../core/helpers/mathUtils';

export default class Slidify extends CustomComponent {
  constructor(element) {
    super(element);

    this.options = this._parseAttributs();
    this.visibleSlides = getComputedStyle(this.element).getPropertyValue('--slides-visible');

    this.onButtonPrevClick = this._prevButtonClickHandler.bind(this);
    this.onButtonNextClick = this._nextButtonClickHandler.bind(this);
    this.onSliderMouseenter = this._sliderEnterEventHandler.bind(this);
    this.onSliderMouseleave = this._sliderLeaveEventHandler.bind(this);
    this.onSliderfocusin = this._sliderEnterEventHandler.bind(this);
    this.onSliderfocusout = this._sliderLeaveEventHandler.bind(this);
    this.onActionButtonClick = this._actionButtonClickHandler.bind(this);
    this.onTransitionEnd = this._updateSlides.bind(this);
    this.dragAnimBind = this._dragAnim.bind(this);
    /*		this.onSlideMousedown = this._dragStartHandler.bind(this);
				this.onSlideTouchstart  = this._dragStartHandler.bind(this);
				this.onSlideTouchend = this._dragEndHandler.bind(this);
				this.onSlideTouchmove = this._dragActionHandler.bind(this); */

    this.btnPrev = this.element.querySelector('.slider__controls-prev');
    this.btnNext = this.element.querySelector('.slider__controls-next');

    this.hasButtonControls = this.btnPrev !== undefined && this.btnNext !== undefined;

    // this.slidesWrapper = this.element.querySelector(".slider__slides");
    this.slidesContainer = this.element.querySelector('.slider__slides');

    if (this.options.center) {
      this.visibleSlides = 2;
      this.element.style.setProperty('--slides-visible', '2');
    }

    this.slideSizeInpx = this.slidesContainer.offsetWidth / this.visibleSlides;

    this.slides = this.slidesContainer.querySelectorAll('.slide');

    this.totalSlide = this.slides.length;
    this.totalPages = this.totalSlide / this.visibleSlides;

    // this.stepping = 100 / this.totalSlide;

    this.navButtons = [];
    this.setFocus = false;
    this.animated = false;
    this.animationSuspended = true;
    this._dragStartPos = 0;

    this._prevTranslate = -1;
    this._currentTranslate = 0;
    this._dragThreshold = 100;
    this._isDragging = false;
    this._dragRAFRef = null;

    this.timer = null;

    this._init();
  }

  _getMousePositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  _parseAttributs() {
    const defaultOptions = {
      showNavigation: true,
      showButtonAction: true,
      intervalInMs: 5000,
      direction: 1,
      startingSlide: 0,
      slidePerPage: 1,
      slidePage: true,
      transitionSpeedInMs: 300,
      transitionTimingFunc: 'ease-out',
      infinite: true,
      autoplay: true,
      center: false,
    };
    if (this.element.dataset.jsSlider.startsWith('{')) {
      return {
        ...defaultOptions,
        ...JSON.parse(this.element.dataset.jsSlider),
      };
    }
    return { ...defaultOptions };
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

  _createNavigation() {
    const nav = document.createElement('ul');
    nav.className = 'slider__navigation';
    if (this.options.showButtonAction) {
      const li = document.createElement('li');
      this.btnAction = this._createActionButton();
      li.appendChild(this.btnAction);
      nav.appendChild(li);
    }

    for (let i = 0; i < this.slides.length; i++) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      const span = document.createElement('span');
      span.className = 'sr-only';
      span.textContent = 'Item ' + i.toString() + ' sur ' + this.slides.length.toString();
      btn.appendChild(span);
      btn.addEventListener('click', () => {
        this._gotoSlide(i + 1, true);
      });
      this.navButtons.push(btn);
      li.appendChild(btn);
      nav.appendChild(li);

      this.element.appendChild(nav);
    }
  }

  _createLiveRegion() {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('class', 'slider__liveRegion sr-only');
    this.element.appendChild(this.liveRegion);
  }

  _updateLiveRegionTextContent() {
    this.liveRegion.textContent = 'Item ' + this.currentSlide + ' sur ' + (this.totalSlide - 2);
  }

  _updateNavigation() {
    this.navButtons.forEach((btn) => {
      btn.removeAttribute('aria-current');
    });
    // const currentIndex =  (this.options.center === true) ? this.currentSlide : this.currentSlide - 1;
    const currentIndex = this.currentSlide - 1;
    this.navButtons[currentIndex].setAttribute('aria-current', 'true');
  }

  _gotoSlide(index, setFocus = false) {
    index = clamp(index, this.totalSlide - 1, 0);
    this.setFocus = setFocus;

    this.slides.forEach((slide) => {
      slide.className = 'slide';
      slide.removeAttribute('aria-current');
      slide.setAttribute('aria-hidden', 'true');
    });

    this.slides[index].setAttribute('aria-hidden', 'false');
    this.slides[index].setAttribute('aria-current', 'true');

    this._currentTranslate = -(index * this.slideSizeInpx);
    if (this.options.slidePage) {
      this._currentTranslate *= this.options.slidePerPage;
    }
    if (this.options.center) {
      this._currentTranslate -= this.slideSizeInpx / 2;
    }

    this._prevTranslate = this._currentTranslate;
    this.slidesContainer.style.transform = `translateX(${this._currentTranslate}px)`;

    this.currentSlide = index;
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
          this._gotoPrevSlide();
        }, this.options.intervalInMs);
      }
    }
  }

  _shiftSlide(direction, setFocus = false) {
    const newIndex = clamp(this.currentSlide + direction, this.totalSlide - 1, 0);

    if (!this.options.infinite) {
      if (newIndex >= this.totalSlide - 1 || newIndex <= 0) {
        return;
      }
    }
    this.slidesContainer.style.transition = `all ${this.options.transitionSpeedInMs}ms ${this.options.transitionTimingFunc}`;
    this._gotoSlide(newIndex, setFocus);
  }

  _gotoPrevSlide(setFocus = false) {
    this._shiftSlide(-1, setFocus);
  }

  _gotoNextSlide(setFocus = false) {
    this._shiftSlide(+1, setFocus);
  }

  _updateSlides() {
    if (this.currentSlide === 0) {
      this.slidesContainer.style.transition = 'none';
      this._gotoSlide(this.totalSlide - 2);
    } else if (this.currentSlide === this.totalSlide - 1) {
      this.slidesContainer.style.transition = 'none';
      this._gotoSlide(1);
    }

    const slide = this.slides[this.currentSlide];
    if (this.setFocus) {
      slide.setAttribute('tabindex', '-1');
      slide.focus();
      this.setFocus = false;
    }
    if (this.options.showNavigation) {
      this._updateNavigation();
    }
    this._updateLiveRegionTextContent();

    setTimeout(() => {
      this.slidesContainer.style.transition = `all ${this.options.transitionSpeedInMs}ms ${this.options.transitionTimingFunc}`;
    });
  }

  _startAnimation() {
    this.animated = true;
    if (this.options.showNavigation && this.options.showButtonAction) {
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

  _stopAnimation() {
    this._suspendAnimation();
    this.animated = false;
    if (this.options.showNavigation && this.options.showButtonAction) {
      this.btnAction.innerHTML = '<span class="sr-only">Start animation</span><span>▶</span>';
      this.btnAction.setAttribute('data-action', 'start');
    }
  }

  _sliderLeaveEventHandler() {
    this._animate();
  }

  _sliderEnterEventHandler() {
    this._suspendAnimation();
  }

  _prevButtonClickHandler() {
    this._gotoPrevSlide(true);
  }

  _nextButtonClickHandler() {
    this._gotoNextSlide(true);
  }

  _actionButtonClickHandler() {
    if (this.btnAction.getAttribute('data-action') === 'start') {
      this._startAnimation();
    } else {
      this._stopAnimation();
    }
  }

  _dragAnim() {
    this.slidesContainer.style.transform = `translateX(${this._currentTranslate}px)`;
    if (this._isDragging) requestAnimationFrame(this.dragAnimBind);
  }

  _touchStartHandler(event) {
    this._dragStartPos = this._getMousePositionX(event);
    this._dragRAFRef = requestAnimationFrame(this.dragAnimBind);
    this._isDragging = true;
    this.slides[this.currentSlide].classList.add('grabbing');
    this.slides[this.currentSlide].style.userSelect = 'none';
  }

  _touchEndHandler() {
    cancelAnimationFrame(this._dragRAFRef);
    this._isDragging = false;
    const movedBy = this._currentTranslate - this._prevTranslate;

    this.slides[this.currentSlide].classList.remove('grabbing');
    this.slides[this.currentSlide].style.removeProperty('user-select');
    let currentIndex = this.currentSlide;
    if (movedBy < -this._dragThreshold && currentIndex < this.totalSlide - 1) {
      currentIndex += 1;
    } else if (movedBy > this._dragThreshold && currentIndex > 0) {
      currentIndex -= 1;
    }
    this._gotoSlide(currentIndex);
  }

  _touchMoveHandler(event) {
    if (this._isDragging) {
      const currentPosition = this._getMousePositionX(event);
      this._currentTranslate = this._prevTranslate + currentPosition - this._dragStartPos;
    }
  }

  _init() {
    if (this.options.showNavigation) {
      this._createNavigation();
    }

    this._createLiveRegion();

    const firstClone = this.slides[0].cloneNode(true);
    const lastClone = this.slides[this.totalSlide - 1].cloneNode(true);

    this.slidesContainer.append(firstClone);
    this.slidesContainer.prepend(lastClone);

    this.slides = this.slidesContainer.querySelectorAll('.slide');
    this.totalSlide = this.slides.length;

    this.currentSlide = clamp(this.options.startingSlide + 1, this.totalSlide - 2, 1);

    if (this.options.center) {
      this.currentSlide--;
    }

    this.element.addEventListener('mouseenter', this.onSliderMouseenter);
    this.element.addEventListener('mouseleave', this.onSliderMouseleave);
    this.element.addEventListener('focusin', this.onSliderfocusin);
    this.element.addEventListener('focusout', this.onSliderfocusout);

    if (this.hasButtonControls) {
      this.btnPrev.addEventListener('click', this.onButtonPrevClick);
      this.btnNext.addEventListener('click', this.onButtonNextClick);
    }

    this.slidesContainer.addEventListener('transitionend', this.onTransitionEnd);

    this.slides.forEach((slide) => {
      slide.addEventListener('touchstart', this._touchStartHandler.bind(this));
      slide.addEventListener('touchend', this._touchEndHandler.bind(this));
      slide.addEventListener('touchmove', this._touchMoveHandler.bind(this));
      // mouse events
      slide.addEventListener('mousedown', this._touchStartHandler.bind(this));
      slide.addEventListener('mouseup', this._touchEndHandler.bind(this));
      slide.addEventListener('mousemove', this._touchMoveHandler.bind(this));
      slide.addEventListener('mouseleave', this._touchEndHandler.bind(this));
    });
    /* this.slidesContainer.onmousedown = this.onSlideMousedown;
		this.slidesContainer.addEventListener("touchstart", this.onSlideTouchstart);
		this.slidesContainer.addEventListener("touchend", this.onSlideTouchend);
		this.slidesContainer.addEventListener("touchmove", this.onSlideTouchmove); */

    this.slidesContainer.style.transition = 'none';
    this._gotoSlide(this.currentSlide);
    setTimeout(() => {
      this.slidesContainer.style.transition = `all ${this.options.transitionSpeedInMs}ms ${this.options.transitionTimingFunc}`;
    });

    if (this.options.autoplay) {
      this._startAnimation();
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
