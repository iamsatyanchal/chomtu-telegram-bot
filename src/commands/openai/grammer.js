import axios from 'axios';
import { OPEN_AI_KEY } from '../../config';

module.exports = {
  name: 'grammer',
  description: '*[OpenAI Beta]* Corrects the grammer',
  usage: '<a-broke-english-sentence>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, args){
    const baseURL = `https://api.openai.com/v1/engines/davinci/completions`;
    axios.post(baseURL, {
        'prompt': `Original: ${args.join(' ')}\nStandard American English:`,
        "temperature": 0,
        "max_tokens": 60,
        "top_p": 1.0,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0,
        "stop": ["\n"]
    },{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPEN_AI_KEY}`
      },
      
    }).then(res => {
      ctx.reply(res.data.choices[0].text, { reply_to_message_id: ctx.message.message_id });
    }).catch(err => {
      console.log(err);
      ctx.reply(err.message);
    })
  }
}