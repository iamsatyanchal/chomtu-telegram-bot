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

// [+] Fetch results from DDG [+]
const iterateDDG = (result, attr) => {
    const arr = [];
    result(attr).each((i, element) => {
        const obj = {};
        
        let key = result(element).text();
        let value = result(element).attr('href');
        
        obj[key] = value;
        arr.push(obj);
    })
    return arr;
}

export {
    iterateHTML,
    fetchHTML,
    iterateDDG
}