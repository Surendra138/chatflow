import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const getMessages = async (roomId) => {
    const res = await axios.get(`${API}/messages/${roomId}`, getAuthHeader());
    return res.data;
};

export const getDMMessages = async (userId) => {
    const res = await axios.get(`${API}/messages/dm/${userId}`, getAuthHeader());
    return res.data;
};