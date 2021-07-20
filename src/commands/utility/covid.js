import covidService from '../../services/covidService';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports =  {
  name: 'covid',
  description: 'Get covid data of a specific country',
  usage: '<country-name>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, country) {
    const result = await covidService.covid(country.join('-'));
    ctx.replyWithMarkdown(result.markdown);
  }
}