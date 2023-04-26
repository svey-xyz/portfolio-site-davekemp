const sanityFetch = require("../../lib/utils/sanity/sanityFetch");
const groq = require('groq')
const slugify = require('slugify')

module.exports = async () => {
	const blocksPageQuery = groq`{
			...,
			blocks[]{
				...,
				(_type == "archive") => {
                  	"title":title.current,
					
                  	(archiveType == "projectsArchive") => {
						"tags":select(
                      		count(projectsArchive.tags) > 0 => projectsArchive.tags[]->,
                      		*[_type == "projectTag"]
                    	) | order(priority desc),
                  	},
				
                	(archiveType == "textsArchive") => {
                  		"tags":select(
                      		count(textsArchive.tags) > 0 => textsArchive.tags[]->,
                      		*[_type == "textTag"]
                  		) | order(priority desc),
					}
              	},
          	}
		}`

	const filter = groq`*[_type == "page"]`
	const projection = groq`{
			_id,
			title,
			"slug":select(
				*[_id == "navigation"]{
					"_id":homePage->_id
				}[0]._id == _id => "/",
				select(slug.current != null => slug.current, title)
			),
			descriptiveTitle,
			description,
			"template":pageType,
			"content":select(
				pageType == "blocksPage" => blocksPage${blocksPageQuery},
			)
		}`

	// const order = `| order(publishedAt asc)`
	const query = [filter, projection].join(' ').toString()
	const data = await sanityFetch('pages', query)

	return data.map(preProcessData);
}

function preProcessData(data) {
	return {
		...data,
		slug: data.slug == "/" ? "" : slugify(`/${data.slug}`)
	}
}