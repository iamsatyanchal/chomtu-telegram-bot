import randomAnimals from '../../services/getAnimals';

module.exports = {
    name: 'doggo',
    description: 'Random doggos',
    args: false,
    chatAction: 'upload_photo',
    async execute(ctx, args) {
      let randomURL = await randomAnimals.getDoggo();
      let urlExtension = randomURL.split(".")[2].toLowerCase();

      switch (urlExtension) {
          case "png":
          case "jpg":
          case "jpeg":
              ctx.replyWithPhoto(randomURL);
              break;
          default:
              ctx.replyWithVideo(randomURL);
      }
    }
}