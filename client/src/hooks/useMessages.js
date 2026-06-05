import { useState, useEffect } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";

export const useMessages = (id, type = 'room') => {
    const socket = useSocket();
    const [ messages, setMessages ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState();

    // fetch history on mount or when id changes
    useEffect(() => {
        if(!id) return;

        const fetchMessages = async() => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem.token;
                const url = type === 'dm'
                    ? `${import.meta.env.VITE_API_URL}/messages/dm/${id}`
                    : `${import.meta.env.VITE_API_URL}/messages/${id}`;

                const { data } = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setMessages(data);
            } catch (err) {
                setError(err.Response?.data?.message || 'Failed to load messages');
            } finally {
                setLoading(false);
            }
        };
        
        fetchMessages();
    }, [id, type]);

    // listen for live incoming messages
    useEffect(() => {
        if(!socket || !id) return;

        const event = type === 'dm' ? 'receive_dm' : 'receive_message';

        const handleNewMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        socket.on(event, handleNewMessage);

        return () => {
            socket.off(event, handleNewMessage);
        };
    }, [socket, id, type]);

    return { messages, loading, error };
};