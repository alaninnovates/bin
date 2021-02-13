// Express
const express = require('express');

// Database
const Database = require('@replit/database');
const db = new Database();

// Markdown lib for html parsing
const { markdown } = require('markdown')

const app = express();

// Using ejs
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static('public'));


//app.get('/', async (req, res) => {
//res.render('pages/make')

// Clear the database
// db.list().then(keys => keys.forEach(async k => await db.delete(k)));
// List everything in the database
// db.list().then(keys => keys.forEach(async k => console.log(`${k} ${await db.get(k.toString())}`))); /*`${k} ${await db.get(k)}`*/
//});

const genRandomString = (len) => {
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWDYZabcdefghijklmnopqrstuvwdyz1234567890';
    let hex = '';
    for (i=0; i<len; i++) {
        hex += str.charAt(Math.floor(Math.random() * str.length));
    }
    return hex;
}


app.get('/', async (req, res) => {
    // console.log(await db.getAll());
    db.list().then(keys => keys.forEach(async k => console.log(`${k} ${await db.get(k, { raw: true })}`)));
    const id = req.query.id;
    if (id) {
        const text = await db.get(id, { raw: true });
        if (!text) {
            return res.render('pages/error', { error: `Could not find paste with id: ${id} in the database!` })
        }
        res.render('pages/index', { text: markdown.toHTML(text) });
    } else {
        res.redirect('/make')
    }
});

app.get('/make', (req, res) => {
    res.render('pages/make');
});

app.post('/new', async (req, res) => {
    const keys = await db.list();

    const text = req.body.text;

    let id = genRandomString(6);

    if (keys.includes(id)) {
        id = genRandomString(6)
    }

    await db.set(id, text);
    res.redirect(`/?id=${id}`);

});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server up on port ${process.env.SERVER_PORT}`);
});