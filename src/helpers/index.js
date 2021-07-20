import cheerio from 'cheerio';
import axios from 'axios';
import { MAPBOX_KEY } from '../config';

const iterateHTML = (result, attr) => {
  const arr = [];
  result(attr).each((i, element) => {
    arr.push(result(element).text());
  });
  return arr;
};

const fetchHTML = async (url) => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};

const iterateLINKS = (result, element, attrName = 'href') => {
  const arr = [];
  result(element).each((i, elementName) => {
    arr.push(result(elementName).attr(attrName));
  });
  return arr;
};

const getCityCords = (cityName) => (
  axios
    .get(
      `http://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${MAPBOX_KEY}`,
    )
    .then((result) => {
      const cords = result.data.features[0].center.reverse();
      const newCord = [...cords.map((cord) => cord.toFixed(3).slice(0, -1))];
      return newCord.join();
    })
    .catch((err) => console.log(err.message))
);

export { iterateHTML, fetchHTML, iterateLINKS, getCityCords  };
