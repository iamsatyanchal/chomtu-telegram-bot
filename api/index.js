import express from 'express';
import startChomtu from '../src/app.js';

const app = express();

// Root route
app.get("/", (req, res) => {
	res.render('<h1>Bot Is Online!</h1>');
});

const run = () => {
	// Run the bot 
	app.listen(3000, () => {
		startChomtu();
	});
}

export default run;