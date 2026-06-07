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
    const [contactError, setContactError] = useState('');

    const dmKey = [user?.id, userId].sort().join('_');

    const { messages, loading, error: messagesError } = useMessages(userId, 'dm');
    const { typingUsers, handleTyping } = useTyping(dmKey);

    useEffect(() => {
        if (!socket || !dmKey) return;
        socket.emit('join_room', { roomId: dmKey });
        return () => {
            socket.emit('leave_room', { roomId: dmKey });
        };
    }, [socket, dmKey]);

    useEffect(() => {
        if (!userId) return;
        setContactError('');
        const fetchContact = async () => {
            try {
                const data = await getUserById(userId);
                setContact(data);
            } catch (err) {
                setContactError('Failed to load contact');
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
            {(contactError || messagesError) && (
                <p className="chat-error">{contactError || messagesError}</p>
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

export default DMPage;