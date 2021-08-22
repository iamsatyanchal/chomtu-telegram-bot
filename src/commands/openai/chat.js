import axios from 'axios';
import { OPEN_AI_KEY } from '../../config';

module.exports = {
  name: 'chat',
  description: '*[OpenAI Beta]* Chat with GPT3',
  usage: '<query>',
  args: true,
  chatAction: 'typing',
  async execute(ctx, args) {
    const baseURL = `https://api.openai.com/v1/engines/davinci/completions`;
    axios
      .post(
        baseURL,
        {
          prompt: `Human: ${args.join(' ')}\nAI:`,
          temperature: 0.9,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.6,
          stop: ['\n', ' Human:', ' AI:'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPEN_AI_KEY}`,
          },
        }
      )
      .then((res) => {
        ctx.reply(res.data.choices[0].text, {
          reply_to_message_id: ctx.message.message_id,
        });
      })
      .catch((err) => {
        console.log(err);
        ctx.reply(err.message);
      });
  },
};
