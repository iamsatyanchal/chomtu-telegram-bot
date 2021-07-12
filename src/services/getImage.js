import axios from 'axios';
import { WEB_SEARCH_KEY } from '../../config';

const randomNumber = (max) => {
	return Math.floor(Math.random() * max);
}

export default function getImage (query) {
	var options = {
	  method: 'GET',
	  url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI',
	  params: {
	    q: `${query}`,
	    pageNumber: '1',
	    pageSize: '20',
	    autoCorrect: 'true',
	    safeSearch: 'false'
	  },
	  headers: {
	    'x-rapidapi-key': WEB_SEARCH_KEY,
	    'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
	  }
	};

	return axios.request(options).then(function (response) {
		const { data } = response;
		const results = data.value;
		
		if (results.length) {
			const imageLink = results[randomNumber(results.length)]['url'];
			
			return {
				status: 'success',
				url: imageLink
			}
		}
		return { status: 'fail', message: 'Nothing found 😐' };
		// console.log(response.data);
	}).catch(function (error) {
		console.error(error);
		return { status: 'fail', message: error.message };
	});
}