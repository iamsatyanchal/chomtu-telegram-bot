import { iterateLINKS, fetchHTML } from '../../helpers';

const randomNumber = (max) => Math.floor(Math.random() * max - 1);

module.exports = {
  name: 'get',
  description: 'Search for images across the web',
  args: true,
  chatAction: 'upload_photo',
  usage: '<query>',
  async execute(ctx, query) {
    const resp = fetchHTML(
      `https://searx.run/search?q=${query.join('%20')}&categories=images&language=en-US`,
    );

    return resp
      .then(async (res) => {
        const images = await iterateLINKS(res, '.result-images > a > img', 'src');
        const image = images[randomNumber(images.length)];

        if (images.length) {
          return ctx.telegram.sendPhoto(ctx.chat.id, image, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [[{ text: 'Image Link', url: image }]]
            }
          });
        }
        return ctx.reply('Nothing found 🤨');
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        return ctx.reply(err.message);
      });
  }
}