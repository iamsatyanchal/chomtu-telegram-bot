const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_API);

// Import services
const getDoggo = require("./services/getDoggo.js");
const getWeather = require('./services/getWeather.js');
const getAQI = require('./services/getAQI.js');
const whatIs = require('./services/whatIs.js');
const ud = require('./services/urban.js');
const googleImage = require('./services/googleImage.js')

// [+] START COMMAND [+] 
bot.command("start", (ctx) => {
    ctx.replyWithMarkdown(`
        *Waddup?*\n\nType /help to see all the available commands
    `);
});

//  [+] WEATHER COMMAND [+] 
bot.command("weather", async (ctx) => {
    // Make sure if the user typed the city name.
    if (ctx.message.text.split(' ').length > 1){
        // Split the context and just get the city typed in.
        const city = ctx.message.text.split(" ")[1];
        const weatherReport = await getWeather(city);
        ctx.replyWithMarkdown(`${weatherReport.markdown}`)
    } 
    // If no city given, send usage.
    else {
        ctx.reply(`😡 Usage:\n\n/weather city_name`);
    }
});

// [+] AQI INDEX [+] 
bot.command("/aqi", async (ctx) => {
    // Make sure if the user typed the city name.
    if (ctx.message.text.length > 4) {
        // Split the context and just get the city typed in.
        let city = ctx.message.text.split(" ");
        const result = await getAQI(city)
        ctx.replyWithMarkdown(`${result.markdown}`)
    } else {
        ctx.reply('😡 Usage:\n\n/aqi city_name');
    }
});

// [+] DOGGO IMAGE [+] 
bot.command("doggo", async (ctx) => {

    // Allowed extensions 
    const images = ["png", "jpg", "jpeg"];
    const video = ["mp4", "gif"];

    let doggoUrl = await getDoggo();
    // Split the URL content 
    // and just get the extention of the image.
    let extension = doggoUrl.split(".")[2];

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

// [+] DICTIONARY [+] 
bot.command("whatis", async (ctx) => {
    // Split the context and just get the word typed in.
    const word = ctx.message.text.split(" ")[1];
    const result = await whatIs(word);
    ctx.replyWithMarkdown(`${result.markdown}`)
});

// [+] URBAN-DICTIONARY [+] 
bot.command('urban', async (ctx) => {
    // Split the context and just get the query typed in.
    const query = ctx.message.text.split(" ")[1];
    const result = await ud(query);
    ctx.replyWithMarkdown(`${result.markdown}`);
})

// [+] CUSTOM IMAGE SEARCH [+]
bot.command('get', async (ctx) => {
    // Split the context and just get the query typed in.
    const search = ctx.message.text.split(' ');
    search.shift();
    const result = await googleImage(search);
    
    // Check for 'success' status in result and 
    // send reply accordingly
    const resp = result.status === 'success' ? ctx.replyWithPhoto(result.response) : ctx.reply(result.response);
})

// [+] HELP [+] 
bot.command("help", (ctx) => {
    ctx.reply(`
        /help - this command\n/weather - gets you the weather\n/aqi - air quality index\n/doggo - get random dogs\n/whatis - returns definition\n/urban- urban dictionary definition\n/get- google for an image 
    `);
});

// [+] startChomtu Function [+] 
const startChomtu = () => {
    const date = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
    bot.launch()
    console.log(`Bot ready \n${date} (IST)`);
}

module.exports = startChomtu;