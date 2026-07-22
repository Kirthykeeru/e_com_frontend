import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Select,
  MenuItem,
  Alert,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import api from '../utils/api';

const emptyProductForm = { name: '', description: '', imageUrl: '', basePrice: '', quantity: '', active: true };

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [overridePrice, setOverridePrice] = useState('');
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState('');

  const loadUsers = () => api.get('/admin/users').then((res) => setUsers(res.data));
  const loadProducts = () => api.get('/admin/products').then((res) => setProducts(res.data));
  const loadOrders = () => api.get('/orders').then((res) => setOrderList(res.data));
  const loadAuditLogs = () => api.get('/admin/audit-logs').then((res) => setAuditLogs(res.data));

  useEffect(() => {
    loadUsers();
    loadProducts();
    loadOrders();
    loadAuditLogs();
  }, []);

  const handleSaveOverride = async () => {
    try {
      await api.post('/admin/price-overrides', {
        userId: parseInt(selectedUser, 10),
        productId: parseInt(selectedProduct, 10),
        overridePrice: parseFloat(overridePrice),
      });
      setMessage('Price override saved.');
      loadAuditLogs();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to save override');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      imageUrl: product.image_url || '',
      basePrice: product.base_price,
      quantity: product.quantity,
      active: !!product.active,
    });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const handleSubmitProduct = async () => {
    const payload = {
      name: productForm.name,
      description: productForm.description,
      imageUrl: productForm.imageUrl,
      basePrice: parseFloat(productForm.basePrice),
      quantity: parseInt(productForm.quantity, 10),
      active: productForm.active,
    };
    try {
      if (editingProductId) {
        await api.put(`/admin/products/${editingProductId}`, payload);
        setMessage('Product updated.');
      } else {
        await api.post('/admin/products', payload);
        setMessage('Product created.');
      }
      handleCancelEdit();
      loadProducts();
      loadAuditLogs();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to save product');
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await api.put(`/admin/products/${product.id}`, {
        name: product.name,
        description: product.description,
        imageUrl: product.image_url,
        basePrice: product.base_price,
        quantity: product.quantity,
        active: !product.active,
      });
      loadProducts();
      loadAuditLogs();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to update product');
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>}
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

          <Paper sx={{ p: 2, mb: 2 }}>
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

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              {editingProductId ? 'Edit Product' : 'Add Product'}
            </Typography>
            <TextField
              fullWidth
              label="Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={productForm.imageUrl}
              onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Base Price"
              type="number"
              value={productForm.basePrice}
              onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={productForm.quantity}
              onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={productForm.active}
                  onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                />
              }
              label="Active"
              sx={{ mb: 2, display: 'block' }}
            />
            <Button
              variant="contained"
              onClick={handleSubmitProduct}
              disabled={!productForm.name || !productForm.basePrice || productForm.quantity === ''}
              sx={{ mr: 1 }}
            >
              {editingProductId ? 'Save Changes' : 'Create Product'}
            </Button>
            {editingProductId && (
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}

            <Table size="small" sx={{ mt: 3 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${Number(product.base_price).toFixed(2)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={product.active ? 'Active' : 'Inactive'}
                        color={product.active ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleEditProduct(product)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button size="small" onClick={() => handleToggleActive(product)}>
                        {product.active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
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

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Audit Log
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>When</TableCell>
                  <TableCell>Actor</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Target</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                    <TableCell>{log.actor_email}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.target_type ? `${log.target_type} #${log.target_id}` : '-'}</TableCell>
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
