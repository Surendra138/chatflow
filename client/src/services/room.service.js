import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const getRooms = async () => {
    const res = await axios.get(`${API}/rooms`, getAuthHeader());
    return res.data;
};

export const createRoom = async (name) => {
    const res = await axios.post(`${API}/rooms`, { name }, getAuthHeader());
    return res.data;
};

export const getRoomById = async (roomId) => {
    const res = await axios.get(`${API}/rooms/${roomId}`, getAuthHeader());
    return res.data;
};