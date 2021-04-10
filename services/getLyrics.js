// Lyreka: https://www.lyreka.com 

const axios = require("axios");
const fetchHTML = require('./fetchHTML.js');

const getLyrics = async (songName) => {
	// console.log("SongName:", songName);
	const baseURL = `https://www.lyreka.com/song/${songName.join("-")}-lyrics`;
	// const baseURL = `https://www.lyreka.com/song/${songName.join("-")}-lyrics`;
	const html = fetchHTML(baseURL);

	return html.then((result) => {
		// console.log(result.text().trim());

		// Get Song name
		const song = result('h1').text().split('Lyrics')[0].trim();
		// console.log('SONG:', song.split("Lyrics")[0].trim());
		// Get Artist Name
		const artist = result("b .artist-name").text();
		// Get the Lyrics Div.
		const lyrics = result(".lyrics").text();
		// Grab the cover pic (128w) of that song.
		const cover = result(".track-cover-container img").attr("data-srcset");
		const coverArray = cover.split(" "); // Convert the datasrc's to an array
		return {
			status: 'success',
			songName: song,
			artist,
			lyrics,
			cover: coverArray[4],
			url: baseURL
		}

	}).catch((err) => {
		// console.log(err);
		console.log(err.message)
		return {
			status: 'fail',
			message: '🥴 Song not found'
		}
	});
};


// [+] From Saavn [+]
const getSongDetails = (song) => {
	const data  = axios.get(`https://saavn.me/search?song=${song}`);

	return data.then(res => {
		const songInfo = res.data[0];
		// console.log(songInfo);

		if (!res.data[0] > 0) {
			return {status: 'fail', message: 'No song found'};
		}

		return {
			status: 'success',
			songId: songInfo.song_id,
			songName: songInfo.song_name,
			albumName: songInfo.album_name,
			year: songInfo.year,
			hasLyrics: songInfo.song_has_lyrics
		}
	}).catch (err => console.log(err.message));
}

const saavnLyrics = async (song) => {
	const songDetails = await getSongDetails(song);
	console.log(songDetails.status)

	if (songDetails.status === 'fail') {
		return { markdown: songDetails.message }	
	}

	if (!songDetails.hasLyrics) {
		return { markdown: 'Lyrics are not available for this song 😔' };
	}

	const data = axios.get(`https://www.jiosaavn.com/api.php?__call=lyrics.getLyrics&ctx=web6dot0&_format=json&_marker=0?_marker=0&lyrics_id=${songDetails.songId}`);
	return data.then(res => {
		// console.log(res.data.lyrics)
		// console.log('Sending Song Lyrics')
		return {
			markdown: 	`*${songDetails.songName}*\n` +
						`Album: *${songDetails.albumName}*\n` + 
						`Year: *${songDetails.year}*\n\n` +
						`${res.data.lyrics.replace(/<br\s*\/?>/mg,"\n")}`
		}
	}).catch(err => {
		console.log(err.message);
		return { markdown: 'Error occured' };
	});

}

module.exports =  {
	getLyrics,
	saavnLyrics
}
