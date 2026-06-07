import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../shared/Avatar';
import CreateRoomModal from './CreateRoomModal';
import { useAuth } from '../../context/AuthContext';
import { usePresence } from '../../hooks/usePresence';
import { useTheme } from '../../hooks/useTheme';

const Sidebar = ({ rooms, users, onRoomCreated, unreadCounts, onClearUnread, isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const { isOnline } = usePresence();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const params = useParams();
    const [showModal, setShowModal] = useState(false);

    const handleRoomClick = (room) => {
        onClearUnread(room._id);
        navigate(`/room/${room._id}`);
        onClose();
    };

    const handleDMClick = (u) => {
        onClearUnread(u._id);
        navigate(`/dm/${u._id}`);
        onClose();
    };

    return (
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>

            {/* Mobile close button */}
            <button className="sidebar-close-btn" onClick={onClose}>✕</button>

            {/* Scrollable area — rooms + DMs */}
            <div className="sidebar-scrollable">

                {/* Rooms section */}
                <div className="sidebar-section">
                    <p className="sidebar-section-title">Rooms</p>
                </div>

                <ul className="sidebar-list">
                    {rooms.map((room) => (
                        <li
                            key={room._id}
                            className={`sidebar-item ${params.roomId === room._id ? 'active' : ''}`}
                            onClick={() => handleRoomClick(room)}
                        >
                            <Avatar username={room.name} />
                            <span className="sidebar-item-name">{room.name}</span>
                            {unreadCounts[room._id] > 0 && (
                                <span className="unread-badge">{unreadCounts[room._id]}</span>
                            )}
                        </li>
                    ))}
                </ul>

                <button className="create-room-btn" onClick={() => setShowModal(true)}>
                    + New Room
                </button>

                {/* DMs section */}
                <div className="sidebar-section">
                    <p className="sidebar-section-title">Direct Messages</p>
                </div>

                <ul className="sidebar-list">
                    {users.map((u) => (
                        <li
                            key={u._id}
                            className={`sidebar-item ${params.userId === u._id ? 'active' : ''}`}
                            onClick={() => handleDMClick(u)}
                        >
                            <Avatar username={u.username} isOnline={isOnline(u._id)} />
                            <span className="sidebar-item-name">{u.username}</span>
                            {unreadCounts[u._id] > 0 && (
                                <span className="unread-badge">{unreadCounts[u._id]}</span>
                            )}
                        </li>
                    ))}
                </ul>

            </div>

            {/* User panel — always pinned to bottom */}
            <div className="user-panel">
                <Avatar username={user?.username} isOnline={true} />
                <span className="user-panel-name">{user?.username}</span>
                <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </div>

            {showModal && (
                <CreateRoomModal
                    onClose={() => setShowModal(false)}
                    onRoomCreated={onRoomCreated}
                />
            )}
        </div>
    );
};

export default Sidebar;