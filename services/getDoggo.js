const axios = require("axios");

const getDoggo = () => {
    // Allowed extensions
    const images = ["png", "jpg", "jpeg"];
    const video = ["mp4", "gif"];

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

module.exports = getDoggo;