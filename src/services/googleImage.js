import axios from 'axios';
import { GOOGLE_API_KEY, CSE_ID } from '../../config';

// Generate Random numbers
const getRandomPage = () => {
	// random number for a page
	return Math.ceil(Math.random()*2);
}

const getRandomResult = (length) => {
	// random number for result
	return Math.floor(Math.random() * length);
}

// Get a new google image and return it
const googleImage = (search) => {
	// Full URL
	const CSE_ENDPOINT = `https://www.googleapis.com/customsearch/v1/siterestrict?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.CSE_ID}&q=${search.join('%20')}&start=${getRandomPage()}`

	return axios.get(CSE_ENDPOINT)
		.then(response => {
			// If response is successful, but nothing found
			if(!response.data.items) {
				throw Error('Nothing found');
			}
			const data = response.data.items;
			// Return the image.
			return {
				status: 'success',
				response: response.data.items[getRandomResult(data.length)].pagemap.cse_image[0].src,
			}
		})
		.catch(err => {
			// Network errors
			console.log(err);
			return {
				status: 'fail',
				response: `${err.message}`
			}
		})
}

export default googleImage
