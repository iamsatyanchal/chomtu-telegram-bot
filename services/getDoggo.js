const axios = require("axios");

const getDoggo = () => {
    const images = ["png", "jpg", "jpeg"];
    const video = ["mp4", "gif"];
    return axios
        .get("https://random.dog/woof.json")
        .then((result) => {
            console.log('getDoggo runned from servcies')
            console.log('result: ', result.data.url)
            return result.data.url;
            // const url = result.data.url;
            // const extension = url.split(".")[2];

            // switch (extension) {
            //     case "png":
            //     case "jpg":
            //     case "jpeg":
            //         ctx.replyWithPhoto(url);
            //         break;
            //     default:
            //         ctx.replyWithVideo(url);
            // }
        })
        .catch((err) => {
            console.log(err);
        });
};

// DOGGO image
module.exports = getDoggo;