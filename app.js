const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_API);

// Import services
const getWeather = require("./services/getWeather.js");
const whatIs = require("./services/whatIs.js");
const ud = require("./services/urban.js");
const googleImage = require("./services/googleImage.js");
const covid = require("./services/covid.js");
const wiki = require("./services/wiki.js");
const getLyrics = require("./services/getLyrics.js");
const { getDoggo, getCat } = require("./services/getRandomAnimals.js")

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

    let doggoUrl = await getDoggo();
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

    const catLink = await getCat();

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

    const result = await ud(query);
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
    const result = await covid(country.join("-"));
    return ctx.replyWithMarkdown(result.markdown);
});

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

    const resultObj = await getLyrics(songName);
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

// [+] HELP [+]
bot.command("help", (ctx) => {
    ctx.reply(
        `/weather - weather information\n` +
            `/aqi - air quality index\n` +
            `/doggo - get random dogs\n` +
            `/cat- random cat\n` +
            `/whatis - returns the meaning\n` +
            `/urban- urban dictionary definition\n` +
            `/get- search google for an image\n` +
            `/covid- get covid data\n` +
            `/wiki- wikipedia\n` +
            `/lyrics- get lyrics of song(ENGLISH)\n`
    );
});

// bot.command('/test', ctx => {
//     console.log(ctx.chat);
// })


// [+] SAVVN API [+]
bot.command('hindilyrics', ctx => {
    axios.get('https://saavn.me/lyrics?id=cymtugLP')
        .then(response => {
            // console.log(response.data)
            ctx.reply(response.data.lyrics);
        })
        .catch(err => console.log(err));
})

// [+] TESTING FOR INLINE MODE [+]
bot.on('inline_query', async (ctx) => {
    // console.log(ctx.inlineQuery);
    // Get just the query
    // console.log(ctx.inlineQuery.query);
    const query = ctx.inlineQuery.query;
    const baseURL = `https://www.lyreka.com/api/v1/search/songs?q=${query}&limit=10`;
    const res = await axios.get(baseURL);   

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
})

// [+] startChomtu Function [+]
const startChomtu = () => {
    const date = new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
    });
    bot.launch();
    console.log(`Bot ready \n${date} (IST)`);
};

module.exports = startChomtu;
