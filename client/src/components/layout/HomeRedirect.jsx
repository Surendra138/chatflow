import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getRooms } from '../../services/room.service';
import Spinner from '../shared/Spinner';

export default function HomeRedirect() {
    const [firstRoomId, setFirstRoomId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRooms()
        .then(rooms => {
            if (rooms.length > 0) {
                setFirstRoomId(rooms[0]._id);
            }
        })
        .catch(() => {
            // no rooms or fetch failed — stay on empty state
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="main-panel"><Spinner /></div>;

    if (firstRoomId) return <Navigate to={`/room/${firstRoomId}`} replace />;

    return (
        <div className="main-panel empty-state">
            <div className="empty-state-content">
                <div className="empty-state-icon">💬</div>
                <h2>No rooms yet</h2>
                <p>Create a room from the sidebar to get started.</p>
            </div>
        </div>
    );
}