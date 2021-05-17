import { BRAD_API, BOT_API } from '../config';
import { Telegraf } from 'telegraf';
import axios from 'axios';

// Bot instance
const bot = new Telegraf(BOT_API);

// Import services
import { 
    covidService, 
    getWeather,
    whatIs,
    urbanDictionary,
    googleImage,
    wiki,
    getLyrics,
    randomAnimals,
    fetch
} from './services';

//  [+] FUNCTION [+]
const getUserMessage = (ctx) => {
    const message = ctx.message.text.split(" ");
    message.shift();

    return message;
}

// [+] START COMMAND [+]
bot.command("start", (ctx) => {
    ctx.replyWithMarkdown(`
        *Waddup?*\n\nType /help to see all the available commands
    `);
});

// [+] STICKER [+]
bot.on('sticker', (ctx) => {
    //console.log(ctx.message.sticker.set_name);

    // AUTO DELETE THE STICKER
    if (ctx.message.sticker.set_name === 'totottbokep') {
        ctx.deleteMessage(ctx.message.message_id);
    }
})

// [+] INSULT COMMAND [+]
bot.command("insult", async (ctx) => {
    axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
        .then(res => {
            ctx.reply(res.data.insult);
        })
        .catch(err => ctx.reply(err.message));
})

//  [+] WEATHER COMMAND [+]
bot.command("weather", async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    // Split the context and just get the query typed in.
    const cityName = getUserMessage(ctx);

    const data = await getWeather(cityName);

    // check for arguments
    if (!cityName.length > 0) {
        ctx.reply('Usage: /weather <city_name>')
    } else {
        // Make sure if the user typed the city name.
        if (data.status === 'success') {
            // await ctx.replyWithMarkdown(data.markdown);
            ctx.telegram.sendMessage(ctx.chat.id, data.markdown, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard:[
                        [{text: 'Open on weather.com', url: data.url}]
                    ]
                }
            })
        }
        // If no city given, send usage.
        else {
            await ctx.reply(data.message);
        }
    }

});

// [+] DOGGO IMAGE [+]
bot.command("doggo", async (ctx) => {
    // send photo...
    ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    let doggoUrl = await randomAnimals.getDoggo();
    // Split the URL content
    // and just get the extention of the image.
    let extension = doggoUrl.split(".")[2].toLowerCase();

    // Reply with appropriate telegraf method
    // according to the allowed extensions.
    switch (extension) {
        case "png":
        case "jpg":
        case "jpeg":
            ctx.replyWithPhoto(doggoUrl);
            break;
        default:
            ctx.replyWithVideo(doggoUrl);
    }
});

// [+] RANDOM CAT [+]
bot.command("cat", async (ctx) => {
    // send photo...
    ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    const catLink = await randomAnimals.getCat();

    // If the links a gif, use video method
    if (catLink.includes("gif")) {
        return ctx.replyWithVideo(catLink);
    }
    // reply with a photo
    ctx.replyWithPhoto(catLink);
});

// [+] DICTIONARY [+]
bot.command("whatis", async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    // Split the context and just get the word typed in.
    const word = getUserMessage(ctx);

    if (!word.length > 0) {
        return ctx.reply("Usage: /whatis <query>");
    }
    // call whatIs service and get the result.
    const result = await whatIs(word);

    // If no word found, send error
    if (result.status === "fail") {
        return ctx.reply(result.markdown);
    }

    // If everything goess well then send markdown and audio, if any.
    ctx.replyWithMarkdown(
        `📕 Oxford Dictionary\n\n` +
            `*Word*:\t ${result.word}\n\n` +
            `*Definition*:\t ${result.definition}\n\n` +
            `*Short-Definition*:\t ${result.shortDefinitions}`
    );
    // If audio is present then send audio.
    if (!result.audio) {
        return null;
    } else {
        await ctx.replyWithAudio(result.audioLink);
    }
});

// [+] URBAN-DICTIONARY [+]
bot.command("urban", async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    // Split the context and just get the query typed in.
    const query = getUserMessage(ctx);

    const result = await urbanDictionary(query);
    ctx.replyWithMarkdown(`${result.markdown}`);
});

// [+] CUSTOM IMAGE SEARCH [+]
bot.command("get", async (ctx) => {
    // sending photo...
    ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    try {
        // Split the context and just get the query typed in.
        const search = getUserMessage(ctx)
        const result = await googleImage(search);

        // Check for 'success' status in result and
        // send reply accordingly
        if (result.status === 'success') {
            await ctx.telegram.sendPhoto(ctx.chat.id, result.response, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard:[
                        [{text: 'Image Link', url: result.response}]
                    ]
                }
            })
        } else {
           await ctx.reply(result.response);
        }
    } catch (e) {
        console.log(e.message)
        ctx.reply('Error Occurred');
    }
});

