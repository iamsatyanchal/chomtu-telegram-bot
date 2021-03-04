const axios = require("axios");
const cheerio = require('cheerio');
require("dotenv").config();

// fetch html of a page
const fetchHTML = async (url) => {  
    const { data } = await axios.get(url);
    return cheerio.load(data);
}

// [+] Scrape Weather.com [+]
const scrapeWeather = async (cityName) => {
    try {
        const cityCords = await getCityCords(cityName.join('%20'));
        const baseURL = `https://weather.com/en-IN/weather/today/${cityCords}?par=google&temp=c`;

        // Fetch HTML
        const data = fetchHTML(baseURL);

        return data.then(result => {
            // Grab city, temp, aqi, weather from them HTML
            const city = result('.CurrentConditions--location--1Ayv3').text();
            const temp = result('.TodayDetailsCard--feelsLikeTempValue--2aogo').text();
            const aqi = result('text[data-testid="DonutChartValue"]').text();
            const currentWeather = result('.CurrentConditions--phraseValue--2xXSr').text();
            // city, temp, currentWeather, aqi
            return { 
                status: 'success',
                url: baseURL, 
                markdown: `*${city}*\n\n` + 
                            `🌡 *Temperature:* ${temp}\n` +  
                            `🌥 *Weather:* ${currentWeather}\n` + 
                            `🌬 *Air Quality:* ${aqi}\n`
            };

        }).catch(err => { 
            return {
                status: 'fail', 
                message: 'City not found'
            }
        }); 
    } catch (e) {
        return {
            status: 'fail',
            message: 'Network Error'
        }
    }
}

const getCityCords = (cityName) => {
    return axios.get(`http://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${process.env.MAPBOX_KEY}`).then(result => {
        const cords = result.data.features[0].geometry.coordinates.reverse();
        const newCord = [...cords.map(cord => cord.toFixed(2))];
        // console.log(newCord.join())
        return newCord.join();
    }).catch(err => console.log('Network error'));
}

module.exports = scrapeWeather;
