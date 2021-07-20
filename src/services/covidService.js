import axios from 'axios';
import { fetchHTML } from '../helpers'

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

const getCovidData = async (country) => {
  const baseURL = `https://www.worldometers.info/coronavirus/country/${country}`;
  // Call fetchHTML function and get the HTML of the page.
  const data = fetchHTML(baseURL);

  return data
    .then((result) => {
      // Grab the country name from returned HTML
      const countryName = result('.label-counter').text().split('/')[2].trim();
      // Get the FlagURL
      const flagURL = `https://www.worldometers.info${result('div > img').attr('src')}`;
      // Data [Array]: Cases / Deaths / Recovered
      // eslint-disable-next-line no-shadow
      const data = result('#maincounter-wrap > .maincounter-number')
        .text()
        .trim()
        .split('\n\n');
      // Updates: A sentence
      // const update = result(".news_li").text().split("[source]")[0].trim();
      const update = result('.news_li').text().split('in')[0].trim();
      // console.log(result('.label-counter').text().split('/')[2].trim())

      // Trying to dates
      const dateDiv = result('.content-inner').text().trim().split('\n')[2];
      const date = new Date(dateDiv).toLocaleString(undefined, {
        timeZone: 'Asia/Kolkata',
      });

      // Return the Data in JSON form
      return {
        status: true,
        data: {
          countryName,
          flag: flagURL,
          data,
          update,
          lastUpdated: date,
        },
      };
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err.message);
      return {
        satus: false,
        message: 'Country Not Found!',
      };
    });
};

const covid = async (country) => {
  const result = await getCovidData(country);
  if (result.status) {
    return {
      markdown:
        `🦠 *Covid:\t ${result.data.countryName}*\n\n`
        + `*Total Cases:*\t ${result.data.data[0]}\n`
        + `*Total Deaths:*\t ${result.data.data[1]}\n`
        + `*Total Recovered:*\t ${result.data.data[2]}\n\n`
        + `*Updates:*\n${result.data.update}\n\n`
        + `*Last updated:*\n${result.data.lastUpdated}\n\n`
        + `[Flag](${result.data.flag})`,
    };
  }

  return {
    markdown: `${result.message}`,
  };
};

// get Data for India
const covidIn = (query) => {
  const data = axios.get(
    'https://api.covid19india.org/state_district_wise.json',
  );
  const district = capitalizeFirstLetter(query);

  return data
    .then(async (res) => {
      // console.log(res.data['Andaman and Nicobar Islands']);
      // eslint-disable-next-line no-restricted-syntax, no-shadow, no-unused-vars
      for (const [state, data] of Object.entries(res.data)) {
        if (district in data.districtData) {
          // console.log(data.districtData[district]);
          return {
            status: 'success',
            markdown:
              `🦠 Covid: *${district}*`
              + `\n\n*Updates*\nConfirmed: ${data.districtData[district].delta.confirmed}\n`
              + `Deaths: ${data.districtData[district].delta.deceased}\n`
              + `Recovered: ${data.districtData[district].delta.recovered}\n\n`
              + `*Data*\nActive: ${data.districtData[district].active}\n`
              + `Total Cases: ${data.districtData[district].confirmed}\n`
              + `Recovered: ${data.districtData[district].recovered}\n`
              + `Deaths: ${data.districtData[district].deceased}\n`,
          };
        }
        // throw new Error('District not found')
      }
      return { status: 'fail', markdown: 'District not found' };
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return { status: 'fail', markdown: err.message };
    });
};

export default {
  covid,
  covidIn,
};
