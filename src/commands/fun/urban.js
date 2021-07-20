import urbanDictionary from '../../services/urbanDictionary';

module.exports = {
  name: 'urban',
  description: 'Get word meaning from urban dictionary',
  args: true,
  chatAction: 'typing',
  usage: '<query>',
  async execute(ctx, args) {
    const result = await urbanDictionary(args);
    ctx.replyWithMarkdown(result.markdown);
  },
};
