import dictionary from '../../services/dictionary';

module.exports =  {
  name: 'whatis',
  description: 'Get meaning of a word from oxford dictionary',
  usage: '<word>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, args) {
    const { audio, markdown } = await dictionary(args);
    await ctx.replyWithMarkdown(markdown);
    if (audio) {
      await ctx.replyWithAudio(audio);
    }
  }
}