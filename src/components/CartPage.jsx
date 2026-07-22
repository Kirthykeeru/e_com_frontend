import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert } from '@mui/material';
import api from '../utils/api';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const response = await api.post('/orders', {
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });
      localStorage.removeItem('cart');
      setCart([]);
      setMessage(`Order #${response.data.id} created successfully.`);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Order submission failed');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Cart
      </Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
      <Button variant="contained" sx={{ mt: 2 }} disabled={cart.length === 0} onClick={handlePlaceOrder}>
        Place Order
      </Button>
    </Box>
  );
}
