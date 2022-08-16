/**
 * Suspend l'exécution du code pendant duration en ms
 * @param {Number} duration in ms
 * @return {Promise}
 */
export const wait = (duration) => {
	return new Promise(resolve => {
		window.setTimeout(resolve, duration)
	})
}

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
		debounceTimeoutId =  window.setTimeout(() => {
			debounceTimeoutId = null;
			callback(...args);
		}, timeout);
	}
}

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
			debounceTimeoutId =  setTimeout(() => {
				debounceTimeoutId = null;
				return resolve(callback(...args));
			}, timeout);
		})
	}
}