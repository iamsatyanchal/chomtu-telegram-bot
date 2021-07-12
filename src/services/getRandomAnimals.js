import axios from 'axios';

const getDoggo = () => (
  // Grab a new doggo-URL and return it
  axios
    .get('https://random.dog/woof.json')
    .then((result) => result.data.url)
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err))
);

const getCat = () => (
  axios
    .get('https://aws.random.cat/meow')
    .then((result) => result.data.file)
    .catch((err) => err)
);

export default {
  getDoggo,
  getCat,
};
