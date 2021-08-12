import { fetchHTML, iterateHTML, getCityCords } from '../../helpers';

const getAQIRemark = (aqi) => {
  let remark;

  if (aqi < 50) {
    remark = 'Good';
  } else if (aqi > 50 && aqi <= 100) {
    remark = 'satisfactory';
  } else if (aqi > 100 && aqi < 200) {
    remark = 'moderate';
  } else {
    remark = 'poor';
  }

  return remark;
};

const getWeather = async (cityName) => {
  try {
    const cityCords = await getCityCords(cityName);
    const baseURL = `https://weather.com/en-IN/weather/today/${cityCords}?&temp=c`;

    const scrapeData = fetchHTML(baseURL);

    return scrapeData
      .then((result) => {
        // Grab city, temp, aqi, weather from them HTML
        const city = result('.CurrentConditions--location--kyTeL').text();
        // Temperature
        const temp = result('span[data-testid=TemperatureValue]')
          .text()
          .split('°')[0];
        // Air Quality
        const aqi = result('text[data-testid="DonutChartValue"]').text();
        // Current Weather
        const currentWeather = result(
          '.CurrentConditions--phraseValue--2Z18W'
        ).text();
        // Last updated
        const lastUpdated = result('.CurrentConditions--timestamp--23dfw')
          .text()
          .split('As of')
          .join('');
        // Other details labels
        const detailsLabels = iterateHTML(
          result,
          '.WeatherDetailsListItem--label--3PkXl'
        );
        // console.log(detailsLabels);
        // Other details values
        const detailsValues = iterateHTML(
          result,
          '.WeatherDetailsListItem--wxData--2s6HT'
        );
        // console.log(detailsValues);

        // Combine detailsLabels and detailsValues to form an object
        const details = Object.assign(
          ...detailsLabels.map((key, i) => ({
            [key]: detailsValues[i],
          }))
        );
        return {
          success: true,
          url: baseURL,
          markdown:
            `<b>${city}</b>\n\n` +
            `🌥 <b>Weather:</b> ${currentWeather}\n` +
            `🌡 <b>Temperature:</b> ${temp}°\n\n` +
            `🌬 <b>Wind:</b> ${details.Wind.split('Wind Direction').join(
              ' '
            )}\n` +
            `💧 <b>Humidity:</b> ${details.Humidity}\n` +
            `👁 <b>Visibility:</b> ${details.Visibility}\n\n` +
            `<b>UV Index:</b> ${details['UV Index']}\n` +
            `<b>Air Quality:</b> ${aqi} (${getAQIRemark(aqi)})\n\n` +
            ` <b>Last Update:</b> ${lastUpdated}`,
        };
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        // console.log(err.message);
        return {
          success: false,
          message: 'City not found',
        };
      });
  } catch (err) {
    console.log(err.message);
    return {
      success: false,
      message: 'Network error',
    };
  }
};

module.exports = {
  name: 'weather',
  description: 'Check weather of a city',
  args: true,
  usage: '<city-name>',
  chatAction: 'typing',
  async execute(ctx, cityName) {
    try {
      const result = await getWeather(cityName.join('%20'));
      if (!result.success) {
        return ctx.reply(result.message);
      }

      await ctx.telegram.sendMessage(ctx.chat.id, result.markdown, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{ text: 'Open on weather.com', url: result.url }]],
        },
      });
    } catch (err) {
      console.log(err);
      ctx.reply(err.message);
    }
  },
};
