const axios = require("axios");

// Make request
const searchWord = (word) => {
    // Full URL of the endpoint
    dict_link = `https://od-api.oxforddictionaries.com/api/v2/entries/en-us/${word}`;

    // Grab the data from the end,
    // put the data in appropriate property of your response object,
    // return the response object
    return axios
        .get(dict_link, {
            headers: {
                app_id: process.env.OXFORD_APP_ID,
                app_key: process.env.OXFORD_APP_KEY,
            },
        })
        .then((response) => {
            return {
                status: "success",
                word: word,
                definition: response.data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0],
                shortDefinitions: response.data.results[0].lexicalEntries[0].entries[0].senses[0].shortDefinitions[0],
            };
        })
        .catch((err) => {
            return { status: "fail", err: err };
        });
};

const whatIs = async (word) => {
    const result = await searchWord(word);

    if (result.status !== "success") {
        return { markdown: "no word found" };
    }
    return {
       markdown: `📕 Oxford Dictionary\n\n*Word*:\t ${result.word}\n\n*Definition*:\t ${result.definition}\n\n*Short-Definition*:\t ${result.shortDefinitions}`
    };
};

module.exports = whatIs;
