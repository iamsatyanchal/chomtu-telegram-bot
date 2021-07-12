import cheerio from 'cheerio';
import { axiosInstance } from '../../config/axiosConfig';

const iterateHTML = (result, attr) => {
  const arr = [];
  result(attr).each((i, element) => {
    arr.push(result(element).text());
  });
  return arr;
};

const fetchHTML = async (url) => {
  const { data } = await axiosInstance.get(url);
  return cheerio.load(data);
};

// [+] Fetch results from DDG [+]
const iterateLINKS = (result, element, attrName = 'href') => {
  const arr = [];
  result(element).each((i, elementName) => {
    arr.push(result(elementName).attr(attrName));
  });
  return arr;
};

export { iterateHTML, fetchHTML, iterateLINKS };
