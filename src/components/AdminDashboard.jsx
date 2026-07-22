import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Select, MenuItem, Alert } from '@mui/material';
import api from '../utils/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [overridePrice, setOverridePrice] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data));
    api.get('/products').then((res) => setProducts(res.data));
    api.get('/orders').then((res) => setOrderList(res.data));
  }, []);

  const handleSaveOverride = async () => {
    try {
      await api.post('/admin/price-overrides', {
        userId: parseInt(selectedUser, 10),
        productId: parseInt(selectedProduct, 10),
        overridePrice: parseFloat(overridePrice),
      });
      setMessage('Price override saved.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to save override');
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" mb={2}>
              Users
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Price Override
            </Typography>
            <Select fullWidth value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} displayEmpty sx={{ mb: 2 }}>
              <MenuItem value="">Select user</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </Select>
            <Select fullWidth value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} displayEmpty sx={{ mb: 2 }}>
              <MenuItem value="">Select product</MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
              ))}
            </Select>
            <TextField fullWidth label="Override Price" type="number" value={overridePrice} onChange={(e) => setOverridePrice(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleSaveOverride} disabled={!selectedUser || !selectedProduct || !overridePrice}>
              Save Override
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Recent Orders
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.buyer_name}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
