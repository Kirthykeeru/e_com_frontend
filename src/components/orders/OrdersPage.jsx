import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Link,
} from '@mui/material';
import api, { getErrorMessage } from '../../utils/api';
import { formatCurrency } from '../../utils/currency';

const STATUS_COLORS = {
  pending: 'default',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/me')
      .then((res) => setOrders(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Orders
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {orders.length === 0 ? (
        <Typography color="text.secondary">You haven't placed any orders yet.</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Placed</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Link component={RouterLink} to={`/orders/${order.id}`}>
                      #{order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  <TableCell align="right">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Chip label={order.status} size="small" color={STATUS_COLORS[order.status] || 'default'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
