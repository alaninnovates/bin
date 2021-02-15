// Express
const express = require('express');

// Database
const BinSchema = require('./binSchema');
const mongoose = require('mongoose');

// Markdown lib for html parsing
// Not nessacary anymore
// const { markdown } = require('markdown')

// Languages hljs supports
const languages = require('./languages');

const app = express();

// Using ejs
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static('public'));

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const genRandomString = (len) => {
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWDYZabcdefghijklmnopqrstuvwdyz1234567890';
    let hex = '';
    for (i = 0; i < len; i++) {
        hex += str.charAt(Math.floor(Math.random() * str.length));
    }
    return hex;
}


app.get('/', async (req, res) => {
    const id = req.query.id;
    if (id) {
        const data = await BinSchema.findOne({ id })
        if (!data) {
            return res.render('pages/error', { error: `Could not find paste with id: ${id} in the database!` })
        }
        res.render('pages/index', { text: data.text, lang: data.lang }); /* markdown.toHTML(data.text) */
    } else {
        res.redirect('/make')
    }
});

app.get('/make', (req, res) => {
    res.render('pages/make', { languages });
});

app.post('/new', async (req, res) => {
    const text = req.body.text;
    const lang = req.body.lang;

    let id = genRandomString(6);

    // This is just so we dont over write something thats already in the database
    const check = await BinSchema.findOne({ id })
    if (check) {
        id = genRandomString(6)
    }

    await BinSchema.findOneAndUpdate(
        {
            id
        },
        {
            id,
            text,
            lang
        },
        {
            upsert: true
        }
    )
    res.redirect(`/?id=${id}`);
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server up on port ${process.env.SERVER_PORT}`);
});