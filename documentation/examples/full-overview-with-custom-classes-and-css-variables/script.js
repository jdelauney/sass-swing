

window.addEventListener('DOMContentLoaded', () => {
	const SassSwing = window['sass-swing'];

	const modalTest = new SassSwing.Modalify("#modalTest");
	const modalTestSimple = new SassSwing.Modalify("#modalTestSimple");

	const  openDialog = async () => {
		const result = await modalTest.showModal();
		console.log("Modal result = " + result);
	}

	const  openDialogSimple = async () => {
		const result = await modalTestSimple.showModal();
		console.log("Modal simple result = " + result);
	}

	const openDialogBtn = document.querySelector('[data-modal-open-default]');
	if (openDialogBtn) { openDialogBtn.addEventListener("click", openDialog); }

	const openDialogSimpleBtn = document.querySelector('[data-modal-open-simple]');
	if (openDialogSimpleBtn) { openDialogSimpleBtn.addEventListener("click", openDialogSimple); }

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
});
