import { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export const useTyping = (roomId) => {
    const socket = useSocket();
    const [ typingUsers, setTypingUsers ] = useState([]);
    const typingTimeoutRef = useRef(null);

    // handle local user typing
    const handleTyping = () => {
        if(!socket || !roomId) return;

        // emit typing_start on every keystroke
        socket.emit('typing_start', { roomId });

        // clear previous timeout and set a new one
        if(typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing_stop', { roomId });
        }, 1500);  
    };

    // listen for other users typing
    useEffect(() => {
        if(!socket || !roomId) return;

        const handleTypingStart = ({ userId, username }) => {
            setTypingUsers((prev) => {
                // avoid duplicates if typing_start fires multiple times
                const already = prev.find((u) => u.userId === userId);
                if(already) return prev;
                return [...prev, { userId, username }];
            });
        };

        const handleTypingStop = ({ userId}) => {
            setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
        };

        socket.on('typing_start', handleTypingStart);
        socket.on('typing_stop', handleTypingStop);

        return () => {
            socket.off('typing_start', handleTypingStart);
            socket.off('typing_stop', handleTypingStop);
            // clean up timeout if component unmounts mid-typing
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [socket, roomId]);

    return { typingUsers, handleTyping };
};