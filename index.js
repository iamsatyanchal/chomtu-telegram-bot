const { Telegraf } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.BRAD_API);
const fs = require('fs');

// Start Command
bot.start((ctx) => ctx.reply("Hello World!"));

// Grab all command folder in ./commands
const commandFolders = fs.readdirSync('./commands');

const collection = new Map();

// Get all the commands and put them in collection map
for (const folder of commandFolders) {
	// Get files from each command folder
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		collection.set(command.name, command);
	}
}
console.log(collection);

bot.on("message", (ctx) => {

	if (!ctx.message.text.startsWith('/')) return;
	
	let [commandName, ...args] = ctx.message.text.split(' ');

	const command = collection.get(commandName.slice(1));

	if (command.args && !args.length) {
		console.log(ctx.message.message_id, ctx.message.chat.id);
		let reply = `You didn't provide any arguments.\n\nUsage: /${command.name} ${command.usage}>`
		return ctx.reply(reply, { reply_to_message_id: ctx.message.message_id });
	}

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
