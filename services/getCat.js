const axios = require('axios');


const getCat = () => {
	return axios.get('https://aws.random.cat/meow')
		.then(result => result.data.file)
		.catch(err => err);
}


module.exports = getCat;