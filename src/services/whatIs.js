import axios from 'axios';

const formatData = (arr, word, prononce) => {
    let markdown = `📖 *Dictionary*\n\nWord: *${word}*\n${prononce}\n\n`;

    arr.forEach(obj => {
       markdown += `*[${obj['partOfSpeech']}]*\n*Definition*: ${obj['definition']}\n\n` + 
                    `*Snonyms*: ${obj['synonyms'] || '---'}\n*Examples*: ${obj['example'] || '---'}\n\n` 
    });

    return markdown;
}

const whatIs = (word) => {
    const dictionaryData = axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`);

    return dictionaryData.then(({ data: response }) => {
        const data = response[0];
        const meanings = data['meanings'];

        // Grab the audio link
        const audio = data['phonetics'][0]['audio'] || null; 
        const prononce = data['phonetics'][0]['text']; 

        // Grab the definitions
        const definitions = [];
        for(let x = 0; x < meanings.length; x++) {
            const obj = {};

            // Extract desired elements from the response
            const partOfSpeech = meanings[x]['partOfSpeech'];
            const definition = meanings[x]['definitions'][0]['definition'];
            const synonyms = meanings[x]['definitions'][0]['synonyms'];
            const example = meanings[x]['definitions'][0]['example'];

            // Fill the object
            obj['partOfSpeech'] = partOfSpeech;
            obj['definition'] = definition;
            obj['synonyms'] = synonyms && synonyms.join(', ');
            obj['example'] = example;

            // Push the object to the array
            definitions.push(obj);
        };

        return { audio: audio, markdown: formatData(definitions, word, prononce) };
    }).catch(err => {
        console.log(err.message);

        return { markdown: 'No word found' };
    })

};


export default whatIs;
