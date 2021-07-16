module.exports = {
	name: 'help',
	description: 'help!',
	args: true,
	usage: '<SOME_ARG',
	execute(ctx, args) {
		ctx.reply(`help.`);
	}
}