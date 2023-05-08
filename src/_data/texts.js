const sanityFetch = require("../../lib/utils/sanity/sanityFetch");
const groq = require('groq')

module.exports = async () => {
	const query = groq`{
		"texts":*[_type == "textDocument"]{
			...,
			"tags":tags[]->,
			"slug":slug.current,
		} | order(date desc),
		"internalTexts":*[_type == "textDocument" && textType == "internalText"]{
			...,
			"tags":tags[]->,
			"slug":slug.current,
			"text": internalText.text
		} | order(date desc),
		"tags":*[_type == "textTag"] | order(priority desc)
	}`

	// const order = `| order(publishedAt asc)`
	// const query = [filter, projection, order].join(' ').toString()
	const data = await sanityFetch('texts', query)

	// const preparePosts = data.map(generateContent);

	return data;
}