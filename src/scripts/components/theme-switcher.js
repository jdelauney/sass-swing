import CustomComponent from "../core/CustomComponent.js";

export default class ThemeSwitcher extends CustomComponent{

	/**
	 * @param {HTMLElement} element
	 * @param {String} localStorageThemeModeKey
	 */
	constructor(element, localStorageThemeModeKey) {
		super(element)
		this.localStorageThemeModeKey = localStorageThemeModeKey;
		this.htmlRoot = document.querySelector("html");
		this.currentTheme = window.localStorage.getItem(this.localStorageThemeModeKey);
		this.prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

		if (this.currentTheme !== null) {
			this._toggleTheme(this.currentTheme);
		} else {
			if (this.prefersDarkScheme.matches) {
				this._toggleTheme("dark");
			}
		}

		this.onSwitcherClick = this._handlerSwitchClick.bind(this);
		this.element.addEventListener("click",this.onSwitcherClick);
	}

	_toggleTheme(themeMode) {
		this.currentTheme = themeMode;
		this.htmlRoot.setAttribute("data-theme", this.currentTheme);
		window.localStorage.setItem(this.localStorageThemeModeKey, this.currentTheme);
	}

	_handlerSwitchClick() {
		const newThemeMode = (this.htmlRoot.getAttribute("data-theme") !== "light") ? "light" : "dark";
		this._toggleTheme(newThemeMode);
	}

	static bind(localStorageThemeModeKey = "swing-theme-mode") {
		return Array.from(document.querySelectorAll("[data-js-themeSwitcher]")).map(
			(element) => {
				return new ThemeSwitcher(element, localStorageThemeModeKey);
			}
		);
	}
}