const axios = require("axios");

const getDoggo = () => {
    const images = ["png", "jpg", "jpeg"];
    const video = ["mp4", "gif"];
    return axios
        .get("https://random.dog/woof.json")
        .then((result) => {
            return result.data.url;
        })
        .catch((err) => {
            console.log(err);
        });
};

// DOGGO image
module.exports = getDoggo;