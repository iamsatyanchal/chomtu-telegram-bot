const { Telegraf } = require('telegraf')
const axios = require('axios')
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_API)
console.log(`Bot ready ${Date.now()}`)


// Functions
function aqi_color(value) {
    if (value <= 50) return `🟢\t Good`
    else if (value <= 100) return `🟡\t Moderate`
    else if (value <= 150) return `🟠\t Unhealthy for sensitive Groups`
    else if (value <= 200) return `🔴\t Unhealthy`
    else if (value <= 300) return `🟣\t Very Unhealthy`
    else return `☠️\t Hazardous`
}


bot.command('start', ctx => {
	ctx.replyWithMarkdown(`
		*What's poppin, bitch?*\n\nType /help to see all the avaibale commands
	`)
})

//  Weather Command
bot.command('weather', ctx => {
    const split = ctx.message.text.split(" ");
    const city = split[1];
    axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_API}&q=${city}`)
        .then(res => {
            const data = res.data
            // const temp = Math.ceil(data.main.feels_like - 273.15)
            const temp = (data.main.feels_like-273.15).toFixed(2)
            const icon = data.weather[0].icon
            const icon_url = `http://openweathermap.org/img/wn/${icon}@4x.png`
            ctx.replyWithMarkdown(
                `
			*🌞 ${data.name}'s Weather Forecast*\n\n*City:* ${data.name} (${data.sys.country})\n*Weather:* ${data.weather[0].main}\n\n*🌡  Temperature:\t* ${temp}°C  \n*🎏  Pressure:* ${data.main.pressure}hpa \n*💧  Humidity:* ${data.main.humidity}%  \n\n[Icon](${icon_url})
			`
            )
        })
        .catch(err => {
            if (err.response.data.cod == 404) {
                ctx.replyWithMarkdown('*[404]* City not found')
            } else {
                console.log(err)
            }
        })
})

bot.command('/aqi', ctx => {
    let city = ctx.message.text.split(" ");
    city.shift();
    const URL = `https://api.waqi.info/feed/${city}/?token=${process.env.AQI_KEY}`
    axios.get(URL)
        .then(result => {
            if (result.data.status === 'ok') {
                // ctx.replyWithMarkdown(result.data.data.aqi)
                const description = aqi_color(result.data.data.aqi)
                ctx.replyWithMarkdown(
	                `
					*${description}*\n\nCity:\t *${city}*\nTemperature: *${result.data.data.iaqi.t.v}°C*\nAir Quality Index:\t *${result.data.data.aqi}*\nPrimary Pollutant:\t *${result.data.data.dominentpol}*\nLocation: *${result.data.data.city.name}*
					`
                )
            } else {
            	ctx.replyWithMarkdown(`*[404] City not found*`)
            }
        })
        .catch(err => {
            console.log(err)
        })

})

bot.command('doggo', ctx => {
    const images = ['png', 'jpg', 'jpeg']
    const video = ['mp4', 'gif']
    axios.get("https://random.dog/woof.json")
        .then(result => {
            const url = result.data.url;
            const extension = url.split('.')[2]

            switch (extension) {
                case "png":
                case "jpg":
                case "jpeg":
                    ctx.replyWithPhoto(url)
                    break;
                default:
                    ctx.replyWithVideo(url)
            }
        })
        .catch(err => console.log(err))
})

bot.command('catto', ctx => {
    const images = ['png', 'jpg', 'jpeg']
    const video = ['mp4', 'gif']
    axios.get("https://api.thecatapi.com/v1/images/search")
        .then(result => {
            const url = result.data[0].url;
            const extension = url.split('.')[2]

            switch (extension) {
                case "png":
                case "jpg":
                case "jpeg":
                    ctx.replyWithPhoto(url)
                    break;
                default:
                    ctx.replyWithVideo(url)
            }
        })
        .catch(err => console.log(err))
})


bot.command('help', ctx => {
	ctx.reply(`
		/help - this command\n/weather - gets you the weather\n/aqi - air quality index\n/doggo - get random dogs\n/catto - get random cats
	`)
})


bot.launch()