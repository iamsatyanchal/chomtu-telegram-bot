module.exports = {
	name: 'help',
	description: 'help!',
	args: false,
	usage: '<command-name>',
	chatAction: 'typing',
	execute(ctx, args, commands) {
		if (args && commands.has(args[0])) {
			const command = commands.get(args[0]);
			return ctx.replyWithMarkdown(
				`*Command name:*\n${command.name}\n\n`
				+ `*Description:*\n${command.description}\n\n`
				+ `*Requires Arguments:*\n${command.args}\n\n`
				+ `*Usage:*\n\/${command.name} ${command.usage}\n\n`
			, { reply_to_message_id : ctx.message.message_id })
		} else if(!args.length) {
			let command = 'Type /help <command_name> for more\n\n';
			for (let [value, index] of commands) {
				command += `/${value}\n`
			}
			ctx.reply(command)
		} else {
			ctx.reply('No command found')
		}
	}
}