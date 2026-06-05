import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import Spinner from '../shared/Spinner';

const MessageFeed = ({ messages, typingUsers, loading, currentUserId }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUsers]);

    if (loading) return <div className="message-feed"><Spinner /></div>;

    return (
        <div className="message-feed">
            {messages.length === 0 && (
                <p className="empty-state">No messages yet. Say hello!</p>
            )}
            {messages.map((msg) => (
                <MessageBubble
                    key={msg._id}
                    message={msg}
                    isOwn={msg.sender?._id === currentUserId}
                />
            ))}
            <TypingIndicator typingUsers={typingUsers} />
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageFeed;