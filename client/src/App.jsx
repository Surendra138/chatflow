import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const NotFoundPage = () => (
  <div>
    <h2>404 — Page not found</h2>
    <a href="/">Go home</a>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Chat coming in Phase 6</div>} />
            <Route path="/room/:roomId" element={<div>RoomPage coming in Phase 6</div>} />
            <Route path="/dm/:userId" element={<div>DMPage coming in Phase 6</div>} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;