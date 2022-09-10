//import {notify} from "../scripts/vendors/sass-swing.min.js";


window.addEventListener("DOMContentLoaded", () => {
	const SassSwing = window['sass-swing'];

	/**
	 * @type {SassSwing.Modalify} modalTest
	 */
	let modalTest;
	/**
	 * @type {SassSwing.Modalify} modalTest
	 */
	let modalTestSimple;
	/**
	 * @type {SassSwing.Modalify} modalTest
	 */
	let modalTestForm;

	const  openDialog = async () => {
		const result = await modalTest.showModal();
		console.log("Modal result = " + result);
	}

	const  openDialogSimple = async () => {
		const result = await modalTestSimple.showModal();
		console.log("Modal simple result = " + result);
	}

	const handleAvatar = (formData) => {
		const file = formData.get('avatarImage')
		if (!file.size) return

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = e => {
			const avatar = document.querySelector('.avatar >  img')
			avatar.src = e.target.result;
		}
		modalTestForm.forceFormInputFileReset();
	}

	const  openDialogForm = async () => {
		const result = await modalTestForm.showModal();
		console.log("Modal Form result = " + result);

		if (result === "validate") {
		 	handleAvatar(modalTestForm.getFormData());
		}
	}

	const openDialogBtn = document.querySelector('[data-modal-open-default]');
	if (openDialogBtn) {
		modalTest = new SassSwing.Modalify("#modalTest");
		openDialogBtn.addEventListener("click", openDialog);
	}

	const openDialogSimpleBtn = document.querySelector('[data-modal-open-simple]');
	if (openDialogSimpleBtn) {
		modalTestSimple =  new SassSwing.Modalify("#modalTestSimple");
		openDialogSimpleBtn.addEventListener("click", openDialogSimple);
	}

	const openDialogFormBtn = document.querySelector('[data-modal-open-form]');
	if (openDialogFormBtn) {
		modalTestForm =  new SassSwing.Modalify("#modalTestForm");
		openDialogFormBtn.addEventListener("click", openDialogForm);
	}

	const capitalize = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}


	const notificationsBtn = document.querySelectorAll('[data-js-notify]');

	if (notificationsBtn.length > 0) {
		const notifyPos = document.querySelectorAll('input[type=radio]');

		SassSwing.notify.setConfig({
			displayCloseButton:true,
			animationType:"slide"
		});

		let notificationContainer = null;
		let notificationPos = "top-left";
		let notifyConfig = {
			position:"top-left"
		}

		notifyPos.forEach((el) => {
			el.addEventListener('change', (evt) => {
				notificationPos = evt.currentTarget.value;
				notifyConfig.position = notificationPos;
				if (notificationContainer !== null) {
					notificationContainer.className = `notifications notifications--${notificationPos}`;
				}
			});
		});
		notificationsBtn.forEach((el) => {
			el.addEventListener('click', (evt) => {
				let elem = evt.currentTarget;
				let type = elem.getAttribute('data-js-notify');
				switch (type) {
					case "default":
						SassSwing.notify.notify('Default', 'Notification simple', 'default', notifyConfig);
						break;
					case "autoclose":
						let tmpConfig = {
							...notifyConfig,
							displayCloseButton: false,
							closeOnClick: true,
							displayIcon: false,
							showDuration: 5000
						}
						SassSwing.notify.notify('Default', 'Notification simple et auto-close', 'default', tmpConfig);
						break;
					case "success":
						SassSwing.notify.success('Success', 'Notification success', notifyConfig);
						break;
					case "warning":
						SassSwing.notify.warn('Warning', 'Notification warning', notifyConfig);
						break;
					case "danger":
						SassSwing.notify.error('Danger', 'Notification danger', notifyConfig);
						break;
					case "info":
						SassSwing.notify.info('Info', 'Notification info', notifyConfig);
						break;
					default:
							SassSwing.notify.notify(SassSwing.capitalize(type), 'Notification ' + type, type, notifyConfig);
							break;
				}
			})
		});
	}
	// SassSwing.notify.success("Sass Swing","Script loaded", {showDuration: 5000, closeOnClick: true});
});
