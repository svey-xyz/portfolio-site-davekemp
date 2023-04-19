let header:HTMLElement;
let menuSwitch:HTMLInputElement;

export const mount = (container: HTMLElement) => {
	header = container;
	menuSwitch = header.querySelector('#menuSwitch')!;

	menuSwitch.addEventListener("click", switchMenu);
	switchMenu(null);
	switchLayout();

	document.addEventListener("keydown", function (event) {
		const key = event.key; // Or const {key} = event; in ES6+
		if (key === "Escape") {
			switchMenu(null, false);
		}
	});

	window.addEventListener("resize", utils.domUtils.debounce(switchLayout));
}

function switchLayout() {
	const headerContentSpacer = (header.querySelector('#headerContentSpacer') as HTMLElement);
	const headerNav = (header.querySelector('#headerNav') as HTMLElement);

	if (headerContentSpacer?.offsetWidth <= 10) {
		// switchMenu(null, false);
		headerNav.classList.add('invisible')
		menuSwitch.classList.remove('hidden')

		// console.log('here')
	} else {
		headerNav.classList.remove('invisible')
		switchMenu(null, false);
		menuSwitch.classList.add('hidden')

	}
}

function switchMenu(e: Event | null, force?:boolean) {
	let menuState: boolean | undefined = force;

	if (typeof menuState === 'undefined') {
		switch (e?.target) {
			default:
				menuState = menuSwitch.checked;
				break;
		}
	}

	header.classList[menuState ? 'add' : 'remove']('menu-open');
	menuSwitch.checked = menuState;
}