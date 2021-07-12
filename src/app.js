import { Telegraf } from 'telegraf';
import axios from 'axios';
import { BOT_API } from '../config';

// Import services
import {
  covidService,
  getWeather,
  whatIs,
  urbanDictionary,
  wiki,
  getLyrics,
  randomAnimals,
  get,
  ytdl,
  ddg,
} from './services';

// Bot instance
const bot = new Telegraf(BOT_API);

//  [+] FUNCTION [+]
const getUserMessage = (ctx) => {
  const message = ctx.message.text.split(' ');
  message.shift();

  return message;
};

// [+] START COMMAND [+]
bot.command('start', (ctx) => {
  ctx.replyWithMarkdown(`
        *Waddup?*\n\nType /help to see all the available commands
    `);
});

// [+] INSULT COMMAND [+]
bot.command('insult', async (ctx) => {
  axios
    .get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
    .then((res) => {
      ctx.reply(res.data.insult);
    })
    .catch((err) => ctx.reply(err.message));
});

//  [+] WEATHER COMMAND [+]
bot.command('weather', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

  // Split the context and just get the query typed in.
  const cityName = getUserMessage(ctx);

  const data = await getWeather(cityName);

  // check for arguments
  if (!cityName.length > 0) {
    return ctx.reply('Usage: /weather <city_name>');
  }
  // Make sure if the user typed the city name.
  if (data.status === 'success') {
    // await ctx.replyWithMarkdown(data.markdown);
    return ctx.telegram.sendMessage(ctx.chat.id, data.markdown, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Open on weather.com', url: data.url }]],
      },
    });
  }
  // If no city given, send usage.
  return ctx.reply(data.message);
});

// [+] YT AUDIO [+]
// eslint-disable-next-line consistent-return
bot.command('yt', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  // Get video URL
  const videoID = getUserMessage(ctx)[0];
  // eslint-disable-next-line no-console
  console.log('VideoID:', videoID);

  if (!(videoID.includes('youtube') || videoID.includes('youtu.be'))) {
    return ctx.reply('I only accept youtube links');
  }
  if (videoID.includes('&list')) {
    return ctx.reply('Calm down! Just give a single video link');
  }

  const songLink = await ytdl(videoID);
  // eslint-disable-next-line no-console
  console.log('Song LInk:', songLink.status ? true : songLink.message);
  if (!songLink.status) {
    return ctx.reply(songLink.message);
  }

  try {
    // eslint-disable-next-line no-console
    console.log(songLink.url);
    await ctx.replyWithVideo(songLink.url);
  } catch (e) {
    await ctx.reply(e.message);
  }
});

// [+] DOGGO IMAGE [+]
bot.command('doggo', async (ctx) => {
  // send photo...
  ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

  const doggoUrl = await randomAnimals.getDoggo();
  // Split the URL content
  // and just get the extention of the image.
  const extension = doggoUrl.split('.')[2].toLowerCase();

  // Reply with appropriate telegraf method
  // according to the allowed extensions.
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
      ctx.replyWithPhoto(doggoUrl);
      break;
    default:
      ctx.replyWithVideo(doggoUrl);
  }
});

// [+] RANDOM CAT [+]
bot.command('cat', async (ctx) => {
  // send photo...
  ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

  const catLink = await randomAnimals.getCat();

  // If the links a gif, use video method
  if (catLink.includes('gif')) {
    return ctx.replyWithVideo(catLink);
  }
  // reply with a photo
  return ctx.replyWithPhoto(catLink);
});

// [+] DICTIONARY [+]
// eslint-disable-next-line consistent-return
bot.command('whatis', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

  // Split the context and just get the word typed in.
  const word = getUserMessage(ctx);

  if (!word.length > 0) {
    return ctx.reply('Usage: /whatis <query>');
  }
  // call whatIs service and get the result.
  const { audio, markdown } = await whatIs(word);

  await ctx.replyWithMarkdown(markdown);

  if (audio) {
    await ctx.replyWithAudio(audio);
  }
});

// [+] URBAN-DICTIONARY [+]
bot.command('urban', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

  // Split the context and just get the query typed in.
  const query = getUserMessage(ctx);

  if (!query.length > 0) {
    return ctx.reply('Usage: /urban <query>');
  }

  const result = await urbanDictionary(query);
  return ctx.replyWithMarkdown(`${result.markdown}`);
});

