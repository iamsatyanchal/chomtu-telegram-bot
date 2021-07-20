import covidService from '../../services/covidService';

module.exports =  {
  name: 'covind',
  description: 'Get covid data of a specific district in India',
  usage: '<district-name>',
  args: true,
  chatAction: 'typing',
  async execute(ctx,district) {
    const result = await covidService.covidIn(district.join(''));
    ctx.replyWithMarkdown(result.markdown);
  }
}