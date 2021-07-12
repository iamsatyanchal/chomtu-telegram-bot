import axios from 'axios';
import { fetchHTML, iterateHTML } from '../helpers';

const lyreka = async (songName) => {
  const baseURL = `https://www.lyreka.com/song/${songName.join('-')}-lyrics`;
  const html = fetchHTML(baseURL);

  return html
    .then((result) => {
      // Get Song name
      const song = result('.lyrics-container > h2 > q').text();

      // Get Artist Name
      const artist = iterateHTML(
        result,
        'div.col-8 > h1 > b > a.artist-name',
      ).join(', ');

      // Get the Lyrics Div.
      const lyrics = result('div.lyrics').text().trim();

      // Grab the cover pic of that song.
      const coverURL = result('img.img-track-cover').attr('src');
      return {
        status: 'success',
        song,
        artist,
        lyrics,
        cover: coverURL,
        url: baseURL,
      };
    })
    .catch((err) => {
      // console.log(err);
      // eslint-disable-next-line no-console
      console.log(err.message);
      return {
        status: 'fail',
        message: '🥴 Song not found',
      };
    });
};

// [+] From Saavn [+]
const getSongDetails = (song) => {
  const data = axios.get(`https://saavn.me/search?song=${song}`);

  return data
    .then((res) => {
      const songInfo = res.data[0];

      if (!res.data[0] > 0) {
        return { status: 'fail', message: 'No song found' };
      }

      return {
        status: 'success',
        songId: songInfo.song_id,
        songName: songInfo.song_name,
        albumName: songInfo.album_name,
        year: songInfo.year,
        hasLyrics: songInfo.song_has_lyrics,
      };
    })
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err.message));
};

const saavn = async (song) => {
  const songDetails = await getSongDetails(song);
  // eslint-disable-next-line no-console

  if (songDetails.status === 'fail') {
    return { markdown: songDetails.message };
  }

  if (!songDetails.hasLyrics) {
    return { markdown: 'Lyrics are not available for this song 😔' };
  }

  const data = axios.get(
    `https://www.jiosaavn.com/api.php?__call=lyrics.getLyrics&ctx=web6dot0&_format=json&_marker=0?_marker=0&lyrics_id=${songDetails.songId}`
  );
  return data
    .then((res) => (
      {
        markdown:
          `🎶 *${songDetails.songName}*\n`
          + `Album: *${songDetails.albumName}*\n`
          + `Year: *${songDetails.year}*\n\n`
          + `${res.data.lyrics.replace(/<br\s*\/?>/gm, '\n')}`,
      }
    ))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err.message);
      return { markdown: 'Error occured' };
    });
};

export default {
  lyreka,
  saavn,
};
