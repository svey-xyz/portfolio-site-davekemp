import { advancedBase } from "../../../base/advancedBase"

export const mount = (container: Element) => {
	new gallery(<HTMLElement>container)
}

class gallery extends advancedBase {
	images: Array<HTMLElement>
	lightbox: lightbox

	constructor(container: HTMLElement, args?: {}) {
		super(container, args);

		this.images = Array.from(this.container.querySelectorAll('.gallery-image'))
		this.lightbox = new lightbox(this.container.querySelector('.lightbox') as HTMLElement, { gallery: this })
	}

	click(e: Event) {
		super.click(e);

		if ((e.target as HTMLElement).parentElement?.classList.contains('gallery-image')) {
			const image = (e.target as HTMLElement).parentElement!
			const imageID = Number(image.dataset.imageid)

			this.lightbox.swapImage(imageID)
			this.lightbox.switchState(true);
		}
	}
}

class lightbox extends advancedBase{
	images: Array<HTMLElement>
	gallery: gallery
	switch: HTMLInputElement
	next: HTMLElement
	prev: HTMLElement

	state: boolean = false
	galleryIndex: number = 0

	constructor(container: HTMLElement, args: { gallery: gallery }) {
		super(container, args);
		
		this.gallery = args.gallery
		this.images = Array.from(this.container.querySelectorAll('.lightbox-image'))
		this.switch = this.container.querySelector('.lightbox-close') as HTMLInputElement
		this.next = this.container.querySelector('.lightbox-next') as HTMLElement
		this.prev = this.container.querySelector('.lightbox-prev') as HTMLElement

		this.swapImage(0)
	}

	swapImage(imageID: number) {
		this.galleryIndex = imageID;

		this.images.forEach(image => {
			Number(image.dataset.imageid) == imageID ? image.classList.remove('hidden') : image.classList.add('hidden'); 
		});

		if (imageID == 0) this.prev.classList.add('hidden') 
		else this.prev.classList.remove('hidden');

		if (imageID == this.images.length - 1) this.next.classList.add('hidden')
		else this.next.classList.remove('hidden');
	}

	switchState(state: boolean) {
		this.state = state;
		this.state ? utils.disableScroll() : utils.enableScroll()
		this.container?.classList[this.state ? 'remove' : 'add']('hidden');
	}

	click(e: Event): void { 
		super.click(e);

		switch (e.target) {
			case (this.switch):
				this.switchState(false);
				break;
			case (this.next):
				this.swapImage(this.galleryIndex + 1)
				break;
			case (this.prev):
				this.swapImage(this.galleryIndex - 1)
				break;
		}
	};
}
