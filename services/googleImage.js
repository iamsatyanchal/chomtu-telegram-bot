const axios = require('axios')
require('dotenv').config()

// Generate Random numbers
const getRandomPage = () => {
	// random number for a page
	return Math.ceil(Math.random()*2);
}

const getRandomResult = () => {
	// random number for result
	return Math.floor(Math.random()*9);
}

// Get a new google image and return it
const googleImage = (search) => {
	// Full URL
	const CSE_ENDPOINT = `https://www.googleapis.com/customsearch/v1/siterestrict?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.CSE_ID}&q=${search.join('%20')}&start=${getRandomPage()}&imgSize=large`

	return axios.get(CSE_ENDPOINT)
		.then(response => {
			// If response is successful, but nothing found
			if(!response.data.items) {
				return {
					status: 'fail',
					response: 'I found nothing 😞'
				}
			}
			// Return the image.
			return {
				status: 'success',
				response: response.data.items[getRandomResult()].pagemap.cse_image[0].src
			}
		})
		.catch(err => {
			// Network error
			console.log(err);
			return {
				status: 'fail',
				response: 'Network Error Occurred'
			}
		})
}

module.exports = googleImage;