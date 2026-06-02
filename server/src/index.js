import 'dotenv/config';
import './config/env.js';
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import roomRoutes from './routes/room.routes.js';
import userRoutes from './routes/user.routes.js';
import { create } from 'domain';
import { initSocket } from './socket/socket.js';

const app = express();
connectDB();

const server = http.createServer(app);
initSocket(server);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => res.json({ message: 'ChatFlow API running'}));

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));