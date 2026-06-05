import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getRooms } from '../../services/room.service';
import { getUsers } from '../../services/user.service';

const ChatLayout = () => {
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsData, usersData] = await Promise.all([
                    getRooms(),
                    getUsers()
                ]);
                setRooms(roomsData);
                setUsers(usersData);
            } catch (err) {
                console.error('Failed to load sidebar data:', err);
            }
        };
        fetchData();
    }, []);

    const handleRoomCreated = (newRoom) => {
        setRooms((prev) => [...prev, newRoom]);
    };

    return (
        <div className="app-layout">
            <Sidebar
                rooms={rooms}
                users={users}
                onRoomCreated={handleRoomCreated}
            />
            <div className="main-panel">
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;