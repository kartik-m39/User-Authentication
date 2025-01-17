import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import authRoutes from './api/auth.js';
import userRoutes from './api/user.js';
import dotenv from 'dotenv';
import authMiddleware from './middleware/authMiddleware.js';
import cors from 'cors';

dotenv.config(); // Load the environment variables from the .env file

const app = express();
const port = process.env.PORT || 3000;
// Apply CORS middleware
app.use(cors({
    origin: 'https://user-authentication-lsuqh8l26-kartik-manchandas-projects.vercel.app/',
    methods: 'GET,POST,OPTIONS', // Allowed methods
    allowedHeaders: 'Content-Type, Authorization' // Allowed headers
}));

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = path.dirname(__filename)

//Middleware
app.use(express.json());
// Serves the HTML file from the /public directory
// Tells express to serve all files from the public folder as static assets / file. Any requests for the css files will be resolved to the public directory.
app.use(express.static(path.join(__dirname, '../public')));

// Serving the static files from /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

// Serve users.html for frontend
app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/users.html'));
});

// auth routes
app.use('/api/auth', authRoutes);

// need to define the user routes
// authMiddleware is a middleware function that will be executed
// before the user routes are executed
// this will ensure that the user is authenticated before they can access the user routes
// api users is the path that the user routes will be mounted on
app.use('/api/data', authMiddleware, userRoutes);


app.listen(port, () => {console.log(`Server is running on port ${port}`)});                     