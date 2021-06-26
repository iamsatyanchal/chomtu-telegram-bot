import { fetchHTML, iterateLINKS, iterateHTML } from '../helpers'

function toEscapeMSg(str) {
    return str
        // .replace(/_/gi, "\\_")
        // .replace(/-/gi, "\\-")
        // .replace("~", "\\~")
        // .replace(/`/gi, "\\`")
        // .replace(/\./g, "\\.")
        // .replace(/\</g, "\\<")
        // .replace(/\>/g, "\\>");
        // .replace(/\[/g, "\\[")
        // .replace(/\]/g, "\\]");
}

export default function(query) {
    const searchResult = fetchHTML(`https://html.duckduckgo.com/html?q=${query}`);
    
    return searchResult.then(result => {

        let message = '🔍 Search results from DuckDuckGo\n\n';

        let finalResult = [];

        let title = iterateHTML(result, '.result__body > .result__title');
        let links = iterateLINKS(result, '.result__body > .result__snippet')
        let descriptions = iterateHTML(result, '.result__body > .result__snippet');

        for(let x = 0; x < 5; x++) {
            let obj = {};
            obj['title'] = title[x].trim();
            obj['link'] = toEscapeMSg(links[x].trim());
            obj['description'] = descriptions[x].trim();

            finalResult.push(obj);
        }

        finalResult.forEach(obj => {
            message += `[${obj['title']}](${obj['link']})\n${obj['description']}\n\n`
        })

        return {
            status: 'success',
            markdown: toEscapeMSg(message)
        }
    }).catch(err => {
        console.log(err.message);
        return {
            status: 'fail',
            markdown: err.message
        }
    })
};