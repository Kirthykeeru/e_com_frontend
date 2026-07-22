import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Container, Snackbar, Alert } from '@mui/material';
import { io } from 'socket.io-client';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProductsPage from './components/ProductsPage';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrdersPage';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavBar from './components/NavBar';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppContent() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL.replace('/api', ''), {
      transports: ['websocket'],
    });

    socket.on('newOrder', (payload) => {
      if (user?.role === 'admin') {
        setNotification(`New order #${payload.orderId} total $${payload.total}`);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  return (
    <Box>
      <CssBaseline />
      <NavBar />
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Container>
      <Snackbar open={!!notification} autoHideDuration={5000} onClose={() => setNotification(null)}>
        <Alert severity="info" onClose={() => setNotification(null)}>
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
