const randomAnimals = require('../services/getAnimails');

module.exports = {
    name: 'randomAnimals',
    description: 'randomAnimals',
    async execute(ctx, args) {
        // send photo...
    ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    let doggoUrl = await randomAnimals.getDoggo();
    // Split the URL content
    // and just get the extention of the image.
    let extension = doggoUrl.split(".")[2].toLowerCase();

    // Reply with appropriate telegraf method
    // according to the allowed extensions.
    switch (extension) {
        case "png":
        case "jpg":
        case "jpeg":
            ctx.replyWithPhoto(doggoUrl);
            break;
        default:
            ctx.replyWithVideo(doggoUrl);
    }
    }
}