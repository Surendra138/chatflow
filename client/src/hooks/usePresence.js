import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

export const usePresence = () => {
    const socket = useSocket();
    const [ onlineUsers, setOnlineUsers ] = useState(new Set());

    useEffect(() => {
        if(!socket) return;

        // Seed the full online list when we first connect
        const handleOnlineUsers = ({ userIds }) => {
            setOnlineUsers(new Set(userIds));
        };

        const handleUserConnected = ({ userId }) => {
            setOnlineUsers((prev) => new Set([...prev, userId]));
            console.log('user connected:', userId);
        };

        const handleUserDisconnected = ({ userId }) => {
            setOnlineUsers((prev) => {
                const updated = new Set(prev);
                updated.delete(userId);
                return updated;
            });
            console.log('user disconnected:', userId);
        };

        socket.on('online_users', handleOnlineUsers);
        socket.on('user_connected', handleUserConnected);
        socket.on('user_disconnected', handleUserDisconnected);

        return () => {
            socket.off('online_users', handleOnlineUsers);
            socket.off('user_connected', handleUserConnected);
            socket.off('user_disconnected', handleUserDisconnected);
        };
    }, [socket]);

    const isOnline = (userId) => onlineUsers.has(userId);

    return { onlineUsers, isOnline };
};