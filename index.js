// Import "telegraf" library
const { Telegraf } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.BRAD_API);
const fs = require('fs');
// Start Command
bot.start((ctx) => ctx.reply("Hello World!"));

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const collection = new Map();

for (const file of commandFiles) {
	command = require(`./commands/${file}`);
	// console.log("Command:", command);
	collection.set(command.name, command);
}
console.log(collection);

bot.on("message", (ctx) => {

	if (!ctx.message.text.startsWith('/')) return;
	
	let [commandName, ...args] = ctx.message.text.split(' ');

	const command = collection.get(commandName.slice(1));

	try {
		command.execute(ctx, args=args);
	} catch(err) {
		console.log(err);
	}
});

// Function to start the bot
function startBot() {
	console.log("Bot is running...");
	bot.launch();
}

// run startBot function
startBot();
