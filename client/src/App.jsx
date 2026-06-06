import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import ProtectedRoute from './components/shared/ProtectedRoute';
import PublicRoute from './components/shared/PublicRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import ChatLayout from './components/layout/ChatLayout';
import HomeRedirect from './components/layout/HomeRedirect';
import RoomPage from './pages/RoomPage';
import DMPage from './pages/DMPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>

            {/* Public routes — redirect away if already logged in */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes — redirect to /login if not authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ChatLayout />}>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/room/:roomId" element={<RoomPage />} />
                <Route path="/dm/:userId" element={<DMPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;