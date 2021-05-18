import { axiosInstance } from '../../config/axiosConfig';
import cheerio from 'cheerio';

//  Fetch the HTML of a given URL
export default async function fetchHTML(url)  {
	const { data } = await axiosInstance.get(url);
	return cheerio.load(data);
};
