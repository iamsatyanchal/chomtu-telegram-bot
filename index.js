import express from 'express';
import { BRAD_API, BOT_API } from './src/config';
const { Telegraf } = require("telegraf");
const cron = require('node-cron');

const bot = new Telegraf(BOT_API);
const fs = require('fs');
const app = express();

// Grab all command folder in ./commands
const commandFolders = fs.readdirSync('./src/commands');

const collection = new Map();

// Get all the commands and put them in collection map
for (const folder of commandFolders) {
	// Get files from each command folder
	const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./src/commands/${folder}/${file}`);
		collection.set(command.name, command);
	}
}

bot.on("message", (ctx) => {

	if (!ctx.message.text||!ctx.message.text.startsWith('/')) return;
	
	const commandText = ctx.message.text.match(/\/[a-z]*/)[0];
	
	if (!collection.has(commandText.substr(1))) return;
	
	let [commandName, ...args] = ctx.message.text.split(' ');
	const command = collection.get(commandName.substr(1));
	if (!command) return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments.\n\nUsage: /${command.name} ${command.usage}`
		return ctx.reply(reply, { reply_to_message_id: ctx.message.message_id });
	}

	try {
		// Set chat action to 'typing' or 'sending a file'
		ctx.telegram.sendChatAction(ctx.chat.id, command.chatAction);
		if (command.name === 'help') return command.execute(ctx, args=args,  collection);
		command.execute(ctx, args=args);
	} catch(err) {
		console.log(err);
		ctx.reply(`Uhg, I ran into some errors, but don't worry it should be fixed soon`)
	}
});

app.get('/', (req, res) => res.send('bot online'))

// Function to start the bot
function startBot() {
	console.log("Bot is running...");
	bot.launch();
}

app.listen(3000, () => {
	startBot();
	cron.schedule('*/1 * * * *', () => {
		bot.stop();
		startBot();
	})	
});
