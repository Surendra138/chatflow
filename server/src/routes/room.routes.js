import express from 'express';
import Room from '../models/Room.js';
import  protect  from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/rooms — all rooms (for sidebar)
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.json(rooms);    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/rooms — create a room
router.post('/', protect, async (req, res) => {
    const { name } = req.body;

    if(!name || !name.trim()) {
        return res.status(400).json({ message: 'Room name is required' });
    }

    try {
        const exists = await Room.findOne({ name: name.trim() });
        if(exists) {
            return res.status(400).json({ message: 'Room already exists' });
        }

        const newRoom = await Room.create({
            name: name.trim(),
            createdBy: req.user.id,
            members: [req.user.id],  // creator auto-joins
        });
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/rooms/:id — single room + members
router.get('/:id', protect, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('createdBy', 'username')
            .populate('members', 'username isOnline');

        if(!room) {
            return res.status(404).json({ message: 'Room not found' });
        }    
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;