const urlFor = require('../../filters/sanityImageBuilder')

module.exports = async (image, classList = "", alt = "Image does not have any alt text.", sizes = "100vw", sizeArray = [100,400,1200]) => {
	const srcSetContent = sizeArray.map((size) => {
		const url = urlFor(image)
			.width(size)
			.auto('format')
			.url()

		return `${url} ${size}w`
	}).join(',')
	// loading = "lazy"
	return (
		`<img 
                src="${urlFor(image).width(sizeArray[0])}"
				class="${classList}"
                srcset="${srcSetContent}"
                sizes="${sizes}"
				
                width="${sizeArray[sizeArray.length - 1]}"
                height="${sizeArray[sizeArray.length - 1]}"
				alt="${alt}"
		>`
	)
}