import { fetchHTML } from '../../helpers';

module.exports = {
  name: 'wiki',
  description: 'Get information from wikipedia',
  usage: '<query>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, query) {
    const baseURL = `https://en.wikipedia.org/wiki/${query.join('%20')}`;
    const data = fetchHTML(baseURL);

    try {
      data
        .then((result) => {
          //  Get the short description (class shortdescription inside class mw-parser-output)
          const shortDesc = result(
            '.mw-parser-output .shortdescription'
          ).text();
          //  Get the main output
          const mainOutput = result('.mw-parser-output p').text().split('\n');
          // remove exmpty strings from the array
          const output = mainOutput.filter((res) => res !== '');

          ctx.replyWithMarkdown(
            `*🌏 Wikipedia*\n\n` +
              `*Query:* ${query.join(' ')}\n\n` +
              `*Short Desc:* ${shortDesc}\n\n` +
              `*Main Desc:*\n${output[0]}\n\n` +
              `[Open Wikipedia](${baseURL})`
          );
        })
        .catch((err) => {
          ctx.reply('Found nothing 🤨');
        });
    } catch (err) {
      ctx.reply(err.message);
    }
  },
};
