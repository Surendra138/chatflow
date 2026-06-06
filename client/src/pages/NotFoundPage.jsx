import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon">🔍</div>
                <h1>404</h1>
                <p>Page not found</p>
                <Link to="/" className="not-found-link">Back to ChatFlow</Link>
            </div>
        </div>
    );
}