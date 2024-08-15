const sanityFetch = require("../../lib/utils/sanity/sanityFetch");
const groq = require('groq')

module.exports = async () => {
	const query = groq`{
		"texts":*[_type == "textDocument"]{
			...,
			"tags":tags[]->,
			"link":select(
        textType == "internalText" => '/' + (*[_id == "navigation"] {
                "textsPrimaryArchiveSlug":textsPage->slug.current
              }.textsPrimaryArchiveSlug)[0] + '/' + slug.current,
              textType == "externalText" => externalText.link.url,
              textType == "fileText" => fileText.file.asset->.url
            ),
					} | order(date desc),
			"internalTexts":*[_type == "textDocument" && textType == "internalText"]{
				...,
				"tags":tags[]->,
				"slug":slug.current,
				"text": internalText.text[]{..., asset->},
				links[]{
              	(_type == "externalLink") => {
                	"url":url,
                	"linkText":select(
                  		defined(linkText) => linkText,
                  		url
                	)
              	},
              	(_type == "internalLink") => {
                	"url":reference->slug.fullUrl,
                	"linkText":select(
                  		defined(linkText) => linkText,
                  		reference->title
                	)
              	},
            },
			} | order(date desc),
		"tags":*[_type == "textTag"] | order(priority desc)
	}`

	// const order = `| order(publishedAt asc)`
	// const query = [filter, projection, order].join(' ').toString()
	const data = await sanityFetch('texts', query)

	// const preparePosts = data.map(generateContent);

	return data;
}