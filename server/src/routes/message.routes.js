import express from "express";
import protect from '../middleware/auth.middleware.js';
import Message from "../models/Message.js";

const router = express.Router();

// GET /api/messages/:roomId — room message history
router.get('/:roomId', protect, async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before;

    try {
        const query = { room: req.params.roomId, type: 'Room' };
        if(before) query.createdAt = { $lt: new Date(before) };

        const messages = await Message.find(query)
            .populate('sender', 'username')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json(messages.reverse());    
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/messages/dm/:userId — DM history between two users
router.get('/dm/:userId', protect, async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before;

    try {
        const query = {
            type: 'dm',
            $or: [
                { sender: req.user.id, room: req.params.userId },
                { sender: req.params.userId, room: req.user.id },
            ],
        };

        if(before) query.createdAt = { $lt: new Date(before) };
        const messages = await Message.find(query)
            .populate('sender', 'username')
            .sort({ createdAt: -1 })
            .limit(limit);
        
        res.json(messages.reverse());    
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;