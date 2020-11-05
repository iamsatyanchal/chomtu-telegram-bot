const axios = require('axios');


axios.get("https://api.thedogapi.com/v1/images/search")
	.then(result => {
		url = result.data[0].url;
		console.log(url)
	})
	.catch(err => console.log(err))