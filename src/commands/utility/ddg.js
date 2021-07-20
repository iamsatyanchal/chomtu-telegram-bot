import { fetchHTML, iterateLINKS, iterateHTML } from '../../helpers';

function toEscapeMSg(str) {
  return str.replace(/_/gi, '__');
  // .replace(/-/gi, "\\-")
  // .replace("~", "\\~")
  // .replace(/`/gi, "\\`")
  // .replace(/\./g, "\\.")
  // .replace(/\</g, "\\<")
  // .replace(/\>/g, "\\>");
  // .replace(/\[/g, "\\[")
  // .replace(/\]/g, "\\]");
}

module.exports =  {
  name: 'ddg',
  description: 'Get search results from DuckDuckGo',
  usage: '<query-to-search>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, query) {
    const searchResult = fetchHTML(`https://html.duckduckgo.com/html?q=${query.join('%20')}`);

    searchResult
    .then((result) => {
      let message = '🔍 Search results from DuckDuckGo\n\n';

      const finalResult = [];

      const title = iterateHTML(result, '.result__body > .result__title');
      const links = iterateLINKS(result, '.result__body > .result__snippet');
      const descriptions = iterateHTML(
        result,
        '.result__body > .result__snippet',
      );

      for (let x = 0; x < 10; x++) {
        const obj = {};
        obj.title = title[x].trim();
        obj.link = toEscapeMSg(links[x].trim());
        obj.description = descriptions[x].trim();

        finalResult.push(obj);
      }

      finalResult.forEach((obj) => {
        message += `[${obj.title}](${obj.link})\n${obj.description}\n\n`;
      });

      return ctx.reply(toEscapeMSg(message));
    })
    .catch((err) => {
      console.log(err.message);
      return ctx.reply(`Well that's awkward, try again.`);
    });
  }
}