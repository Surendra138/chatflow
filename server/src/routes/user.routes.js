import express from "express";
import User from "../models/User.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/users — all users (for DM contacts list)
router.get('/', protect, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id }})
            .populate('username isOnline createdAt')
            .sort({ username: 1 });

        res.json(users);    
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/:id — single user profile
router.get('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('username isOnline createdAt');

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;