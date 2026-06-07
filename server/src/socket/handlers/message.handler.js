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

        // Emit to users in the room (for message feed)
        io.to(roomId).emit('receive_message', populated);

        // Emit to ALL connected sockets (for unread badges in sidebar)
        io.emit('message_notification', {
            roomId,
            senderId: socket.user.id
        });
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

        // Emit to users in the DM room (for message feed)
        io.to(dmRoom).emit('receive_dm', populated);

        // Emit to ALL connected sockets (for unread badges in sidebar)
        io.emit('dm_notification', {
            senderId: socket.user.id,
            toUserId
        });
    };

    socket.on('send_message', sendMessage);
    socket.on('send_dm', sendDM);
};