import Message from '../../models/Message.js';

export const registerMessageHandlers = (io, socket) => {
    // Room message
    const sendMessage = async ({ roomId, content }) => {
        const message = await Message.create({
            sender: socket.user.id,
            room: roomId,
            content,
            type: 'room'
        });

        const populated = await Message.findById(message._id).populate('sender', 'username');

        io.to(roomId).emit('receive_message', populated);
    };

    // DM message
    const sendDM = async ({ toUserId, content }) => {
        const message = await Message.create({
            sender: socket.user.id,
            dmTo: toUserId,
            content: content,
            type: 'dm'
        });

        const populated = await message.populate('sender', 'username');

        // Deterministic private room key
        const dmRoom = [socket.user.id, toUserId].sort().join('_');

        io.to(dmRoom).emit('receive_dm', populated);
    };

    socket.on('send_message', sendMessage);
    socket.on('send_dm', sendDM);
};