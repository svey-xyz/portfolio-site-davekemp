/*
* Shader Base Class for interactive shader sections
*/

import { Section } from "./section-base";


/**
 * Base for interactive sections using a canvas.
 *
 * @export
 * @class canvasBase
 * @extends {Section}
 */
export class canvasBase extends Section {


	paintCanvas: HTMLCanvasElement;
	paintContext: CanvasRenderingContext2D;

	imagedata: ImageData = new ImageData(1,1);
	canvasSize = { width: 0, height: 0 }
	pixelScale: number = 1;

	constructor(container: Element, args: { pixelScale: number }) {
		super(container);

		this.pixelScale = args.pixelScale

		this.paintCanvas = document.createElement('canvas');
		this.paintContext = this.paintCanvas.getContext("2d")!;

		this.setCanvasSize();
		this.container.appendChild(this.paintCanvas);

		this.mainLoop();
	}

	loop(): void { }

	/**
	 * Used to draw elements to imagedata
	 *
	 * @memberof canvasBase
	 */
	draw(): void { 
		this.paintContext.putImageData(this.imagedata, 0, 0);
	}

	setPixelData(img: ImageData, pix:pixel): void {
		var pixelindex = (pix.pos.y * this.imagedata.width + pix.pos.x) * 4;

		img.data[pixelindex] = pix.col.r;     // Red
		img.data[pixelindex + 1] = pix.col.g; // Green
		img.data[pixelindex + 2] = pix.col.b;  // Blue
		img.data[pixelindex + 3] = (pix.col.a) ? pix.col.a : 255;   // Alpha
	}

	setCanvasSize(): void {
		let width = Math.ceil(this.sectionSize.width / this.pixelScale);
		let height = Math.ceil(this.sectionSize.height / this.pixelScale);

		this.canvasSize = { width, height }

		this.paintCanvas.width = this.canvasSize.width;
		this.paintCanvas.height = this.canvasSize.height;

		this.imagedata = this.paintContext.createImageData(this.canvasSize.width, this.canvasSize.height);
		this.paintCanvas.style.transform = (`scale(${this.pixelScale})`)

		this.draw();
	}

	resize(e: Event): void {
		super.resize(e);
		this.setCanvasSize();
	}
	
	handleInput(e: Event) {
		super.handleInput(e);
	}
	
	setPixelScale(scale : number) {
		this.pixelScale = scale;
		this.setCanvasSize();
	}
	
}