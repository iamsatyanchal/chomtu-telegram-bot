import { fetchHTML, iterateDDG } from '../helpers'

function toEscapeMSg(str) {
    return str
        .replace(/_/gi, "\\_")
        // .replace(/-/gi, "\\-")
        // .replace("~", "\\~")
        // .replace(/`/gi, "\\`")
        // .replace(/\./g, "\\.")
        // .replace(/\</g, "\\<")
        // .replace(/\>/g, "\\>");
}

export default function(query) {
    const searchResult = fetchHTML(`https://html.duckduckgo.com/html?q=${query}`);
    
    return searchResult.then(result => {

        let message = '🔍 Search results from DuckDuckGo\n\n';
        const searches = iterateDDG(result, '.result__a');

        for (let x = 0; x < 10; x++) {
            for (let [key, value] of Object.entries(searches[x])){
                message += `${key}:\n${value}\n\n`;
            }
        }

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