import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getUsers = async () => {
    const res = await axios.get(`${API}/users`, getAuthHeader());
    return res.data;
};

export const getUserById = async (userId) => {
    const res = await axios.get(`${API}/users/${userId}`, getAuthHeader());
    return res.data;
};