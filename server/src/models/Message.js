import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        room: {
            type: mongoose.Types.ObjectId,
            ref: 'Room'
        }, 
        content: {
            type : String,
            required: true
        },
        type: {
            type: String,
            enum: ['room', 'dm'],
            default: 'room'
        },
        dmTo: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    }, { timestamps: true });

export default mongoose.model('Message', messageSchema);