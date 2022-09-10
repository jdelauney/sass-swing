/**
 * Suspend l'exécution du code pendant duration en ms
 * @param {Number} duration in ms
 * @return {Promise}
 */
export const wait = (duration) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
};

/**
 * Execute une fonction callback après timeout en ms
 * @param {function} callback
 * @param {Number} timeout in ms
 * @return {function}
 */
export const debounce = (callback, timeout = 200) => {
  let debounceTimeoutId = null;

  return (...args) => {
    window.clearTimeout(debounceTimeoutId);
    debounceTimeoutId = window.setTimeout(() => {
      debounceTimeoutId = null;
      callback.apply(null, args);
    }, timeout);
  };
};

/**
 * Version asynchrone de debounce
 * @param {function} callback
 * @param {Number} timeout in ms
 * @return {function(...[*]): Promise<unknown>}
 */
export const debounceAsync = (callback, timeout = 200) => {
  let debounceTimeoutId = null;
  return (...args) => {
    clearTimeout(debounceTimeoutId);
    return new Promise((resolve) => {
      debounceTimeoutId = setTimeout(() => {
        debounceTimeoutId = null;
        return resolve(callback.apply(null, args));
      }, timeout);
    });
  };
};

/**
 * Execute une fonction appelée X fois que toutes les timeout ms
 * @param {function} callback
 * @param {number} timeout
 * @return {(function(): void)|*}
 */
export const throttle = (callback, timeout = 1000) => {
  let throttle = true;
  return (...args) => {
    if (throttle) {
      callback.apply(null, args);
      throttle = false;
      setTimeout(() => {
        throttle = true;
      }, timeout);
    }
  };
};

// export const randomHTMLColor = () => {
// 	const randomColor = Math.floor(Math.random()*16777215).toString(16);
// 	return "#" + randomColor;
// }
