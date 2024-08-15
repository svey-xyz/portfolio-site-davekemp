const sanityFetch = require("../../lib/utils/sanity/sanityFetch");
const groq = require('groq')

module.exports = async () => {
	const query = groq`{
		"work":*[_type == "project"]{
			...,
			"slug":slug.current,
			"tags":tags[]->,
			"sortByDate":select(
              defined(date.endDate) => date.endDate,
              date.date
            ),
			"description":description[]{..., asset->},
			links[]{
              	(_type == "externalLink") => {
                	"url":url,
                	"linkText":select(
                  		defined(linkText) => linkText,
                  		url
                	)
              	},
              	(_type == "internalLink") => {
                	"url":select(
                  		(reference->._type == "textDocument") =>
                          select(
                            (reference->.textType == 'fileText') => reference->.fileText.file.asset->.url,
                            (reference->.textType == 'externalText') => reference->.externalText.url,
                            (reference->.textType == 'internalText') => reference->.slug.fullUrl
                          ),
                  		reference->slug.fullUrl
                	),
                	"linkText":select(
                  		defined(linkText) => linkText,
                  		reference->title
                	)
              	},
            },
			"content":content[]{
              	...,
              	gallery[]{
                	...,
                	asset->
              	}
            }
		} | order(sortByDate desc),
		"tags":*[_type == "projectTag"] | order(priority desc)
	}`

	// const order = `| order(publishedAt asc)`
	// const query = [filter, projection, order].join(' ').toString()
	const data = await sanityFetch('projects', query)

	// const preparePosts = data.map(generateContent);
	
	return data;
}