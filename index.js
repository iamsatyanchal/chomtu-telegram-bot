import express from 'express';
import startChomtu from './src/app.js';
import serverless = require('serverless-http');

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
	res.send('<h1>Bot Online</h1>');
})

app.use('/', router);

export default {
	app,
	serverless(app)
}