const axios = require("axios");
const cheerio = require("cheerio");

const fetchHTML = async (url) => {
	const { data } = await axios.get(url);
	return cheerio.load(data);
};

const getCovidData = async (country) => {
	baseURL = `https://www.worldometers.info/coronavirus/country/${country}`;
	const data = fetchHTML(baseURL);

	return data.then((result) => {
			const countryName = result('.label-counter').text().split('/')[2].trim();
			const flagURL =
				"https://www.worldometers.info" +
				result("div > img").attr("src");
			// Data [Array]: Cases / Deaths / Recovered
			const data = result("#maincounter-wrap > .maincounter-number")
				.text()
				.trim()
				.split("\n\n");
			// Updates: A sentence
			const update = result(".news_li").text().split("[source]")[0].trim();
			// Return the Data in JSON form
			return {
				status: true,
				data: {
					countryName,
					flag: flagURL,
					data,
					update,
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
				`*Total Recovered:*\t ${result.data.data[0]}\n\n` +
				`*Updates:*\n${result.data.update}\n\n` +
				`[Flag](${result.data.flag})`
		}
	};

	return {
		markdown: `${result.message}`
	};
};	

module.exports = covid;
