const express = require("express");
const app = express();
const startChomtu = require("./app.js");

app.use(express.static('public'))

app.get("/", (req, res) => {
	res.render('index.html');
});

// Run the bot 
app.listen(3000, () => {
	startChomtu();
});