// Import "telegraf" library
const { Telegraf } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const fs = require('fs');
// Start Command
bot.start((ctx) => ctx.reply("Hello World!"));

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let collection = {};
function commandCollection(name, command) {
	collection[name] = command;
	return commandCollection;
}

for (const file of commandFiles) {
	command = require(`./commands/${file}`);
	// console.log(command.name);
	commandCollection(command.name, command);
}
console.log(collection);
// console.log(commands);
// console.log('Commands Names:', commandNames);


bot.on("message", (ctx) => {
	if (!ctx.message.text.startsWith('/')) return;
	const command = collection[ctx.message.text.split('/')[1]];
	try {
		command.execute(ctx, args=null);
	} catch {

	}
});

// Function to start the bot
function startBot() {
	console.log("Bot is running...");
	bot.launch();
}

// run startBot function
startBot();
