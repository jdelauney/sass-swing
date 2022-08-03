import {debounce} from "./core/helpers/miscUtils.js";

export const fixDocumentHeight = () => {
	const doc = document.documentElement;
	doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
}


(() => {
	document.addEventListener('resize', debounce(fixDocumentHeight));
	fixDocumentHeight();
})();