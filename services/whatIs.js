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
            const responseObject = {
                status: "success",
                word: word,
                definition: response.data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0],
                shortDefinitions: response.data.results[0].lexicalEntries[0].entries[0].senses[0].shortDefinitions[0],
                audio: false
            }

            // If audio found in the response then append audio link.
            try {
                responseObject.audioLink = response.data.results[0].lexicalEntries[1].entries[0].pronunciations[1].audioFile;
                responseObject.audio = true;
            } finally {
                return responseObject;
            }
            
        })
        .catch((err) => {
            return { status: "fail", err: err };
        });
};

const whatIs = async (word) => {
    // Calls the searchWord function and pass the word toit
    const result = await searchWord(word);
    
    if (result.status !== "success") {
        return { status: "fail", markdown: "No word found" };
    }
    return result;
};

module.exports = whatIs;
