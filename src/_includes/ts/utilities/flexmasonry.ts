import { advancedBase } from "../base/advancedBase";

export class FlexMasonry extends advancedBase {

	defaultOptions = {
		/*
		* If `responsive` is `true`, `breakpointCols` will be used to determine
		* how many columns a grid should have at a given responsive breakpoint.
		*/
		responsive: true,
		/*
		* A list of how many columns should be shown at different responsive
		* breakpoints, defined by media queries.
		*/
		breakpointCols: {
			'min-width: 976px': 3,
			'min-width: 768px': 2,
			'min-width: 480px': 1,
		},
		/*
		* If `responsive` is `false`, this number of columns will always be shown,
		* no matter the width of the screen.
		*/
		numCols: 3,
	};

	_resizeId: number | null = null;
	args: { responsive: boolean, breakpointCols: any, numCols: number } = this.defaultOptions
	_targets: Array<HTMLElement> | undefined = undefined;

	constructor(container: HTMLElement, args?: {}) {
		super(container, args);
		this.args = Object.assign(this.defaultOptions, args);

		this.setUp();
		this.setHeight();
		this.resize();
	}

	setUp() {
		this.container.classList.add('flexmasonry');

		if (this.args.responsive) {
			this.container.classList.add('flexmasonry-responsive');
		}

		this.setColsClass();

		Array.from(this.container.children as HTMLCollectionOf<HTMLElement>).forEach((item:HTMLElement) => {
			item.classList.add('flexmasonry-item');
		});

		this.addBreakHTMLElements();
	}

	load() {
		this.setHeight();
	}

	resize() {
		this.refresh();
	}

	setOrder() {
		let order = 1;
		Array.from(this.container.children as HTMLCollectionOf<HTMLElement>).forEach((item: HTMLElement) => {
			if (item.classList.contains('flexmasonry-break') || item.classList.contains('hidden')) {
				return;
			}

			item.style.order = `${order}`
			console.log(this.getCurrentCols())
			order + 1 > this.getCurrentCols() ? order = 1 : order += 1;
		});
	}

	setHeight() {
		if (this.getCurrentCols() < 2) {
			this.container.style.removeProperty('height');
			return;
		}

		let heights:Array<number> = [];

		Array.from(this.container.children as HTMLCollectionOf<HTMLElement>).forEach((item: HTMLElement) => {
			if (item.classList.contains('flexmasonry-break') || item.classList.contains('hidden')) {
				return;
			}

			const comp = window.getComputedStyle(item);
			const order: number = parseFloat(comp.getPropertyValue('order'));
			const height: number = parseFloat(comp.getPropertyValue('height'));

			if (!heights[order - 1]) {
				heights[order - 1] = 0;
			}
			heights[order - 1] += Math.ceil(height);
		});

		const maxHeight = Math.max(...heights);
		this.container.style.height = maxHeight + 'px';
	}

	addBreakHTMLElements() {
		const breakEls = this.container.querySelectorAll('.flexmasonry-break');
		if (Array.from(breakEls).length === (this.getCurrentCols() - 1)) {
			return;
		}

		for (let i = 1; i < this.getCurrentCols(); i++) {
			const breakDiv = document.createElement('div');
			breakDiv.classList.add('flexmasonry-break');
			breakDiv.classList.add('flexmasonry-break-' + i);
			this.container.appendChild(breakDiv);
		}
	}

	removeBreakHTMLElements() {
		const breakEls = this.container.querySelectorAll('.flexmasonry-break');
		if (Array.from(breakEls).length === (this.getCurrentCols() - 1)) {
			return;
		}

		Array.from(breakEls as NodeListOf<HTMLElement>).forEach((breakEl: HTMLElement) => {
			breakEl.parentNode?.removeChild(breakEl);
		});
	}

	setColsClass() {
		if (this.container.classList.contains('flexmasonry-cols-' + this.getCurrentCols())) {
			return;
		}

		this.container.className = this.container.className.replace(/(flexmasonry-cols-\d+)/, '');
		this.container.classList.add('flexmasonry-cols-' + this.getCurrentCols());
	}

	getCurrentCols() {
		if (!this.args.responsive) {
			return this.args.numCols;
		}

		const keys = Object.keys(this.args.breakpointCols);
		for (const key of keys) {
			if (window.matchMedia('(' + key + ')').matches) {
				return this.args.breakpointCols[key];
			}
		}

		return 1;
	}

	refresh(options = {}) {
		this.args = Object.assign(this.defaultOptions, options);

		this.setOrder();
		this.setColsClass();
		this.removeBreakHTMLElements();
		this.addBreakHTMLElements();
		this.setHeight();

		return this;
	}
}