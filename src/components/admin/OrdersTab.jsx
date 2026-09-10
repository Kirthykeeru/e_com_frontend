import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  MenuItem,
  Select,
  Alert,
} from '@mui/material';
import api, { getErrorMessage } from '../../utils/api';
import { formatCurrency } from '../../utils/currency';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'default',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadOrders = () => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(loadOrders, []);

  const handleStatusChange = async (order, status) => {
    setError('');
    try {
      await api.patch(`/orders/${order.id}/status`, { status });
      loadOrders();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Placed</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {order.buyer_name} <br />
                  <small>{order.buyer_email}</small>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                <TableCell align="right">{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    size="small"
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    renderValue={(value) => <Chip label={value} size="small" color={STATUS_COLORS[value]} />}
                  >
                    {STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
