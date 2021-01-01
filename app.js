const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_API);

const getDoggo = require("./services/getDoggo.js");
const getWeather = require('./services/getWeather.js');
const getAQI = require('./services/getAQI.js');
const whatIs = require('./services/whatIs.js');
const ud = require('./services/urban.js');

// START command
bot.command("start", (ctx) => {
    ctx.replyWithMarkdown(`
        *Waddup?*\n\nType /help to see all the available commands
    `);
});

//  Weather Command
bot.command("weather", async (ctx) => {
    const city = ctx.message.text.split(" ")[1];
    const weatherReport = await getWeather(city);
    ctx.replyWithMarkdown(`${weatherReport.markdown}`)
});

// AQI Index
bot.command("/aqi", async (ctx) => {
    let city = ctx.message.text.split(" ");
    city.shift();

    const result = await getAQI(city)
    ctx.replyWithMarkdown(`${result.markdown}`)
});

// DOGGO image
bot.command("doggo", async (ctx) => {
    const images = ["png", "jpg", "jpeg"];
    const video = ["mp4", "gif"];

    const doggoUrl = await getDoggo();
    const extension = doggoUrl.split(".")[2];

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

// DICTIONARY
bot.command("whatis", async (ctx) => {
    const word = ctx.message.text.split(" ")[1];
    const result = await whatIs(word);
    ctx.replyWithMarkdown(`${result.markdown}`)
});

// URBAN-DICTIONARY
bot.command('urban', async (ctx) => {
    const query = ctx.message.text.split(" ")[1];
    const result = await ud(query);
    ctx.replyWithMarkdown(`${result.markdown}`);
})

// HELP Command
bot.command("help", (ctx) => {
    ctx.reply(`
        /help - this command\n/weather - gets you the weather\n/aqi - air quality index\n/doggo - get random dogs\n/whatis - returns definition\n/urban- urban dictionary definition 
    `);
});

// StartChomtu Function
const startChomtu = () => {
    const date = new Date()
    bot.launch()
    console.log(`Bot ready \n${date}`);
}

module.exports = startChomtu;