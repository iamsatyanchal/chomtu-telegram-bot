import axios from 'axios';

const getDoggo = () => {
  return axios
    .get('https://random.dog/woof.json')
    .then((result) => {
      return result.data.url;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCat = () => {
  return axios
    .get('https://aws.random.cat/meow')
    .then((result) => result.data.file)
    .catch((err) => err);
};

export default {
  getDoggo,
  getCat,
};
