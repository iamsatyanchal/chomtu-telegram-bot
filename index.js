import express from 'express';
import startChomtu from './src/app.js';

const app = express();

app.use(express.static('public'))

// Root route
app.get("/", (req, res) => {
	res.send('<h1>Bot Online</h1>');
});

// Run the bot 
app.listen(3000, () => {
	startChomtu();
});