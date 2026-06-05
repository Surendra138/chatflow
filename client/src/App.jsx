import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatLayout from './components/layout/ChatLayout';
import RoomPage from './pages/RoomPage';
import DMPage from './pages/DMPage';

const NotFoundPage = () => (
  <div style={{ padding: '40px', textAlign: 'center', color: '#a0a8b8' }}>
    <h2>404 — Page not found</h2>
    <a href="/" style={{ color: '#7c6af7' }}>Back to chat</a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Protected routes — ChatLayout is the persistent shell */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ChatLayout />}>
                <Route path="/"               element={<Navigate to="/login" replace />} />
                <Route path="/room/:roomId"   element={<RoomPage />} />
                <Route path="/dm/:userId"     element={<DMPage />} />
              </Route>
            </Route>

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Catch all */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;