// [+] COVID INFO [+]
bot.command('covid', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

  const country = getUserMessage(ctx);

  // Check if country name is given.
  if (!country.length > 0) {
    // if no country then send usage.
    return ctx.reply('Usage: /covid country_name');
  }
  const result = await covidService.covid(country.join('-'));
  return ctx.replyWithMarkdown(result.markdown);
});

// [+] COVID INDIA [+]
bot.command('covind', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  const district = getUserMessage(ctx);

  if (!district.length > 0) {
    return ctx.reply('Usage: /covidin district');
  }

  const result = await covidService.covidIn(district.join(' '));
  return ctx.replyWithMarkdown(result.markdown);
});

// [+] WIKIPEDIA [+]
bot.command('wiki', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

  const query = getUserMessage(ctx);

  // Check if country name is given.
  if (!query.length > 0) {
    // if no country then send usage.
    return ctx.reply('Usage: /wiki your_query');
  }

  const result = await wiki(query);
  return ctx.replyWithMarkdown(result.markdown);
});

// [+] LYREKA FOR LYRICS [+]
// eslint-disable-next-line consistent-return
bot.command('lyrics', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  const songName = getUserMessage(ctx);

  if (!songName.length > 0) {
    return ctx.reply('Usage: /lyrics song_name');
  }

  const resultObj = await getLyrics.lyreka(songName);
  if (resultObj.status === 'success') {
    try {
      await ctx.replyWithMarkdown(
        `
        *🎶 Song Name:* ${resultObj.songName}\n`
          + `*Artist[s]:* ${resultObj.artist}\n\n`
          + `*Lyrics*:\n${resultObj.lyrics}\n`
          + `[Cover](${resultObj.cover})`,
      );
    } catch {
      await ctx.replyWithMarkdown(
        `😳 Song is too long, read the lyrics [here](${resultObj.url})\n`,
      );
    }
  } else {
    return ctx.replyWithMarkdown(`${resultObj.message}`);
  }
});

// [+] SAAVN [+]
bot.command('saavn', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  const songName = getUserMessage(ctx);

  if (!songName.length > 0) {
    return ctx.reply('Usage: /lyrics song_name');
  }

  const lyrics = await getLyrics.saavn(songName.join('+'));
  return ctx.replyWithMarkdown(lyrics.markdown);
});

// [+] FETCH IMAGE RESULTS FROM DOGPILE [+]
// eslint-disable-next-line consistent-return
bot.command('get', async (ctx) => {
  // sending photo...
  ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
  const query = getUserMessage(ctx);

  if (!query.length > 0) {
    return ctx.reply('Usage: /get <query>');
  }

  const result = await get(query);

  try {
    if (result.status === 'fail') {
      return ctx.reply(result.message);
    }

    await ctx.telegram.sendPhoto(ctx.chat.id, result.url, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Image Link', url: result.url }]],
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    ctx.reply(e.message);
  }
});

bot.command('ddg', async (ctx) => {
  // typing...
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  const query = getUserMessage(ctx);

  const result = await ddg(query);
  ctx.replyWithMarkdown(result.markdown);
});

// [+] HELP [+]
bot.command('help', (ctx) => {
  ctx.replyWithMarkdown(
    '/weather - Weather\n'
      + '/doggo - Returns random dogs\n'
      + '/cat- Returns random cats\n'
      + '/insult- :)\n'
      + '/whatis - Dictionary definition\n'
      + '/urban- Urban dictionary definition\n'
      + '/get- Returns image result\n'
      + '/covid- Returns country wise covid data\n'
      + '/covind- Returns district wise covid data (India)\n'
      + ' /wiki- Wikipedia\n'
      + '/lyrics- Search for lyrics of a song (*English*)\n'
      + '/saavn- Search for hindi song lyrics\n'
      + '/ddg- Search results from DuckDuckGo\n'
      + '/yt- [BETA] Download youtube video\n',
  );
});

// [+] startChomtu Function [+]
const startChomtu = () => {
  const date = new Date().toLocaleString(undefined, {
    timeZone: 'Asia/Kolkata',
  });
  bot.launch();
  // eslint-disable-next-line no-console
  console.log(`Bot ready \n${date} (IST)`);
};

export default startChomtu;
