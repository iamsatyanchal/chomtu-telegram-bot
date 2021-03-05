const axios = require("axios");
const fetchHTML = require('./fetchHTML.js');

const getCovidData = async (country) => {
	baseURL = `https://www.worldometers.info/coronavirus/country/${country}`;
	// Call fetchHTML function and get the HTML of the page.
	const data = fetchHTML(baseURL);

	return data.then((result) => {
		// Grab the country name from returned HTML
		const countryName = result('.label-counter').text().split('/')[2].trim();
		// Get the FlagURL
		const flagURL = "https://www.worldometers.info" + result("div > img").attr("src");
		// Data [Array]: Cases / Deaths / Recovered
		const data = result("#maincounter-wrap > .maincounter-number")
			.text()
			.trim()
			.split("\n\n");
		// Updates: A sentence
		const update = result(".news_li").text().split("[source]")[0].trim();

		// Trying to dates
		const dateDiv = result(".content-inner").text().trim().split("\n")[2];
		const date =  new Date(dateDiv).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' }) + ' (IST)';

		// Return the Data in JSON form
		return {
			status: true,
			data: {
				countryName,
				flag: flagURL,
				data,
				update,
				lastUpdated: date
			},
		};
	})
	.catch((err) => {
		return {
			satus: false,
			message: 'Country Not Found!'
		};
	});
};

const covid = async (country) => {
	const result = await getCovidData(country);
	if (result.status) {
		return {
			markdown: `🦠 *Covid:\t ${result.data.countryName}*\n\n` +
				`*Total Cases:*\t ${result.data.data[0]}\n` +
				`*Total Deaths:*\t ${result.data.data[1]}\n` +
				`*Total Recovered:*\t ${result.data.data[2]}\n\n` +
				`*Updates:*\n${result.data.update}\n\n` + 
				`*Last updated:*\n${result.data.lastUpdated}\n\n` +
				`[Flag](${result.data.flag})`
		}
	};

	return {
		markdown: `${result.message}`
	};
};	

module.exports = covid;
