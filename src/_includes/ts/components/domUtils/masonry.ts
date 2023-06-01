// const FlexMasonry = require('flexmasonry') - doesnt work?

declare const FlexMasonry: any;
export const mount = (container: Element) => {
	console.log(FlexMasonry)
	FlexMasonry.init([container], {
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
	})
}
