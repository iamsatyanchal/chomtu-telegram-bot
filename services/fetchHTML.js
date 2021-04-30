import axios from 'axios';
import cheerio from 'cheerio';

//  Fetch the HTML of a given URL
const fetchHTML = async (url) => {
	const { data } = await axios.get(url);
	return cheerio.load(data);
};

export default fetchHTML;