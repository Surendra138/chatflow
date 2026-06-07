import { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getRooms } from '../../services/room.service';
import { getUsers } from '../../services/user.service';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const ChatLayout = () => {
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const socket = useSocket();
    const { user } = useAuth();
    const params = useParams();

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

    useEffect(() => {
        if (!socket) return;

        const handleRoomNotification = ({ roomId, senderId }) => {
            if (senderId === user?.id) return;
            const activeRoomId = params.roomId;
            if (roomId !== activeRoomId) {
                setUnreadCounts((prev) => ({
                    ...prev,
                    [roomId]: (prev[roomId] || 0) + 1
                }));
            }
        };

        const handleDMNotification = ({ senderId, toUserId }) => {
            if (toUserId !== user?.id) return;
            const activeDmUserId = params.userId;
            if (senderId !== activeDmUserId) {
                setUnreadCounts((prev) => ({
                    ...prev,
                    [senderId]: (prev[senderId] || 0) + 1
                }));
            }
        };

        socket.on('message_notification', handleRoomNotification);
        socket.on('dm_notification', handleDMNotification);

        return () => {
            socket.off('message_notification', handleRoomNotification);
            socket.off('dm_notification', handleDMNotification);
        };
    }, [socket, params, user]);

    const handleRoomCreated = (newRoom) => {
        setRooms((prev) => [...prev, newRoom]);
    };

    const clearUnread = (id) => {
        setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));
    };

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-layout">
            {/* Overlay — tapping outside sidebar closes it on mobile */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar} />
            )}

            <Sidebar
                rooms={rooms}
                users={users}
                onRoomCreated={handleRoomCreated}
                unreadCounts={unreadCounts}
                onClearUnread={clearUnread}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            <div className="main-panel">
                {/* Hamburger button — only visible on mobile */}
                <button
                    className="hamburger-btn"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open sidebar"
                >
                    ☰
                </button>
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;