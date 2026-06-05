import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../shared/Modal';
import { createRoom } from '../../services/room.service';

const CreateRoomModal = ({ onClose, onRoomCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        setError('');
        try {
            const newRoom = await createRoom(name.trim());
            onRoomCreated(newRoom);
            onClose();
            navigate(`/room/${newRoom._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <h3>Create a Room</h3>
            <input
                type="text"
                placeholder="Room name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
            />
            {error && <p className="error">{error}</p>}
            <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn-primary" onClick={handleCreate} disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </div>
        </Modal>
    );
};

export default CreateRoomModal;