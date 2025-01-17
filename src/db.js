import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the file path from the URL of the current module
// This is used to construct the path to the database file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constructing the path to database file
const dbPath = path.join(__dirname, '../data/database.sqlite');

// Opening the database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the users table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL 
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Users table created successfully or already exists.');
    }
});

export default db;