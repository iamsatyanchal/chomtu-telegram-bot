import express from 'express';
import startChomtu from './app.js';

const app = express();

app.use(express.static('public'))

// Root route
app.get("/", (req, res) => {
	res.render('index.html');
});

// Run the bot 
app.listen(3000, () => {
	startChomtu();
});