// [+] COVID INFO [+]
bot.command("covid", async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    const country = getUserMessage(ctx);

    // Check if country name is given.
    if (!country.length > 0) {
        // if no country then send usage.
        return ctx.reply("Usage: /covid country_name");
    }
    const result = await covidService.covid(country.join("-"));
    return ctx.replyWithMarkdown(result.markdown);
});

// [+] COVID INDIA [+]
bot.command('covind', async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
    const district = getUserMessage(ctx);

    if (!district.length > 0) {
        return ctx.reply("Usage: /covidin district");
    }

    const result = await covidService.covidIn(district.join(' '));
    ctx.replyWithMarkdown(result.markdown);
})

// [+] WIKIPEDIA [+]
bot.command("wiki", async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    const query = getUserMessage(ctx);

    // Check if country name is given.
    if (!query.length > 0) {
        // if no country then send usage.
        return ctx.reply("Usage: /wiki your_query");
    }

    const result = await wiki(query);
    ctx.replyWithMarkdown(result.markdown);
});

// [+] LYREKA FOR LYRICS [+]
bot.command("lyrics", async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
    const songName = getUserMessage(ctx);

    if (!songName.length > 0) {
        ctx.reply('Usage: /lyrics song_name');
    }

    const resultObj = await getLyrics.lyreka(songName);
    // console.log(resultObj);
    if (resultObj.status === 'success') {
        // console.log(resultObj)
       try {
         await ctx.replyWithMarkdown(`
            *🎶 Song Name:* ${resultObj.songName}\n` +
            `*Artist:* ${resultObj.artist}\n\n` +
            `*Lyrics*:\n${resultObj.lyrics}\n`+
            `[Cover](${resultObj.cover})`
        )
       } catch {
            // console.log(e.message);
            await ctx.replyWithMarkdown(`😳 Song is too long, read the lyrics [here](${resultObj.url})\n`);
        }

     } else {
        ctx.replyWithMarkdown(`${resultObj.message}`);
    }
    
});

// [+] SAAVN [+]
bot.command('saavn', async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
    const songName = getUserMessage(ctx);

    if (!songName.length > 0) {
        ctx.reply('Usage: /lyrics song_name');
    }
    
    const lyrics = await getLyrics.saavn(songName.join('+'));
    ctx.replyWithMarkdown(lyrics.markdown);
})

// [+] FETCH IMAGE RESULTS FROM DOGPILE [+]
bot.command('fetch', async (ctx) => {
    // sending photo...
    ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
    const query = getUserMessage(ctx);

    const result = await fetch(query.join('+'));

    if (result.status === "fail") {
        ctx.reply("Sorry, noting found!");
    }

    if (!result.data) {
        return ctx.reply("Error Occurred");
    }
    await ctx.telegram.sendPhoto(ctx.chat.id, result.data, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard:[
                [{text: 'Image Link', url: result.url}]
            ]
        }
    })
})

// [+] HELP [+]
bot.command("help", (ctx) => {
    ctx.replyWithMarkdown(
        `/weather - Weather\n` +
            `/doggo - Returns random dogs\n` +
            `/cat- Returns random cats\n` +
            `/insult- :)\n` + 
            `/whatis - Dictionary definition\n` +
            `/urban- Urban dictionary definition\n` +
            `/get (ALPHA)- Returns image from google\n` +
            `/covid- Returns country wise covid data\n` +
            `/covind- Returns district wise covid data (India)\n` +
            `/wiki- Wikipedia\n` +
            `/lyrics- Search for lyrics of a song (*English*)\n` + 
            `/saavn- Search for hindi song lyrics\n` +
            `/fetch- Returns image results` 
    );
});

// [+] TESTING FOR INLINE MODE [+]
bot.on('inline_query', async (ctx) => {
    // console.log(ctx.inlineQuery);
    // Get just the query
    // console.log(ctx.inlineQuery.query);
    const query = ctx.inlineQuery.query;
    const baseURL = `https://www.lyreka.com/api/v1/search/songs?q=${query}&limit=10`;
    const res = await axios.get(baseURL);   

    try {
        result = res.data.data.map((song, index) => {
            // console.log(song);

            return {
                type: 'article',
                id: String(index),
                title: song.title,
                description: song.artist_names,
                thumb_url: song.image_url_tiny,
                input_message_content: {
                    message_text: `Song: ${song.title}\nLyrics: ${song.url}`
                },
            }
        });

        ctx.answerInlineQuery(result);
    } catch (e) {
        console.log(e.message);
        ctx.answerInlineQuery("Error Occurred");
    }
})

// [+] startChomtu Function [+]
const startChomtu = () => {
    const date = new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
    });
    bot.launch();
    console.log(`Bot ready \n${date} (IST)`);
};

export default startChomtu;
