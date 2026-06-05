import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    Headers: {
        Authrization: `Bearer ${localStorage.getItem('token')}`
    }
};

export const getRooms = async () => {
    const res = await axios.get(`${API}/rooms`, getAuthHeader());
    return res.data;
};

export const createRoom = async (name) => {
    const res = await axios.post(`${API}/rooms`, getAuthHeader());
    return res.data;
};