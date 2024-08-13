const toHTML = require('@portabletext/to-html')


module.exports = async(sanityBlocks) => {
	const htm = require('htm')
	const vhtml = require('vhtml')

	const html = htm.bind(vhtml)
	// const toHTML = await import('@portabletext/to-html')

	const myPortableTextComponents = {
		types: {
			image: ({ value }) =>
				value.asset
					? html`<img src="${value.asset.url}" />`
					: html `<span>Error loading image!</span>`,
			callToAction: ({ value, isInline }) =>
				isInline
					? html`<a href="${value.url}">${value.text}</a>`
					: html`<div class="callToAction">${value.text}</div>`,
		},
		marks: {
			link: ({ children, value }) => {
				// ⚠️ `value.href` IS NOT "SAFE" BY DEFAULT ⚠️
				// ⚠️ Make sure you sanitize/validate the href! ⚠️
				const href = value.href || ''

				if (toHTML.uriLooksSafe(href)) {
					const rel = href.startsWith('/') ? undefined : 'noreferrer noopener'
					const target = href.startsWith('/') ? '' : '_blank'
					const aria = href.startsWith('/') ? 'Internal link.' : 'External link.'

					return html`<a class="underline text-medium-accent hover:text-secondary-accent" href="${href}" target="${target}" rel="${rel}" aria-label="${aria}">${children}</a>`
				}

				// If the URI appears unsafe, render the children (eg, text) without the link
				return children
			},
		},
	}
	// console.log(sanityBlcoks)
	return toHTML.toHTML(sanityBlocks, { components:myPortableTextComponents })
}