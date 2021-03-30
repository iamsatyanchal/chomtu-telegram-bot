const axios = require("axios");

const getDoggo = () => {
    // Grab a new doggo-URL and return it
    return axios
        .get("https://random.dog/woof.json")
        .then((result) => {
            return result.data.url;
        })
        .catch((err) => {
            console.log(err);
        });
};

const getCat = () => {
	return axios.get('https://aws.random.cat/meow')
		.then(result => result.data.file)
		.catch(err => err);
}

module.exports = {
	getDoggo,
	getCat
};