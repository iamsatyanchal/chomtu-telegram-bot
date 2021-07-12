import cheerio from 'cheerio';
import { axiosInstance } from '../../config/axiosConfig';

//  Fetch the HTML of a given URL
export default async function fetchHTML(url) {
  const { data } = await axiosInstance.get(url);
  return cheerio.load(data);
}
