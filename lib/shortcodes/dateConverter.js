const specificityDictionary = {
	year: 0,
	month: 1,
	day: 2
}

module.exports = (date, specificity = specificityDictionary.day, ongoingText="On-going") => {
	let startDate = new Date(...date.date.split('-'));
	let endDate = (date.range && date.endDate) ? new Date(...date.endDate.split('-')) : null;
	let divider = ' - '
	const dateFormat = (() => {
		switch (specificity) {
			case (specificityDictionary.year):
				return new Intl.DateTimeFormat("en-CA", { year: "numeric" }).format;;
			case (specificityDictionary.month):
				return new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" }).format;
			case (specificityDictionary.day):
				return new Intl.DateTimeFormat("en-CA", { month: "long", day: "numeric", year: "numeric" }).format;
			default:
				return new Intl.DateTimeFormat("en-CA", { month: "long", day: "numeric", year: "numeric" }).format;
		}
	})()

	let dateString = endDate ?
		dateFormat(startDate, specificity) + divider + dateFormat(endDate, specificity) :
		date.range ?
		dateFormat(startDate, specificity) + divider + ongoingText :
		dateFormat(startDate, specificity);

	return dateString;
}