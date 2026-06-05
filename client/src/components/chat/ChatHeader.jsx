import Avatar from '../shared/Avatar';

const ChatHeader = ({ name, isOnline, memberCount }) => {
    return (
        <div className="chat-header">
            <Avatar username={name} isOnline={isOnline} />
            <div className="chat-header-info">
                <span className="chat-header-name">{name}</span>
                {memberCount !== undefined && (
                    <span className="chat-header-meta">{memberCount} members</span>
                )}
                {isOnline !== undefined && memberCount === undefined && (
                    <span className="chat-header-meta">{isOnline ? 'Online' : 'Offline'}</span>
                )}
            </div>
        </div>
    );
};

export default ChatHeader;