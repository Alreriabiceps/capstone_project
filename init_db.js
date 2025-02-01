const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('billing_system.db');

const schema = fs.readFileSync('create_tables.sql', 'utf-8');

db.serialize(() => {
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error creating tables:', err);
        } else {
            console.log('Tables created successfully');
        }
    });
});

db.close();
