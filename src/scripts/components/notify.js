/**
 * Classe permettant de créer des boites notifications
 * @param {Object} config
 */
export class Notify {
  /**
   * Paramètres par défaut des notifications
   * @type {{displayIcon: boolean, displayCloseButton: boolean, position: string, showDuration: number, closeOnClick: boolean, animationType: string}}
   * @private
   */
  _defaultConfig = {
    showDuration: 0, // Affiche les notifications pendant 7 secondes
    closeOnClick: false,
    displayCloseButton: true,
    displayIcon: true,
    animationType: 'slide', //  fade, slide
    position: 'top-center', // top-left, top-center, top-right,  mid-left, mid-center, mid-right,  bottom-left, bottom-center, bottom-right
  };

  /**
   * Paramètres des notifications cf. _defaultConfig
   * @type {Object}
   * @private
   */
  _config = {};

  /**
   * Elément conteneur des notifications
   * @type {HTMLElement}
   * @private
   */
  _container;

  /**
   * Tableau des notifications
   * @type {HTMLElement[]}
   * @private
   */
  _notifications = [];

  /**
   * Increment pour le nombre de notifications
   * @type {number}
   * @private
   */
  _autoIncrement = 0;

  /**
   * Constructeur de la classe
   * @param {Object} config pour personnaliser la configuration cf. _defaultConfig
   */
  constructor(config = {}) {
    this.setConfig(config);
  }

  /**
   * Définis la configuration
   * @param {Object} config  pour personnaliser la configuration cf. _defaultConfig
   */
  setConfig(config = {}) {
    if (typeof config.showDuration !== 'number') {
      config.showDuration = this._defaultConfig.showDuration;
    }

    this._config = {
      ...this._defaultConfig,
      ...this._config,
      ...config,
    };
  }

  /**
   * Creation de l'élément conteneur des notifications
   * @param {Object} config
   * @private
   */
  _createContainer(config) {
    this._container = document.querySelector('.notifications');
    if (this._container !== null) {
      return;
    }
    this._container = document.createElement('div');
    this._container.className = `notifications notifications--${config.position}`;

    document.body.appendChild(this._container);
  }

  /**
   * Utilitaire pour mapper le type d'animation entrante
   * @param {String} animeType
   * @param {String} position
   * @return {string}
   * @private
   */
  _mapAnimateIn(animeType = 'fade', position = 'bottom-right') {
    if (animeType === 'slide') {
      switch (position) {
        case 'top-right':
        case 'mid-right':
        case 'bottom-right':
          return ' notification-animIn--slide-right';
        case 'top-left':
        case 'mid-left':
        case 'bottom-left':
          return ' notification-animIn--slide-left';
        case 'top-center':
        case 'mid-center':
          return ' notification-animIn--slide-top';
        case 'bottom-center':
          return ' notification-animIn--slide-bottom';
      }
    }
    return ' notification-animIn--fade';
  }

  /**
   * Utilitaire pour mapper le type d'animation sortante
   * @param {String} animeType
   * @param {String} position
   * @return {string}
   * @private
   */
  _mapAnimateOut(animeType = 'fade', position = 'bottom-right') {
    if (animeType === 'slide') {
      switch (position) {
        case 'top-right':
        case 'mid-right':
        case 'bottom-right':
          return ' notification-animOut--slide-right';
        case 'top-left':
        case 'mid-left':
        case 'bottom-left':
          return ' notification-animOut--slide-left';
        case 'top-center':
        case 'mid-center':
          return ' notification-animOut--slide-top';
        case 'bottom-center':
          return ' notification-animOut--slide-bottom';
      }
    }
    return ' notification-animOut--fade';
  }

