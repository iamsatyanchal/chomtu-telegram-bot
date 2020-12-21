const express = require("express");
const app = express();
const startChomtu = require("./app.js");

app.get("/", (req, res) => {
	res.send("Hello world! Bot is up and running");
});

// Run the bot 
app.listen(3000, () => {
	startChomtu();
});
