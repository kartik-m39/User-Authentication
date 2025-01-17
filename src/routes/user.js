import express from "express";
import db from "../db.js";
import authMiddleware from '../middleware/authMiddleware.js';

// Create a new router
const router = express.Router();

router.get('/', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if(err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        // Return the user list
        res.json({ success: true, users: rows });
    });
});

// Delete user account endpoint /user/delete
router.delete('/delete', authMiddleware, (req, res) => {
    const userId = req.userId;
    console.log('Deleting user with ID:', userId);

    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error deleting account' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'Account deleted successfully' });
    });
});

export default router;