  /**
   * Rendu d'une notification
   * @param {String} type
   * @param {String} title
   * @param {String} message
   * @param {Object} config  pour personnaliser la configuration cf _defaultConfig
   * @return {HTMLDivElement|void}
   * @private
   */
  _render(type, title, message, config = null) {
    if (!title && !message) {
      return console.warn('Notification must contain a title or a message!');
    }

    const currentConfig = { ...this._config, ...config };

    // this.setConfig(config);

    this._createContainer(currentConfig);

    const notification = document.createElement('div');
    const id = ++this._autoIncrement;
    notification.id = 'notification-' + id.toString();
    notification.setAttribute('role', 'status');

    let classCss = 'notification';
    if (type !== '' && type !== 'default') {
      classCss += ` ui--${type}`;
    }
    const hasIcon = type !== '' && type !== 'default' && type !== 'primary' && type !== 'secondary';

    classCss += this._mapAnimateIn(currentConfig.animationType, currentConfig.position);
    notification.className = classCss;

    if (currentConfig.displayCloseButton) {
      const closeBtn = document.createElement('div');
      closeBtn.className = 'notification__close';
      if (currentConfig.closeOnClick === false) {
        closeBtn.addEventListener('click', () => {
          this._hide(notification, currentConfig);
        });
      }
      notification.appendChild(closeBtn);
    }

    if (currentConfig.displayIcon && hasIcon === true) {
      const icon = document.createElement('span');
      notification.appendChild(icon);
    }

    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification__content';

    if (title !== '') {
      const h4 = document.createElement('h4');
      h4.innerHTML = title;
      notificationContent.appendChild(h4);
    }

    if (message !== '') {
      const p = document.createElement('p');
      p.innerHTML = message;
      notificationContent.appendChild(p);
    }

    if (currentConfig.closeOnClick === true) {
      notification.style.cursor = 'pointer';
      notification.addEventListener('click', () => {
        this._hide(notification, currentConfig);
      });
    }

    notification.appendChild(notificationContent);

    if (currentConfig.showDuration && currentConfig.showDuration > 0) {
      const timeOut = setTimeout(() => {
        this._hide(notification, currentConfig);
        clearTimeout(timeOut);
      }, currentConfig.showDuration);

      if (currentConfig.closeOnClick || currentConfig.displayCloseButton) {
        notification.addEventListener('click', () => {
          this._hide(notification, currentConfig);
          clearTimeout(timeOut);
        });
      }
    }

    this._container.appendChild(notification);
    this._notifications[notification.id] = notification;

    return notification;
  }

  /**
   * Supprime une notification et supprime le conteneur, si il n'y a plus de notifications
   * @param {AnimationEvent} notification
   * @private
   */
  _removeNotification(notification) {
    notification.target.remove();
    delete this._notifications[notification.target.id];
    setTimeout(() => {
      if (this._container.querySelectorAll('.notification').length === 0) {
        const container = document.querySelector('.notifications');
        if (container !== null) {
          document.body.removeChild(container);
        }
      }
    }, 1000);

    // if (this._notifications.length === 0) {
    // 	document.body.removeChild(this._container);
    // }
  }

  /**
   * Cache une notification
   * @param {HTMLElement} notification
   * @param {Object} config
   * @private
   */
  _hide(notification, config) {
    notification.className += this._mapAnimateOut(config.animationType, config.position);
    notification.addEventListener('animationend', this._removeNotification.bind(this), false);
  }

  /**
   * Rendu d'une notification personnalisée
   * @param {String} title
   * @param {String} message
   * @param {String} type (default, success, warning, danger, info)
   * @param {Object} config
   */
  notify(title, message, type = 'default', config = {}) {
    this._render(type, title, message, config);
  }

  /**
   * Rendu d'une notification de type "Success"
   * @param {String} title
   * @param {String} message
   * @param {Object} config
   */
  success(title, message, config = {}) {
    this.notify(title, message, 'success', config);
  }

  /**
   * Rendu d'une notification de type "Warning"
   * @param {String} title
   * @param {String} message
   * @param {Object} config
   */
  warn(title, message, config = {}) {
    this.notify(title, message, 'warning', config);
  }

  /**
   * Rendu d'une notification de type "Error/Danger"
   * @param {String} title
   * @param {String} message
   * @param {Object} config
   */
  error(title, message, config = {}) {
    this.notify(title, message, 'danger', config);
  }

  /**
   * Rendu d'une notification de type "Info"
   * @param {String} title
   * @param {String} message
   * @param {Object} config
   */
  info(title, message, config = {}) {
    this.notify(title, message, 'info', config);
  }

  /**
   * Retourne la liste des notifications
   * @return {HTMLElement[]}
   */
  getNotifications() {
    return this._notifications;
  }
}

/**
 * Variable globale déclarant un object Notify
 * @type {Notify}
 */
export const notify = new Notify();
