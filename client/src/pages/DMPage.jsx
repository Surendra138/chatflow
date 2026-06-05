import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useMessages } from '../hooks/useMessages';
import { useTyping } from '../hooks/useTyping';
import { getUserById } from '../services/user.service';
import ChatHeader from '../components/chat/ChatHeader';
import MessageFeed from '../components/chat/MessageFeed';
import MessageInput from '../components/chat/MessageInput';
import { usePresence } from '../hooks/usePresence';

const DMPage = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const socket = useSocket();
    const { isOnline } = usePresence();
    const [contact, setContact] = useState(null);

    // deterministic DM room key — must match server side
    const dmKey = [user?._id, userId].sort().join('_');

    const { messages, loading } = useMessages(userId, 'dm');
    const { typingUsers, handleTyping } = useTyping(dmKey);

    useEffect(() => {
        if (!socket || !dmKey) return;
        // join the deterministic private room so receive_dm fires on this client
        socket.emit('join_room', dmKey);

        return () => {
            socket.emit('leave_room', dmKey);
        };
    }, [socket, dmKey]);

    useEffect(() => {
        if (!userId) return;
        const fetchContact = async () => {
            try {
                const data = await getUserById(userId);
                setContact(data);
            } catch (err) {
                console.error('Failed to fetch contact:', err);
            }
        };
        fetchContact();
    }, [userId]);

    const handleSend = (text) => {
        if (!socket) return;
        socket.emit('send_dm', {
            toUserId: userId,
            content: text
        });
    };

    return (
        <>
            <ChatHeader
                name={contact?.username || '...'}
                isOnline={isOnline(userId)}
            />
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

export default DMPage;