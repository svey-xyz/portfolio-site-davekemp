const sanityFetch = require("../../lib/utils/sanity/sanityFetch");
const groq = require('groq')
const slugify = require('slugify')

module.exports = async () => {
	const archiveItemQuery = groq`{
			...,
			"slug":slug.current,
			"tags":tags[]->,
		} | order(date desc)`

	const archivePageQuery = groq`{
		...,
      	(archiveType == "projectsArchive") => {
        	"tags":select(
          		count(projectsArchive.tags) > 0 => projectsArchive.tags[]->,
            	*[_type == "projectTag"]
          	) | order(priority desc),
        	"archiveItems":select(
          		(count(projectsArchive.tags) > 0) =>
            		*[_type == "project" && count((tags[]._ref)[@ in ^.^.projectsArchive.tags[]._ref]) > 0]${archiveItemQuery},
          		*[_type == "project"]${archiveItemQuery}
        	)
      	},
		(archiveType == "textsArchive") => {
			"tags":select(
				count(textsArchive.tags) > 0 => textsArchive.tags[]->,
				*[_type == "textTag"]
			) | order(priority desc),
			"archiveItems": *[_type == "textDocument" &&
				count((tags[]._ref)[@ in 
					select(
						count(^.^.textsArchive.tags) > 0 => ^.^.textsArchive.tags[]._ref,
						*[_type == "textTag"]._id
					)
				]) > 0
			]${archiveItemQuery}
		}
	}`
	const blocksPageQuery = groq`{
			...,
			blocks[]{...}
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
				pageType == "archivePage" => archivePage${archivePageQuery},

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