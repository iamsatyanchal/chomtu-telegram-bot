const axios = require("axios");
require("dotenv").config();

const getWeather = (city) => {
    // Get weather data of that city and return it.
    return axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_API}&q=${city}`
        )
        .then((res) => {
            const data = res.data;
            // Kelvin to Celsius conversion.
            const temp = (data.main.feels_like - 273.15).toFixed(2);
            const icon = data.weather[0].icon;
            // Get appropriate Icon URL.
            const icon_url = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            return {
                status: "success",
                markdown: `
            *🌞 ${data.name}'s Weather Forecast*\n\n*City:* ${data.name} (${data.sys.country})\n*Weather:* ${data.weather[0].main}\n\n*🌡  Temperature:\t* ${temp}°C  \n*🎏  Pressure:* ${data.main.pressure}hpa \n*💧  Humidity:* ${data.main.humidity}%  \n\n[Icon](${icon_url})
            `,
            };
        })
        .catch((err) => {
            if (err.response.data.cod == 404) {
                return { status: "fail", markdown: "*[404]* City not found" };
            } else {
                console.log(err);
            }
        });
};

module.exports = getWeather;
