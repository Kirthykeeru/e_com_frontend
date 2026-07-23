import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { connectAdminSocket, disconnectSocket } from '../../utils/socket';

export default function NotificationSnackbar() {
  const { user, token } = useAuth();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin' || !token) return undefined;

    const socket = connectAdminSocket(token);
    const handleNewOrder = (payload) => {
      setNotification(`New order #${payload.orderId} from ${payload.buyerName} — $${Number(payload.total).toFixed(2)}`);
    };
    socket.on('newOrder', handleNewOrder);

    return () => {
      socket.off('newOrder', handleNewOrder);
      disconnectSocket();
    };
  }, [user, token]);

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={6000}
      onClose={() => setNotification(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={() => setNotification(null)} severity="info" variant="filled">
        {notification}
      </Alert>
    </Snackbar>
  );
}
