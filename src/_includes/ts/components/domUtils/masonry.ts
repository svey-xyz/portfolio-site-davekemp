// const FlexMasonry = require('flexmasonry') - doesnt load file
// declare const FlexMasonry: any;
import { FlexMasonry } from "../../utilities/flexmasonry";
export const mount = (container: Element) => {
	// console.log(FlexMasonry)
	const masonry = new FlexMasonry(container as HTMLElement, {
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
	container.classList.remove('masonry-grid');

}
