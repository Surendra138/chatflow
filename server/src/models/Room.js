import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        members: [{
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }]
    }, { timestamps: true });

export default mongoose.model('Room', roomSchema);