import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useMessages } from '../hooks/useMessages';
import { useTyping } from '../hooks/useTyping';
import ChatHeader from '../components/chat/ChatHeader';
import MessageFeed from '../components/chat/MessageFeed';
import MessageInput from '../components/chat/MessageInput';

const RoomPage = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const socket = useSocket();
    const { messages, loading } = useMessages(roomId, 'room');
    const { typingUsers, handleTyping } = useTyping(roomId);

    useEffect(() => {
        if (!socket || !roomId) return;
        socket.emit('join_room', roomId);

        return () => {
            socket.emit('leave_room', roomId);
        };
    }, [socket, roomId]);

    const handleSend = (text) => {
        if (!socket) return;
        socket.emit('send_message', {
            roomId,
            content: text
        });
    };

    return (
        <>
            <ChatHeader name={`# ${roomId}`} />
            <MessageFeed
                messages={messages}
                typingUsers={typingUsers}
                loading={loading}
                currentUserId={user?._id}
            />
            <MessageInput onSend={handleSend} onTyping={handleTyping} />
        </>
    );
};

export default RoomPage;