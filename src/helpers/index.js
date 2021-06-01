import { axiosInstance } from '../../config/axiosConfig';
import cheerio from 'cheerio';

const iterateHTML = (result, attr) => {
    const arr = [];
    result(attr).each((i, element) => {
        arr.push(result(element).text());
    })
    return arr;
}

const fetchHTML = async (url) => {
    const { data } = await axiosInstance.get(url);
    return cheerio.load(data);
};

export {
    iterateHTML,
    fetchHTML
}