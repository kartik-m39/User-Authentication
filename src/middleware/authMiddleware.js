import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load the environment variables from the .env file

// Middleware function to authenticate the user
// This function will be executed before the user routes are executed. It will check if the user is authenticated by verifying the JWT token

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization; // Read the Authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part from the Authorization header
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user ID to the request object
        req.userId = decoded.id;

        // Continue with the next middleware or route handler
        next();
    } catch (err) {
        // If the token is invalid, return an error
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
}

export default authMiddleware;
