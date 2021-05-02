import axios from 'axios';
import { fetchHTML } from './';

// Get relevant data from fetchHTML for wikipedia 
export default async function scrapeWiki (query) {
	const baseURL = `https://en.wikipedia.org/wiki/${query.join('%20')}`
	const data = fetchHTML(baseURL);

	return data.then(result => {
		//  Get the short description (class shortdescription inside class mw-parser-output)
		const shortDesc = result(".mw-parser-output .shortdescription").text();
		//  Get the main output 
		const mainOutput = result(".mw-parser-output p").text().split('\n');
		// remove exmpty strings from the array
		const output = mainOutput.filter(res => res != '')
		
		return {
			status: 'success',
			markdown: `*🌏 Wikipedia*\n\n` + 
						`*Query:* ${query.join(' ')}\n\n` + 
						`*Short Desc:* ${shortDesc}\n\n` + 
						`*Main Desc:*\n${output[0]}\n\n` +
						`[Open Wikipedia](${baseURL})` 
		}
	})
	.catch(err => {
		return {
			status: 'fail',
			markdown: err.message
		}
	})
}
