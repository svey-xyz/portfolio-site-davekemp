// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys: Record<number, number> = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e: Event) {
	e.preventDefault();
}

function preventDefaultForScrollKeys(e: KeyboardEvent) {
	if (keys[e.keyCode]) {
		preventDefault(e);
		return false;
	}
}
const supportsPassive = true;
const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
export function disableScroll() {
	window.addEventListener('DOMMouseScroll', preventDefault, wheelOpt); // older FF
	window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
	window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
	window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
export function enableScroll() {
	window.removeEventListener('DOMMouseScroll', preventDefault, false);
	window.removeEventListener(wheelEvent, preventDefault, false);
	window.removeEventListener('touchmove', preventDefault, false);
	window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}