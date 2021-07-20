import getLyrics from '../../services/getLyrics';

module.exports = {
  name: 'lyrics',
  description: 'Get lyrics of songs [English]',
  args: true,
  usage: '<song-name>',
  chatAction: 'typing',
  async execute(ctx, songName) {
    const resultObj = await getLyrics.lyreka(songName);

    if (resultObj.success) {
      try {
        await ctx.replyWithMarkdown(
          `*🎶 Song Name:* ${resultObj.song}\n` +
            `*Artist[s]:* ${resultObj.artist}\n\n` +
            `*Lyrics*:\n${resultObj.lyrics}\n` +
            `[Cover](${resultObj.cover})`
        );
      } catch {
        await ctx.replyWithMarkdown(
          `😳 Song is too long, read the lyrics [here](${resultObj.url})\n`
        );
      }
    } else {
      return ctx.replyWithMarkdown(`${resultObj.message}`);
    }
  },
};
