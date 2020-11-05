const { Telegraf } = require('telegraf')
const axios = require('axios')
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_API)

console.log('Bot ready')

//  Weather Command
bot.command('weather', ctx => {
	const split = ctx.message.text.split(" ");
	const city = split[1];

	axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_API}&q=${city}`)
	.then(res => {
		const data = res.data
		const temp = Math.ceil(data.main.feels_like - 273.15)
		const icon = data.weather[0].icon
    const icon_url = `http://openweathermap.org/img/wn/${icon}@4x.png`
		ctx.replyWithMarkdown(
			`
			*🌞 ${data.name}'s Weather Forecast*\n\n*City:* ${data.name} (${data.sys.country})\n*Weather:* ${data.weather[0].main}\n\n*🌡  Temperature:\t* ${temp}°C  \n*🎏  Pressure:* ${data.main.pressure}hpa \n*💧  Humidity:* ${data.main.humidity}%  \n\n[Icon](${icon_url})
			`
		)
	})
	.catch(err => {
		if(err.response.data.cod == 404) {
			ctx.replyWithMarkdown('*[404]* City not found')
		} else {
			ctx.reply ('OOP! Request error')
		}
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

bot.launch()
