import axios from 'axios';
import cheerio from 'cheerio';

//  Fetch the HTML of a given URL
export default async function fetchHTML(url)  {
	const { data } = await axios.get(url);
	return cheerio.load(data);
};
