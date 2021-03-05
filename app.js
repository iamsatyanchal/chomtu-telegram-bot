const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();
const bot = new Telegraf(process.env.BRAD_API);

// Import services
const getDoggo = require("./services/getDoggo.js");
const getWeather = require("./services/getWeather.js");
const getAQI = require("./services/getAQI.js");
const whatIs = require("./services/whatIs.js");
const ud = require("./services/urban.js");
const googleImage = require("./services/googleImage.js");
const getCat = require("./services/getCat.js");
const covid = require("./services/covid.js");
const wiki = require("./services/wiki.js");
const getLyrics = require("./services/getLyrics.js");

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
    const cityName = ctx.message.text.split(" ");
    cityName.shift();

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

// [+] AQI INDEX [+]
bot.command("/aqi", async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    // Make sure if the user typed the city name.
    const city = ctx.message.text.split(" ");
    city.shift();

    // Check if country name is given.
    if (!city.length > 0) {
        // if no country then send usage.
        return ctx.reply("🙅‍♂️ *Usage*\n/aqi city_name");
    }

    const result = await getAQI(city.join("-"));
    ctx.replyWithMarkdown(`${result.markdown}`);
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
    const word = ctx.message.text.split(" ")[1];
    if (!word) {
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
    const query = ctx.message.text.split(" ");
    query.shift();
    const result = await ud(query);
    ctx.replyWithMarkdown(`${result.markdown}`);
});

// [+] CUSTOM IMAGE SEARCH [+]
bot.command("get", async (ctx) => {
    // sending photo...
    ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    // Split the context and just get the query typed in.
    const search = ctx.message.text.split(" ");
    search.shift();
    const result = await googleImage(search);

    // Check for 'success' status in result and
    // send reply accordingly
    const resp =
        result.status === "success"
            ? ctx.replyWithPhoto(result.response)
            : ctx.reply(result.response);
});

// [+] COVID INFO [+]
bot.command("covid", async (ctx) => {
    // typing...
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    const country = ctx.message.text.split(" ");
    country.shift();

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

    const query = ctx.message.text.split(" ");
    query.shift();

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
    const songName = ctx.message.text.split(" ");
    songName.shift();

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


// [+] startChomtu Function [+]
const startChomtu = () => {
    const date = new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
    });
    bot.launch();
    console.log(`Bot ready \n${date} (IST)`);
};

module.exports = startChomtu;
