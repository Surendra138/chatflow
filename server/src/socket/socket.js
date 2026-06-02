import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { registerPresenceHandlers } from './handlers/presence.handler.js';
import { registerRoomHandlers } from './handlers/room.handler.js';
import { registerMessageHandlers } from './handlers/message.handler.js';
import { registerTypingHandlers } from './handlers/typing.handler.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST']
        }
    });

    // JWT auth adapter
    io.use((socket, next) => {
        try {
            let token = null;

            // 1. Try auth payload
            if (socket.handshake.auth?.token) {
                token = socket.handshake.auth.token;
            }

             // 2. Try headers (Postman case)
            else if (socket.handshake.headers?.authorization) {
                const authHeader = socket.handshake.headers.authorization;

                if (authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
            }

            if(!token) return next(new Error('Unauthorized'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Unauthorized'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.user.username}`);

        registerPresenceHandlers(io, socket);
        registerRoomHandlers(io, socket);
        registerMessageHandlers(io, socket);
        registerTypingHandlers(io, socket);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.user.username}`);
        });
    });
};

export { io };