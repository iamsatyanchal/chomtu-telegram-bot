const axios = require("axios");

// Functions
function aqi_color(value) {
    if (value <= 50) return `🟢\t Good`;
    else if (value <= 100) return `🟡\t Moderate`;
    else if (value <= 150) return `🟠\t Unhealthy for sensitive Groups`;
    else if (value <= 200) return `🔴\t Unhealthy`;
    else if (value <= 300) return `🟣\t Very Unhealthy`;
    else return `☠️\t Hazardous`;
}

const getAQI = (city) => {
	const URL = `https://api.waqi.info/feed/${city}/?token=${process.env.AQI_KEY}`;

	return axios
		.get(URL)
		.then((result) => {
			if (result.data.status === "ok") {
				const description = aqi_color(result.data.data.aqi);
				return {
					status: 'success',
					markdown: `
                    *${description}*\n\nCity:\t *${city}*\nAir Quality Index:\t *${result.data.data.aqi}*\nPrimary Pollutant:\t *${result.data.data.dominentpol}*\nLocation: *${result.data.data.city.name}*
                    `
				};
			} else {
				return {status: 'fail', markdown: '*[404] City not found*'};
			}
		})
		.catch((err) => {
			return {status: 'fail', markdown: 'Request failed.'}
		});
};


module.exports = getAQI;