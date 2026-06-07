import User from "../../models/User.js";

export const registerPresenceHandlers = (io, socket) => {

    const userConnected = async () => {
        await User.findByIdAndUpdate(socket.user.id, {
            isOnline: true
        });

        io.emit('user_connected', { userId: socket.user.id });

        // Send the full list of currently online users to ONLY this socket
        const onlineUserIds = [];
        for (const [, connectedSocket] of io.sockets.sockets) {
            if (connectedSocket.user?.id) {
                onlineUserIds.push(connectedSocket.user.id);
            }
        }
        socket.emit('online_users', { userIds: onlineUserIds });
    };

    const userDisconnected = async () => {
        // Count how many sockets this user still has active
        // (Socket.io removes the disconnecting socket from the Map before this fires)
        let activeCount = 0;
        for (const [, connectedSocket] of io.sockets.sockets) {
            if (connectedSocket.user?.id === socket.user.id) {
                activeCount++;
            }
        }

        // Only mark offline if this was their last tab
        if (activeCount === 0) {
            await User.findByIdAndUpdate(socket.user.id, {
                isOnline: false
            });
            io.emit('user_disconnected', { userId: socket.user.id });
        }
    };

    userConnected();
    socket.on('disconnect', userDisconnected);
};