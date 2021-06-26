// Express
const express = require('express');

// Database
const BinSchema = require('./binSchema');
const mongoose = require('mongoose');

const app = express();

// Using ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static('public'));
app.use(express.json());

mongoose.connect(process.env.URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const genRandomString = (len) => {
	const str =
		'ABCDEFGHIJKLMNOPQRSTUVWDYZabcdefghijklmnopqrstuvwdyz1234567890';
	let hex = '';
	for (i = 0; i < len; i++) {
		hex += str.charAt(Math.floor(Math.random() * str.length));
	}
	return hex;
};

app.get('/', (req, res) => {
	return res.redirect('/make');
});

app.get('/make', (req, res) => {
	const text = req.query.text || 'Text here';
	return res.render('pages/make', { text });
});

app.post('/new', async (req, res) => {
	const text = req.body.text;
	const lang = req.body.lang;

	if (!text) return res.send('no u');

	let id = genRandomString(6);

	// This is just so we dont over write something thats already in the database
	const check = await BinSchema.findOne({ id });
	if (check) {
		id = genRandomString(6);
	}

	await new BinSchema({
		id,
		text,
		lang,
	}).save();
	res.json({ id });
});

app.get('/:id', async (req, res) => {
	const id = req.params.id;
	if (id) {
		const data = await BinSchema.findOne({ id });
		if (!data) {
			return res.render('pages/error', {
				error: `Could not find paste with id: ${id} in the database!`,
			});
		}
		res.render('pages/index', { text: data.text, lang: data.lang, id });
	} else {
		res.redirect('/make');
	}
});

app.get('/raw/:id', async (req, res) => {
	const id = req.params.id;
	if (id) {
		const data = await BinSchema.findOne({ id });
		if (!data) {
			return res.render('pages/error', {
				error: `Could not find paste with id: ${id} in the database!`,
			});
		}
		res.render('pages/index', { text: data.text, lang: data.lang, id });
	} else {
		res.redirect('/make');
	}
});

app.listen(process.env.SERVER_PORT, () => {
	console.log(`Server up on port ${process.env.SERVER_PORT}`);
});
