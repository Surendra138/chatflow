import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../shared/Avatar';
import CreateRoomModal from './CreateRoomModal';
import { useAuth } from '../../context/AuthContext';
import { usePresence } from '../../hooks/usePresence';

const Sidebar = ({ rooms, users, onRoomCreated }) => {
    const { user, logout } = useAuth();
    const { isOnline } = usePresence();
    const navigate = useNavigate();
    const params = useParams();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="sidebar">

            {/* Rooms section */}
            <div className="sidebar-section">
                <p className="sidebar-section-title">Rooms</p>
            </div>

            <ul className="sidebar-list">
                {rooms.map((room) => (
                    <li
                        key={room._id}
                        className={`sidebar-item ${params.roomId === room._id ? 'active' : ''}`}
                        onClick={() => navigate(`/room/${room._id}`)}
                    >
                        <Avatar username={room.name} />
                        <span className="sidebar-item-name">{room.name}</span>
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
                        onClick={() => navigate(`/dm/${u._id}`)}
                    >
                        <Avatar username={u.username} isOnline={isOnline(u._id)} />
                        <span className="sidebar-item-name">{u.username}</span>
                    </li>
                ))}
            </ul>

            {/* User panel */}
            <div className="user-panel">
                <Avatar username={user?.username} isOnline={true} />
                <span className="user-panel-name">{user?.username}</span>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </div>

            {/* Create room modal */}
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