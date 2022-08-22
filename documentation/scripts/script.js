var t,e;t=this,e=function(t){class e extends class{constructor(){this._observers={}}addEventListener(t,e){void 0===this._observers[t]&&(this._observers[t]=[]),this._observers[t].push(e)}removeEventListener(t,e){this._observers[t]=this._observers[t].filter((t=>{if(t!==e)return t}))}trigger(t,...e){if(void 0!==this._observers[t])for(let i=0;i<this._observers[t].length;i++)this._observers[t][i](...e)}}{constructor(t){if(super(),this.element='string'==typeof t?document.querySelector(t):t,null===this.element||void 0===this.element)return!1;this.isTouchScreen='ontouchstart'in window||navigator.maxTouchPoints>0||navigator.msMaxTounchPoints>0}}class i extends e{constructor(t){super(t),this.options=this.parseAttribute(),this.target=this.element.querySelector('ul'),this.onClick=this.onClick.bind(this),this.onClickOutside=this.onClickOutside.bind(this),this.onMouseEnter=this.onMouseEnter.bind(this),this.onMouseLeave=this.onMouseLeave.bind(this),this.collapsed=!0,this.initListener()}parseAttribute(){const t={hideOnClickOutside:!0,showOnHover:!1};return this.element.dataset.jsDropdown.startsWith('{')?{...t,...JSON.parse(this.element.dataset.jsDropdown)}:{...t}}initListener(){this.options.showOnHover?(this.element.addEventListener('mouseenter',this.onMouseEnter),this.element.addEventListener('mouseleave',this.onMouseLeave)):this.element.addEventListener('click',this.onClick),this.options.hideOnClickOutside&&document.addEventListener('click',this.onClickOutside)}show(){this.target.classList.add('expanded'),this.element.setAttribute('aria-expanded','true'),this.target.setAttribute('aria-hidden','false'),this.collapsed=!1}hide(){this.target.classList.remove('expanded'),this.element.setAttribute('aria-expanded','false'),this.target.setAttribute('aria-hidden','true'),this.collapsed=!0}onMouseEnter(){this.show()}onMouseLeave(){this.hide()}onClick(){this.collapsed?this.show():this.hide()}onClickOutside(t){this.element.contains(t.target)||this.hide(),t.stopPropagation()}static bind(){return Array.from(document.querySelectorAll('[data-js-dropdown]')).map((t=>new i(t)))}}class s extends e{constructor(t){super(t),this.tablist=this.element.querySelector('[role="tablist"]'),this.tabs=this.tablist.querySelectorAll('li > [role="tab"]'),this.panelSection=this.element.querySelector('section'),this.panels=this.panelSection.querySelectorAll('[role="tabpanel"]'),this.onTabClick=this._navClickHandler.bind(this),this.onTabKeydown=this._navKeydownHandler.bind(this),this.onTabKeyup=this._navKeyupHandler.bind(this),this.onWindowResize=this._windowResizeHandler.bind(this),this._init()}_switchTab(t){const e=t.key,i={ArrowLeft:-1,ArrowRight:1}[e],s=t.target.index;void 0!==s&&(this.tabs[s+i]?this.tabs[s+i].focus():'ArrowRight'===e?this._focusLastTab():'ArrowLeft'===e&&this._focusFirstTab())}_windowResizeHandler(){this._setPanelSectionHeight()}_navClickHandler(t){t.preventDefault();const e=t.target;this._showTab(e)}_navKeydownHandler(t){switch(t.key){case'Home':t.preventDefault(),this._focusFirstTab();break;case'End':t.preventDefault(),this._focusLastTab();break;case' ':t.stopImmediatePropagation(),t.preventDefault(),t.stopPropagation()}}_navKeyupHandler(t){switch(t.key){case'ArrowLeft':case'ArrowRight':t.preventDefault(),this._switchTab(t);break;case' ':case'Enter':t.preventDefault(),this._showTab(t.target)}}_getPanelHeight(t){if('none'!==getComputedStyle(t).display)return t.offsetHeight+4;t.style.display='block';const e=t.offsetHeight+4;return t.style.display='',e}_setPanelSectionHeight(){let t=0;this.panels.forEach((e=>{const i=this._getPanelHeight(e);t=Math.max(t,i)})),this.panelSection.style.height=t+'px'}_init(){this._setPanelSectionHeight(),this.tabs.forEach(((t,e)=>{t.addEventListener(this.isTouchScreen?'touchend':'click',this.onTabClick),t.addEventListener('keydown',this.onTabKeydown),t.addEventListener('keyup',this.onTabKeyup),t.index=e})),window.addEventListener('resize',this.onWindowResize)}_focusFirstTab(){this.tabs[0].focus()}_focusLastTab(){this.tabs[this.tabs.length-1].focus()}_showTab(t,e=!0){this._hideAllTabs(),t.setAttribute('tabindex','0'),t.setAttribute('aria-selected','true');const i=t.getAttribute('aria-controls'),s=document.getElementById(i);s.setAttribute('aria-hidden','false'),s.setAttribute('aria-expanded','true'),e&&t.focus()}_hideAllTabs(){this.tabs.forEach((t=>{t.setAttribute('tabindex','-1'),t.setAttribute('aria-selected','false')})),this.panels.forEach((t=>{t.setAttribute('aria-hidden','true'),t.setAttribute('aria-expanded','false')}))}static bind(){return Array.from(document.querySelectorAll('.tabs')).map((t=>new s(t)))}}const n=(t,e,i)=>Math.min(Math.max(t,e),i);class o extends e{constructor(t){super(t),this.options=this._parseAttributs(),this.visibleSlides=getComputedStyle(this.element).getPropertyValue('--slides-visible'),this.onButtonPrevClick=this._prevButtonClickHandler.bind(this),this.onButtonNextClick=this._nextButtonClickHandler.bind(this),this.onSliderMouseenter=this._sliderEnterEventHandler.bind(this),this.onSliderMouseleave=this._sliderLeaveEventHandler.bind(this),this.onSliderfocusin=this._sliderEnterEventHandler.bind(this),this.onSliderfocusout=this._sliderLeaveEventHandler.bind(this),this.onActionButtonClick=this._actionButtonClickHandler.bind(this),this.onTransitionEnd=this._updateSlides.bind(this),this.dragAnimBind=this._dragAnim.bind(this),this.btnPrev=this.element.querySelector('.slider__controls-prev'),this.btnNext=this.element.querySelector('.slider__controls-next'),this.hasButtonControls=void 0!==this.btnPrev&&void 0!==this.btnNext,this.slidesContainer=this.element.querySelector('.slider__slides'),this.options.center&&(this.visibleSlides=2,this.element.style.setProperty('--slides-visible','2')),this.slideSizeInpx=this.slidesContainer.offsetWidth/this.visibleSlides,this.slides=this.slidesContainer.querySelectorAll('.slide'),this.totalSlide=this.slides.length,this.totalPages=this.totalSlide/this.visibleSlides,this.navButtons=[],this.setFocus=!1,this.animated=!1,this.animationSuspended=!0,this._dragStartPos=0,this._prevTranslate=-1,this._currentTranslate=0,this._dragThreshold=100,this._isDragging=!1,this._dragRAFRef=null,this.timer=null,this._init()}_getMousePositionX(t){return t.type.includes('mouse')?t.pageX:t.touches[0].clientX}_parseAttributs(){const t={showNavigation:!0,showButtonAction:!0,intervalInMs:5e3,direction:1,startingSlide:0,slidePerPage:1,slidePage:!0,transitionSpeedInMs:300,transitionTimingFunc:'ease-out',infinite:!0,autoplay:!0,center:!1};return this.element.dataset.jsSlider.startsWith('{')?{...t,...JSON.parse(this.element.dataset.jsSlider)}:{...t}}_createActionButton(){const t=document.createElement('button'),e=document.createElement('span');e.className='sr-only',e.textContent=this.options.autoplay?'Stop animation':'Start animation',t.appendChild(e);const i=document.createElement('span');i.textContent=this.options.autoplay?'￭':'▶',t.appendChild(i);const s=this.options.autoplay?'stop':'start';return t.setAttribute('data-action',s),t.addEventListener('click',this.onActionButtonClick),t}_createNavigation(){const t=document.createElement('ul');if(t.className='slider__navigation',this.options.showButtonAction){const e=document.createElement('li');this.btnAction=this._createActionButton(),e.appendChild(this.btnAction),t.appendChild(e)}for(let e=0;e<this.slides.length;e++){const i=document.createElement('li'),s=document.createElement('button'),n=document.createElement('span');n.className='sr-only',n.textContent='Item '+e.toString()+' sur '+this.slides.length.toString(),s.appendChild(n),s.addEventListener('click',(()=>{this._gotoSlide(e+1,!0)})),this.navButtons.push(s),i.appendChild(s),t.appendChild(i),this.element.appendChild(t)}}_createLiveRegion(){this.liveRegion=document.createElement('div'),this.liveRegion.setAttribute('aria-live','polite'),this.liveRegion.setAttribute('aria-atomic','true'),this.liveRegion.setAttribute('class','slider__liveRegion sr-only'),this.element.appendChild(this.liveRegion)}_updateLiveRegionTextContent(){this.liveRegion.textContent='Item '+this.currentSlide+' sur '+(this.totalSlide-2)}_updateNavigation(){this.navButtons.forEach((t=>{t.removeAttribute('aria-current')}));const t=this.currentSlide-1;this.navButtons[t].setAttribute('aria-current','true')}_gotoSlide(t,e=!1){t=n(t,this.totalSlide-1,0),this.setFocus=e,this.slides.forEach((t=>{t.className='slide',t.removeAttribute('aria-current'),t.setAttribute('aria-hidden','true')})),this.slides[t].setAttribute('aria-hidden','false'),this.slides[t].setAttribute('aria-current','true'),this._currentTranslate=-t*this.slideSizeInpx,this.options.slidePage&&(this._currentTranslate*=this.options.slidePerPage),this.options.center&&(this._currentTranslate-=this.slideSizeInpx/2),this._prevTranslate=this._currentTranslate,this.slidesContainer.style.transform=`translateX(${this._currentTranslate}px)`,this.currentSlide=t}_animate(){this.animated&&(this.animationSuspended=!1,1===this.options.direction?this.timer=setInterval((()=>{this._gotoNextSlide()}),this.options.intervalInMs):this.timer=setInterval((()=>{this._gotoPrevSlide()}),this.options.intervalInMs))}_shiftSlide(t,e=!1){const i=n(this.currentSlide+t,this.totalSlide-1,0);!this.options.infinite&&(i>=this.totalSlide-1||i<=0)||(this.slidesContainer.style.transition=`all ${this.options.transitionSpeedInMs}ms ${this.options.transitionTimingFunc}`,this._gotoSlide(i,e))}_gotoPrevSlide(t=!1){this._shiftSlide(-1,t)}_gotoNextSlide(t=!1){this._shiftSlide(1,t)}_updateSlides(){0===this.currentSlide?(this.slidesContainer.style.transition='none',this._gotoSlide(this.totalSlide-2)):this.currentSlide===this.totalSlide-1&&(this.slidesContainer.style.transition='none',this._gotoSlide(1));const t=this.slides[this.currentSlide];this.setFocus&&(t.setAttribute('tabindex','-1'),t.focus(),this.setFocus=!1),this.options.showNavigation&&this._updateNavigation(),this._updateLiveRegionTextContent(),setTimeout((()=>{this.slidesContainer.style.transition=`all ${this.options.transitionSpeedInMs}ms ${this.options.transitionTimingFunc}`}))}_startAnimation(){this.animated=!0,this.options.showNavigation&&this.options.showButtonAction&&(this.btnAction.innerHTML='<span class="sr-only">Stop animation</span><span>￭</span>',this.btnAction.setAttribute('data-action','stop')),this._animate()}_suspendAnimation(){!this.animationSuspended&&this.animated&&(clearInterval(this.timer),this.timer=null,this.animationSuspended=!0)}_stopAnimation(){this._suspendAnimation(),this.animated=!1,this.options.showNavigation&&this.options.showButtonAction&&(this.btnAction.innerHTML='<span class="sr-only">Start animation</span><span>▶</span>',this.btnAction.setAttribute('data-action','start'))}_sliderLeaveEventHandler(){this._animate()}_sliderEnterEventHandler(){this._suspendAnimation()}_prevButtonClickHandler(){this._gotoPrevSlide(!0)}_nextButtonClickHandler(){this._gotoNextSlide(!0)}_actionButtonClickHandler(){'start'===this.btnAction.getAttribute('data-action')?this._startAnimation():this._stopAnimation()}_dragAnim(){this.slidesContainer.style.transform=`translateX(${this._currentTranslate}px)`,this._isDragging&&requestAnimationFrame(this.dragAnimBind)}_touchStartHandler(t){this._dragStartPos=this._getMousePositionX(t),this._dragRAFRef=requestAnimationFrame(this.dragAnimBind),this._isDragging=!0,this.slides[this.currentSlide].classList.add('grabbing'),this.slides[this.currentSlide].style.userSelect='none'}_touchEndHandler(){cancelAnimationFrame(this._dragRAFRef),this._isDragging=!1;const t=this._currentTranslate-this._prevTranslate;this.slides[this.currentSlide].classList.remove('grabbing'),this.slides[this.currentSlide].style.removeProperty('user-select');let e=this.currentSlide;t<-this._dragThreshold&&e<this.totalSlide-1?e+=1:t>this._dragThreshold&&e>0&&(e-=1),this._gotoSlide(e)}_touchMoveHandler(t){if(this._isDragging){const e=this._getMousePositionX(t);this._currentTranslate=this._prevTranslate+e-this._dragStartPos}}_init(){this.options.showNavigation&&this._createNavigation(),this._createLiveRegion();const t=this.slides[0].cloneNode(!0),e=this.slides[this.totalSlide-1].cloneNode(!0);this.slidesContainer.append(t),this.slidesContainer.prepend(e),this.slides=this.slidesContainer.querySelectorAll('.slide'),this.totalSlide=this.slides.length,this.currentSlide=n(this.options.startingSlide+1,this.totalSlide-2,1),this.options.center&&this.currentSlide--,this.element.addEventListener('mouseenter',this.onSliderMouseenter),this.element.addEventListener('mouseleave',this.onSliderMouseleave),this.element.addEventListener('focusin',this.onSliderfocusin),this.element.addEventListener('focusout',this.onSliderfocusout),this.hasButtonControls&&(this.btnPrev.addEventListener('click',this.onButtonPrevClick),this.btnNext.addEventListener('click',this.onButtonNextClick)),this.slidesContainer.addEventListener('transitionend',this.onTransitionEnd),this.slides.forEach((t=>{t.addEventListener('touchstart',this._touchStartHandler.bind(this)),t.addEventListener('touchend',this._touchEndHandler.bind(this)),t.addEventListener('touchmove',this._touchMoveHandler.bind(this)),t.addEventListener('mousedown',this._touchStartHandler.bind(this)),t.addEventListener('mouseup',this._touchEndHandler.bind(this)),t.addEventListener('mousemove',this._touchMoveHandler.bind(this)),t.addEventListener('mouseleave',this._touchEndHandler.bind(this))})),this.slidesContainer.style.transition='none',this._gotoSlide(this.currentSlide),setTimeout((()=>{this.slidesContainer.style.transition=`all ${this.options.transitionSpeedInMs}ms ${this.options.transitionTimingFunc}`})),this.options.autoplay&&this._startAnimation()}static bind(){return Array.from(document.querySelectorAll('[data-js-slider]')).map((t=>new o(t)))}}class a extends e{constructor(t,e){super(t),this.localStorageThemeModeKey=e,this.htmlRoot=document.querySelector('html'),this.currentTheme=window.localStorage.getItem(this.localStorageThemeModeKey),this.prefersDarkScheme=window.matchMedia('(prefers-color-scheme: dark)'),null!==this.currentTheme?this._toggleTheme(this.currentTheme):this.prefersDarkScheme.matches&&this._toggleTheme('dark'),this.onSwitcherClick=this._handlerSwitchClick.bind(this),this.element.addEventListener('click',this.onSwitcherClick)}_toggleTheme(t){this.currentTheme=t,this.htmlRoot.setAttribute('data-theme',this.currentTheme),window.localStorage.setItem(this.localStorageThemeModeKey,this.currentTheme)}_handlerSwitchClick(){const t='light'!==this.htmlRoot.getAttribute('data-theme')?'light':'dark';this._toggleTheme(t)}static bind(t='swing-theme-mode'){return Array.from(document.querySelectorAll('[data-js-themeSwitcher]')).map((e=>new a(e,t)))}}class r{_defaultConfig={showDuration:0,closeOnClick:!1,displayCloseButton:!0,displayIcon:!0,animationType:'slide',position:'top-center'};_config={};_container;_notifications=[];_autoIncrement=0;constructor(t={}){this.setConfig(t)}setConfig(t={}){'number'!=typeof t.showDuration&&(t.showDuration=this._defaultConfig.showDuration),this._config={...this._defaultConfig,...this._config,...t}}_createContainer(t){this._container=document.querySelector('.notifications'),null===this._container&&(this._container=document.createElement('div'),this._container.className=`notifications notifications--${t.position}`,document.body.appendChild(this._container))}_mapAnimateIn(t='fade',e='bottom-right'){if('slide'===t)switch(e){case'top-right':case'mid-right':case'bottom-right':return' notification-animIn--slide-right';case'top-left':case'mid-left':case'bottom-left':return' notification-animIn--slide-left';case'top-center':case'mid-center':return' notification-animIn--slide-top';case'bottom-center':return' notification-animIn--slide-bottom'}return' notification-animIn--fade'}_mapAnimateOut(t='fade',e='bottom-right'){if('slide'===t)switch(e){case'top-right':case'mid-right':case'bottom-right':return' notification-animOut--slide-right';case'top-left':case'mid-left':case'bottom-left':return' notification-animOut--slide-left';case'top-center':case'mid-center':return' notification-animOut--slide-top';case'bottom-center':return' notification-animOut--slide-bottom'}return' notification-animOut--fade'}_render(t,e,i,s=null){if(!e&&!i)return;const n={...this._config,...s};this._createContainer(n);const o=document.createElement('div'),a=++this._autoIncrement;o.id='notification-'+a.toString(),o.setAttribute('role','status');let r='notification';if(''!==t&&'default'!==t&&(r+=` ui--${t}`),r+=this._mapAnimateIn(n.animationType,n.position),o.className=r,n.displayCloseButton){const t=document.createElement('div');t.className='notification__close',!1===n.closeOnClick&&t.addEventListener('click',(()=>{this._hide(o,n)})),o.appendChild(t)}if(n.displayIcon){const t=document.createElement('span');o.appendChild(t)}const l=document.createElement('div');if(l.className='notification__content',''!==e){const t=document.createElement('h4');t.innerHTML=e,l.appendChild(t)}if(''!==i){const t=document.createElement('p');t.innerHTML=i,l.appendChild(t)}if(!0===n.closeOnClick&&(o.style.cursor='pointer',o.addEventListener('click',(()=>{this._hide(o,n)}))),o.appendChild(l),n.showDuration&&n.showDuration>0){const t=setTimeout((()=>{this._hide(o,n),clearTimeout(t)}),n.showDuration);(n.closeOnClick||n.displayCloseButton)&&o.addEventListener('click',(()=>{this._hide(o,n),clearTimeout(t)}))}return this._container.appendChild(o),this._notifications[o.id]=o,o}_removeNotification(t){t.target.remove(),delete this._notifications[t.target.id],setTimeout((()=>{if(0===this._container.querySelectorAll('.notification').length){const t=document.querySelector('.notifications');null!==t&&document.body.removeChild(t)}}),1e3)}_hide(t,e){t.className+=this._mapAnimateOut(e.animationType,e.position),t.addEventListener('animationend',this._removeNotification.bind(this),!1)}notify(t,e,i='default',s={}){this._render(i,t,e,s)}success(t,e,i={}){this.notify(t,e,'success',i)}warn(t,e,i={}){this.notify(t,e,'warning',i)}error(t,e,i={}){this.notify(t,e,'danger',i)}info(t,e,i={}){this.notify(t,e,'info',i)}getNotifications(){return this._notifications}}new r;const l=()=>{document.documentElement.style.setProperty('--doc-height',`${window.innerHeight}px`)};window.addEventListener('DOMContentLoaded',(()=>{s.bind(),i.bind(),o.bind(),a.bind()})),document.addEventListener('resize',((t,e=200)=>{let i=null;return(...s)=>{window.clearTimeout(i),i=window.setTimeout((()=>{i=null,t(...s)}),e)}})(l)),l(),t.Notify=r,t.default=class extends e{_config={};_modalResult='';constructor(t){super(t);try{this.buttons=this.element.querySelectorAll('button'),this.buttons.forEach((t=>{(t.hasAttribute('value')||t.hasAttribute('modal-result'))&&t.addEventListener('click',this._buttonHandlerClick.bind(this))}))}catch(t){return null}this.element.addEventListener('close',(()=>{document.querySelector('html').classList.remove('disabled-scroll')}))}_buttonHandlerClick(t){const e=t.currentTarget;this._modalResult='',e.hasAttribute('value')?this._modalResult=e.value:e.hasAttribute('modal-result')&&(this._modalResult=e.getAttribute('modal-result'))}_animationsCompleted(){return Promise.allSettled(this.element.getAnimations().map((t=>t.finished)))}async close(){await this._animationsCompleted(),this.element.close()}async showModal(){document.querySelector('html').classList.add('disabled-scroll'),this.element.showModal();const t=[...this.buttons].map((t=>{return e=t,i='click',new Promise((t=>{const s=()=>{e.removeEventListener(i,s),t()};e.addEventListener(i,s)}));var e,i}));return await Promise.race(t),await this.close(),new Promise((t=>{t(this._modalResult)}))}getFormData(){const t=this.getForm();return t?new FormData(t):null}getForm(){const t=this.element.querySelector('form');if(t)return t}forceFormInputFileReset(){const t=this.getForm().querySelectorAll('input[type="file"]');t&&t.forEach((t=>{t.value=''}))}},Object.defineProperty(t,'__esModule',{value:!0})},'object'==typeof exports&&'undefined'!=typeof module?e(exports):'function'==typeof define&&define.amd?define(['exports'],e):e((t='undefined'!=typeof globalThis?globalThis:t||self)['sass-swing']={});