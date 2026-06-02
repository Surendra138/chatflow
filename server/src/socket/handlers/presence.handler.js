import User from "../../models/User.js";

export const registerPresenceHandlers = (io, socket) => {

    const userConnected = async () => {
        await User.findByIdAndUpdate(socket.user.id, {
            isOnline: true
        });

        io.emit('user_connected', { userId: socket.user.id });
    };

    const userDisconnected = async () => {
        await User.findByIdAndUpdate(socket.user.id, {
            isOnline: false
        });

        io.emit('user_disconnected', { userId: socket.user.id });
    };

    userConnected();
    socket.on('disconnect', userDisconnected);
};