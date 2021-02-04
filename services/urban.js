const urban_dict = require('urban-dictionary');

const ud = (query) => {
	// Get the meaning of the query word and return
	return urban_dict.define(query)
		.then(result => {
			const resp = {
				status: 'success',
				markdown: `🔰 Urban Dictionary\n\n` + 
							`*Word:*\t ${query}\n\n` + 
							`*Definition:*\n${result[0].definition}\n\n` + 
							`*Example[s]:*\n${result[0].example}`
			}
			return resp;
		})
		.catch(err => {
			const resp = {
				status: 'fail',
				markdown: '😡 You hurt my brain with such non existing words!'
			};
			return resp;
		})
}	

module.exports = ud;