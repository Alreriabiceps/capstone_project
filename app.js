const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('billing_system.db');

app.use(bodyParser.json());
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));

// Initialize the database (uncomment to run once)
// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS users (
//         user_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT NOT NULL UNIQUE,
//         password TEXT NOT NULL,
//         role TEXT NOT NULL CHECK (role IN ('admin', 'staff'))
//     )`);
//     db.run(`CREATE TABLE IF NOT EXISTS customers (
//         customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         age INTEGER NOT NULL,
//         location TEXT NOT NULL,
//         date_of_installment TEXT NOT NULL,
//         gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other'))
//     )`);
// });

app.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, [username, hashedPassword, role], function (err) {
        if (err) {
            return res.status(409).json({ message: 'User already exists!' });
        }
        res.status(201).json({ message: 'User registered successfully!' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        req.session.userId = user.user_id;
        req.session.role = user.role;
        res.status(200).json({ message: 'Login successful!' });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logged out successfully!' });
});

// CRUD operations for customer info
app.get('/customers', (req, res) => {
    db.all(`SELECT * FROM customers`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving customers' });
        } else {
            res.status(200).json(rows);
        }
    });
});

app.post('/customers', (req, res) => {
    const { name, age, location, date_of_installment, gender } = req.body;
    db.run(`INSERT INTO customers (name, age, location, date_of_installment, gender) VALUES (?, ?, ?, ?, ?)`, [name, age, location, date_of_installment, gender], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error adding customer' });
        } else {
            res.status(201).json({ message: 'Customer added successfully' });
        }
    });
});

app.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, location, date_of_installment, gender } = req.body;
    db.run(`UPDATE customers SET name = ?, age = ?, location = ?, date_of_installment = ?, gender = ? WHERE customer_id = ?`, [name, age, location, date_of_installment, gender, id], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error updating customer' });
        } else {
            res.status(200).json({ message: 'Customer updated successfully' });
        }
    });
});

app.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM customers WHERE customer_id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error deleting customer' });
        } else {
            res.status(200).json({ message: 'Customer deleted successfully' });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
