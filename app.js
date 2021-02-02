const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();
const bot = new Telegraf(process.env.BRAD_API);

// Import services
const getDoggo = require("./services/getDoggo.js");
const getWeather = require('./services/getWeather.js');
const getAQI = require('./services/getAQI.js');
const whatIs = require('./services/whatIs.js');
const ud = require('./services/urban.js');
const googleImage = require('./services/googleImage.js');
const getCat = require('./services/getCat.js');
const covid = require('./services/covid.js');

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
    const city = ctx.message.text.split(' ');
    city.shift();

    // Check if country name is given.
    if (!city.length > 0) {
        // if no country then send usage.
        return ctx.reply('Usage: /aqi city_name')
    } 

    const result = await getAQI(city.join('-'))
    ctx.replyWithMarkdown(`${result.markdown}`)
});

// [+] DOGGO IMAGE [+] 
bot.command("doggo", async (ctx) => {

    // Allowed extensions 
    const images = ["png", "jpg", "jpeg"];
    const video = ["mp4", "gif"];

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
bot.command('cat', async (ctx) => {
    const catLink = await getCat();
    
    // If the links a gif, use video method
    if(catLink.includes('gif')) {
        return ctx.replyWithVideo(catLink)
    }
    // reply with a photo
    ctx.replyWithPhoto(catLink);
})

// [+] DICTIONARY [+] 
bot.command("whatis", async (ctx) => {
    // Split the context and just get the word typed in.
    const word = ctx.message.text.split(" ")[1];
    if (!word) {
        return ctx.reply('Usage: /whatis <query>')
    }
    // call whatIs service and get the result.
    const result = await whatIs(word);
    
    // If no word found, send error
    if (result.status === 'fail') {
        return ctx.reply(result.markdown);
    }

    // If everything goess well then send markdown and audio, if any.
    ctx.replyWithMarkdown(
        `📕 Oxford Dictionary\n\n` +
       `*Word*:\t ${result.word}\n\n` + 
       `*Definition*:\t ${result.definition}\n\n` + 
       `*Short-Definition*:\t ${result.shortDefinitions}`
    )
    // If audio is present then send audio.
    if (!result.audio) {
        return null;
    } else {
        await ctx.replyWithAudio(result.audioLink);
    }
     
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

// [+] COVID INFO [+]
bot.command('covid', async (ctx) => {
    const country = ctx.message.text.split(' ');
    country.shift();

    // Check if country name is given.
    if (!country.length > 0) {
        // if no country then send usage.
        return ctx.reply('Usage: /covid country_name')
    } 
    const result = await covid(country.join("-"));
    return ctx.replyWithMarkdown(result.markdown);
})

// [+] HELP [+] 
bot.command("help", (ctx) => {
    ctx.reply(
        `/help - this command\n` +
        `/weather - gets you the weather\n` + 
        `/aqi - air quality index\n` + 
        `/doggo - get random dogs\n` + 
        `/cat- random cat\n` +
        `/whatis - definition from dictionary\n` +
        `/urban- urban dictionary definition\n` + 
        `/get- google for an image\n` +
        `/covid- get covid data`
    );
});

// [+] startChomtu Function [+] 
const startChomtu = () => {
    const date = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
    bot.launch()
    console.log(`Bot ready \n${date} (IST)`);
}

module.exports = startChomtu;
