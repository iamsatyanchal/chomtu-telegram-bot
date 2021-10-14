import { iterateHTML, fetchHTML } from '../../helpers';

module.exports = {
  name: 'stock',
  description: 'Get data about a specific stock',
  usage: '<stock-name>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, stock) {
    try {
      const baseURL = `https://portal.tradebrains.in/stock/${stock.join("")}/consolidated`;

      const response = fetchHTML(baseURL);

      response.then(async(html) => {
        let mainDesc = iterateHTML(html, ".stock-details-nums");
        let oneDayReturn = iterateHTML(html, ".stock_item > small")[2];
        let cons = iterateHTML(html , "div#cons > div > div > ul > li");
        let pros = iterateHTML(html , "div#pros > div > div > ul > li > p");
        let lowHigh = oneDayReturn.includes("-") ? true: false;

        let prosData = "";
        let consData = "";

        pros.forEach(e => prosData += `\n\t\t- ${e.trim()}`);
        cons.forEach(e => consData += `\n\t\t- ${e.trim()}`);


        ctx.replyWithMarkdown(`\n`+
          `📊 *${html(".stock_title_name").text().trim()} [${html(".stock_title_mcap").text().trim()}]*\n\n` +
          `🏢 *${html(".stock-industry-category").text().trim()}*\n\n` +
          `💵 *Current Price:* ${lowHigh ? "📉" : "📈"} ${mainDesc[2].trim()} ${oneDayReturn}\n*Market Cap:* ${mainDesc[0]}\n*PE (TTM):* ${mainDesc[1]}\n\n` +
          `✅ *Pros:*${prosData}\n\n` +
          `🚫 *Cons:*${consData}`
        );
      })
    } catch (e) {
      ctx.reply(e.message);
    }
  },
};
