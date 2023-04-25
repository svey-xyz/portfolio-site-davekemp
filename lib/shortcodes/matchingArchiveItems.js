module.exports = (items, activeTags, sectionID, pageData) => {
	let activeItems = [];

	items.forEach(item => {
		let matchingTags = {};

		for (let i = 0; i < activeTags.length; i++) {
			if (!matchingTags[activeTags[i]._id]) {
				const element = activeTags[i]._id;
				matchingTags[element] = true;
			}
		}

		for (let j = 0; j < item.tags.length; j++) {
			if (matchingTags[item.tags[j]._id]) {
				activeItems.push(item);
				break;
			}
		}
	});
	pageData.activeArchiveTags = activeItems;
	return activeItems;
}