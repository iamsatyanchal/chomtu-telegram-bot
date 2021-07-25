import ddg from '../../services/ddg';

module.exports = {
  name: 'ddg',
  description: 'Get search results from DuckDuckGo',
  usage: '<query-to-search>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, query) {
    const result = await ddg(query);
    try {
      await ctx.replyWithMarkdown(result.markdown);
    } catch (e) {
      // console.log(e)
      await ctx.replyWithMarkdown(
        `
        The result is too long to display. Please visit this search query link manually\n\n` +
          `https://duckduckgo.com/?q=${query.join('%20')}`
      );
    }
  },
};
