/**
 * Attend qu'un évènement dans le DOM soit levé
 * @param item HTMLElement element du dom
 * @param event String évènement sur l'item à surveiller
 * @return {Promise<unknown>}
 */
export function waitForDOMEvent(item, event) {
	return new Promise((resolve) => {
		const listener = () => {
			item.removeEventListener(event, listener);
			resolve();
		}
		item.addEventListener(event, listener);
	})
}