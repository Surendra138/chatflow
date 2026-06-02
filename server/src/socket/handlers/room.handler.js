export const registerRoomHandlers = (io, socket) => {
    const joinRoom = ({ roomId }) => {
        socket.join(roomId);
        console.log(`${socket.user.username} joined room: ${roomId}`);
    };

    const leaveRoom = ({ roomId }) => {
        socket.leave(roomId);
        console.log(`${socket.user.username} left room: ${roomId}`);
    };

    socket.on('join_room', joinRoom);
    socket.on('leave_room', leaveRoom);
};