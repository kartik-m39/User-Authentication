import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import dotenv from "dotenv";

dotenv.config();

// Create a new router
// This router will be used to define the routes for user authentication
// The routes will be mounted on the /auth path
const router = express.Router();

// Registering a new user endpoint /auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try{
        // Check if the user already exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if(err) return reject(err);
                resolve(row);
            })
        });

        if(existingUser) {
            return res.status(400).send({message: 'User already exists'}); 
        }

        // Hash the password that will be irreversibly stored in the database
        const hashedPassword = await bcrypt.hash(password,8);

        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
        const result = insertUser.run(username, hashedPassword);

        // Create a token for the new user
        const token = jwt.sign({ id: result.lastID }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
}) 

// Login endpoint /auth/login
router.post('/login', async(req, res) => {
    // we get their email, and we look up the password associated with that email in the database
    // but we get it back and see it's encrypted, which means that we cannot compare it to the one the user just used trying to login
    // so what we can to do, is again, one way encrypt the password the user just entered and compare it to the one in the database

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Directly use db.get() to execute the query and get user data
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                console.error("Error during database query:", err);
                return res.status(500).send('Internal Server Error');
            }

            // If user does not exist
            if (!user) {
                return res.status(400).json({ message: 'Invalid Credentials - User not found' });
            }

            // Compare passwords
            const passwordisValid = await bcrypt.compare(password, user.password);
            if (!passwordisValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ success: true, token });
        });

    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

export default router;