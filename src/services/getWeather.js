import axios from 'axios';
import { fetchHTML } from '../helpers';
import { MAPBOX_KEY } from '../../config';
import { iterateHTML } from '../helpers';

const getAQIRemark = (aqi) => {
    let remark;

    if (aqi < 50) {remark = 'Good'}
    else if (aqi >50 && aqi <= 100) {remark = 'satisfactory'}
    else if (aqi > 100 && aqi < 200) {remark = 'moderate'}
    else {remark = 'poor'};

    return remark;
}   

// const iterateHTML = (result, attr) => {
//     const arr = [];
//     result(attr).each((i, element) => {
//         arr.push(result(element).text());
//     })
//     return arr;
// }

const getCityCords = (cityName) => {
    return axios.get(`http://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${MAPBOX_KEY}`).then(result => {
        const cords = result.data.features[0].center.reverse();
        const newCord = [...cords.map(cord => cord.toFixed(3).slice(0, -1))];
        return newCord.join();
    }).catch(err => console.log('Network error'));
}

// [+] Scrape Weather.com [+]
const scrapeWeather = async (cityName) => {
    try {
        const cityCords = await getCityCords(cityName.join('%20'));
        const baseURL = `https://weather.com/en-IN/weather/today/${cityCords}?&temp=c`;

        // Fetch HTML
        const data = fetchHTML(baseURL);

        return data.then(result => {
            // Grab city, temp, aqi, weather from them HTML
            const city = result('.CurrentConditions--location--1YWj_').text();
            const temp = result('span[data-testid=TemperatureValue]').text().split('°')[0];
            const aqi = result('text[data-testid="DonutChartValue"]').text();
            const currentWeather = result('.CurrentConditions--phraseValue--mZC_p').text();
            const lastUpdated = result('.CurrentConditions--timestamp--1ybTk').text().split('As of').join('');
            const detailsLabels = iterateHTML(result, '.WeatherDetailsListItem--label--2ZacS');
            // console.log(detailsLabels);
            const detailsValues = iterateHTML(result, '.WeatherDetailsListItem--wxData--kK35q');
            // console.log(detailsValues);

            // Combine detailsLabels and detailsValues to form an object
            const details = Object.assign(...detailsLabels.map((key, i) => ({[key]: detailsValues[i]})));
            return { 
                status: 'success',
                url: baseURL, 
                markdown: `<b>${city}</b>\n\n` + 
                            `🌡 <b>Temperature:</b> ${temp}°\n` +  
                            `🌥 <b>Weather:</b> ${currentWeather}\n\n` + 
                            `🌬 <b>Wind:</b> ${details['Wind'].split('Wind Direction').join(" ")}\n` + 
                            `💧 <b>Humidity:</b> ${details['Humidity']}\n` + 
                            `👁 <b>Visibility:</b> ${details['Visibility']}\n\n` + 
                            `<b>UV Index:</b> ${details['UV Index']}\n` + 
                            `<b>Air Quality:</b> ${aqi} (${getAQIRemark(aqi)})\n\n` + 
                            `<b>Last Update:</b> ${lastUpdated}`
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

export default scrapeWeather;
