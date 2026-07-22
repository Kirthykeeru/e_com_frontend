import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../utils/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/me').then((res) => setOrders(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        My Orders
      </Typography>
      <List>
        {orders.map((order) => (
          <Box key={order.id} mb={2}>
            <ListItem>
              <ListItemText
                primary={`Order #${order.id} - $${order.total.toFixed(2)}`}
                secondary={`Status: ${order.status} • Date: ${new Date(order.created_at).toLocaleString()}`}
              />
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
}
