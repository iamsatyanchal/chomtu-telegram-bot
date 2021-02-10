// Thanks to Lyreka: https://www.lyreka.com 

const axios = require("axios");
const cheerio = require("cheerio");

const fetchHTML = async (url) => {
	const { data } = await axios.get(url);
	return cheerio.load(data);
};

const getLyrics = async (songName) => {
	// console.log("SongName:", songName);
	const baseURL = `https://www.lyreka.com/song/${songName.join("-")}-lyrics`;
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
			cover: coverArray[2]
		}

	}).catch((err) => {
		// console.log(err);
		return {
			status: 'fail',
			message: '🥴 Song not found'
		}
	});
};

module.exports = getLyrics;
