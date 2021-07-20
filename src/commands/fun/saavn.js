import getLyrics from '../../services/getLyrics';

module.exports = {
  name: 'saavn',
  description: 'Get lyrics of bollywood songs',
  args: true,
  usage: '<song-name>',
  chatAction: 'typing',
  async execute(ctx, songName) {
    const lyrics = await getLyrics.saavn(songName.join('+'));
    ctx.replyWithMarkdown(lyrics.markdown);
  },
};
