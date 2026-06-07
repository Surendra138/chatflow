import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useMessages } from '../hooks/useMessages';
import { useTyping } from '../hooks/useTyping';
import { getRoomById } from '../services/room.service';
import ChatHeader from '../components/chat/ChatHeader';
import MessageFeed from '../components/chat/MessageFeed';
import MessageInput from '../components/chat/MessageInput';

const RoomPage = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const socket = useSocket();
    const { messages, loading, error: messagesError } = useMessages(roomId, 'room');
    const { typingUsers, handleTyping } = useTyping(roomId);
    const [room, setRoom] = useState(null);
    const [roomError, setRoomError] = useState('');

    useEffect(() => {
        setRoomError('');
        getRoomById(roomId)
            .then(setRoom)
            .catch(() => setRoomError('Failed to load room details'));
    }, [roomId]);

    useEffect(() => {
        if (!socket || !roomId) return;
        socket.emit('join_room', { roomId });
        return () => {
            socket.emit('leave_room', { roomId });
        };
    }, [socket, roomId]);

    const handleSend = (text) => {
        if (!socket) return;
        socket.emit('send_message', { roomId, content: text });
    };

    return (
        <>
            <ChatHeader
                name={room ? `# ${room.name}` : '...'}
                memberCount={room?.members?.length}
            />
            {(roomError || messagesError) && (
                <p className="chat-error">{roomError || messagesError}</p>
            )}
            <MessageFeed
                messages={messages}
                typingUsers={typingUsers}
                loading={loading}
                currentUserId={user?.id}
            />
            <MessageInput onSend={handleSend} onTyping={handleTyping} />
        </>
    );
};

export default RoomPage;