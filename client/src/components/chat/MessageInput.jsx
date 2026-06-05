import { useState } from 'react';

const MessageInput = ({ onSend, onTyping }) => {
    const [text, setText] = useState('');

    const handleChange = (e) => {
        setText(e.target.value);
        onTyping();
    };

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text.trim());
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="message-input">
            <textarea
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default MessageInput;