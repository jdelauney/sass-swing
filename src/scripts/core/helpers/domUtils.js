/**
 * Attend qu'un évènement dans le DOM soit levé
 * @param item HTMLElement element du dom
 * @param event String évènement sur l'item à surveiller
 * @return {Promise<unknown>}
 */
export const waitForDOMEvent = (item, event) => {
  return new Promise((resolve) => {
    const listener = () => {
      item.removeEventListener(event, listener);
      resolve();
    };
    item.addEventListener(event, listener);
  });
};

/* export const loadJSScript = async (scriptFilename) => {
	return new Promise((resolve, reject) => {
		const newScript = document.createElement('script');
		let ready = false;
		newScript.type='text/javascript';
		newScript.src =  scriptFilename;
		newScript.async = true;
		newScript.onError = (error) => {
			reject(error, newScript);
		}
		newScript.onload = newScript.onreadystatechange = function() {
			if (!ready && (!this.readyState || this.readyState === 'complete')) {
				ready = true;
				resolve(newScript);
			}
		}
	});
} */
