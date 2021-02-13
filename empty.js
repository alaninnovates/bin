const Database = require('@replit/database')
const db = new Database()
while (true) {
    db.empty();
    db.list().then(keys => keys.forEach(async k => await db.delete(k)));
}