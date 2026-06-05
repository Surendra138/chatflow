const TypingIndicator = ({ typingUsers }) => {
    if (!typingUsers || typingUsers.length === 0) return null;

    const names = typingUsers.map((u) => u.username).join(', ');
    const verb = typingUsers.length === 1 ? 'is' : 'are';

    return (
        <div className="typing-indicator">
            {names} {verb} typing...
        </div>
    );
};

export default TypingIndicator;