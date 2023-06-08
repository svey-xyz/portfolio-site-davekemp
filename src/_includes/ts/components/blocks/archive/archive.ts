/*
*  Add sorting of projects
*/

import { FlexMasonry } from "../../domUtils/flexmasonry";

let projectCards = Array<projectCard>();
let tagButtons = Array<HTMLElement>();
let archiveContainer:HTMLElement;
let filterParam: string = 'archive';
let masonry: FlexMasonry


export const mount = (container: Element) => {
	archiveContainer = <HTMLElement>container;
	initMasonry();

	initializeArchive();
}

function initMasonry(): FlexMasonry | null {
	const container = archiveContainer.querySelector('.masonry-grid')
	if (container == null) return null;
	masonry = new FlexMasonry(container as HTMLElement, {
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
	});
	container?.classList.remove('masonry-grid');
	return masonry;
}

function initializeArchive(): void {
	initElements();

	// filterParam = archiveContainer.getAttribute('name')!.toLowerCase();

	const url = new URL(window.location.href);

	let filterTag = new URL(window.location.href).searchParams.get(filterParam)
	filterTag = filterTag ? filterTag : tagButtons[0].getAttribute('data-tag') ? tagButtons[0].getAttribute('data-tag') : '';
	tagSelect(filterTag!)
	
}

function initElements() : void {
	const buttonElements = archiveContainer.querySelectorAll('.tag-button');
	const htmlCards = archiveContainer.querySelectorAll('.archive-card');

	for (let b of buttonElements) {
		tagButtons.push(<HTMLElement>b);
		b.addEventListener('mousedown', tagClick);
	}

	for (let card of htmlCards) {
		projectCards.push(new projectCard(<HTMLElement>card));
	}
}

function tagClick(e : Event) : void {
	const target = e.target as HTMLElement
	const tag = target.hasAttribute('data-tag') ? 
		target.getAttribute('data-tag') : target.parentElement!.getAttribute('data-tag');
	
	tagSelect(tag ? tag : '')
}

function tagSelect(tag : string) : void {
	for (let b of tagButtons) {
		if (b.getAttribute('data-tag') != tag) b.classList.remove('active');
		else b.classList.add('active');
	}
	
	archiveSort(tag)
	if (masonry) masonry.refresh();
}

function archiveSort(tag : string) {
	let all = tag === 'all';

	window.history.replaceState('', '', utils.domUtils.updateURLParameter(window.location.href, filterParam, tag));

	for (let card of projectCards) {
		if (card.tags.includes(tag) || all) {
			card.container.classList.add("flex");
			card.container.classList.remove("hidden");


		} else {
			card.container.classList.add("hidden");
			card.container.classList.remove("flex");

		}
	}
}

class projectCard {
	container : HTMLElement;
	tags : Array<string>;

	constructor(dom : HTMLElement) {
		this.container = dom;
		this.tags = JSON.parse(dom.getAttribute('data-tags')!);
	}
}