import ddg from '../../services/ddg';

module.exports = {
  name: 'ddg',
  description: 'Get search results from DuckDuckGo',
  usage: '<query-to-search>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, query) {
    const result = await ddg(query);
    ctx.replyWithMarkdown(result.markdown);
  },
};
