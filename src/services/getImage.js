import axios from 'axios';
import { iterateLINKS, fetchHTML } from '../helpers';

const randomNumber = (max) => {
	return Math.floor(Math.random() * max - 1);
}

export default function getImage (query) {
	const resp = fetchHTML(`https://searx.run/search?q=${query}&categories=images&language=en-US`);

	return resp
		.then(async (res) => {
			const images = await iterateLINKS(res, '.result-images > a > img', 'src');
			
			if (images.length) {
				return {
					status: 'success',
					url: images[randomNumber(images.length)]
				}
			} 
			return { status: 'fail', message: 'Nothing found 🤨' }
		})
		.catch(err => {
			console.log(err);
			return { status: 'fail', message: err.message };
		})
}