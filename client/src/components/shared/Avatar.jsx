const Avatar = ({ username, isOnline }) => {
    const initial = username ? username[0].toUpperCase() : '?';

    return (
        <div className="avatar">
            <div className="avatar-circle">{initial}</div>
            {isOnline !== undefined && (
                <span className={`online-dot ${isOnline ? 'online' : 'offline'}`} />
            )}
        </div>
    );
};

export default Avatar;