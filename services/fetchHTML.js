const axios = require("axios");
const cheerio = require("cheerio");

//  Fetch the HTML of a given URL
const fetchHTML = async (url) => {
	const { data } = await axios.get(url);
	return cheerio.load(data);
};

module.exports = fetchHTML;