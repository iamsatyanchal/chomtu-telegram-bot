const axios = require('axios');
const cheerio = require('cheerio')


// axios.get("https://api.thedogapi.com/v1/images/search")
// 	.then(result => {
// 		url = result.data[0].url;
// 		console.log(url)
// 	})
// 	.catch(err => console.log(err))

url = "https://www.worldometers.info/coronavirus/country/india/"

axios.get(url)
        .then(response => {
            const $ = cheerio.load(response.body)
            console.log(r('maincounter-number'))
        })