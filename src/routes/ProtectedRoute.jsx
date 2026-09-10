import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ role, children }) {
  const { user, initializing } = useAuth();

  // Must be checked before the !user redirect below, otherwise a hard reload bounces an
  // already-logged-in user to /login while AuthContext is still reading localStorage.
  if (initializing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
