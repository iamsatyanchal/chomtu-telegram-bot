module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(ctx, args) {
		ctx.reply('Pong.');
	}
}