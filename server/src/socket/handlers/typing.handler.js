export const registerTypingHandlers = (io, socket) => {

    const typingStart = ({ roomId }) => {
        socket.broadcast.to(roomId).emit('typing_start', {
            userId: socket.user.id,
            username: socket.user.username
        });
    };

    const typingStop = ({ roomId }) => {
        socket.broadcast.to(roomId).emit('typing_stop', {
            userId: socket.user.id,
            username: socket.user.username
        });
    };

    socket.on('typing_start', typingStart);
    socket.on('typing_stop', typingStop);
};