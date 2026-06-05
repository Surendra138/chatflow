import Avatar from '../shared/Avatar';

const MessageBubble = ({ message, isOwn }) => {
    const { sender, content, createdAt } = message;
    const time = new Date(createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className={`message-bubble ${isOwn ? 'own' : ''}`}>
            <Avatar username={sender?.username} />
            <div className="message-body">
                <span className="message-username">{sender?.username}</span>
                <p className="message-text">{content}</p>
                <span className="message-time">{time}</span>
            </div>
        </div>
    );
};

export default MessageBubble;