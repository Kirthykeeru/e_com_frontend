import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  IconButton,
  Alert,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api, { getErrorMessage } from '../../utils/api';

export default function PriceOverrideTab() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [overrides, setOverrides] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [overridePrice, setOverridePrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data.filter((u) => u.role === 'buyer')));
    api.get('/admin/products').then((res) => setProducts(res.data));
  }, []);

  const loadOverrides = (userId) => {
    if (!userId) {
      setOverrides([]);
      return;
    }
    api
      .get(`/admin/users/${userId}/price-overrides`)
      .then((res) => setOverrides(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(() => {
    loadOverrides(selectedUserId);
  }, [selectedUserId]);

  const handleAdd = async () => {
    setError('');
    try {
      await api.post('/admin/price-overrides', {
        userId: Number(selectedUserId),
        productId: Number(selectedProductId),
        overridePrice: Number(overridePrice),
      });
      setSelectedProductId('');
      setOverridePrice('');
      loadOverrides(selectedUserId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRemove = async (id) => {
    setError('');
    try {
      await api.delete(`/admin/price-overrides/${id}`);
      loadOverrides(selectedUserId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const productName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        select
        label="Buyer"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        sx={{ minWidth: 280, mb: 3 }}
      >
        {users.map((u) => (
          <MenuItem key={u.id} value={u.id}>
            {u.name} ({u.email})
          </MenuItem>
        ))}
      </TextField>

      {selectedUserId && (
        <>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                select
                label="Product"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                fullWidth
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} (base ${Number(p.base_price).toFixed(2)})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 8, sm: 4 }}>
              <TextField
                label="Override price"
                type="number"
                value={overridePrice}
                onChange={(e) => setOverridePrice(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 3 }}>
              <Button variant="contained" fullWidth disabled={!selectedProductId || !overridePrice} onClick={handleAdd}>
                Set
              </Button>
            </Grid>
          </Grid>

          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Override price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {overrides.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{productName(o.product_id)}</TableCell>
                    <TableCell align="right">${Number(o.override_price).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleRemove(o.id)} aria-label="remove override">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Box>
  );
}
