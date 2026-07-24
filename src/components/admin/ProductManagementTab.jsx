import { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  Chip,
  Switch,
  Box,
} from '@mui/material';
import api, { getErrorMessage } from '../../utils/api';
import { formatCurrency } from '../../utils/currency';

const emptyForm = { name: '', description: '', imageUrl: '', basePrice: '', quantity: '' };

export default function ProductManagementTab() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadProducts = () => {
    api
      .get('/admin/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(loadProducts, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      imageUrl: product.image_url || '',
      basePrice: product.base_price,
      quantity: product.quantity,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setError('');
    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      quantity: Number(form.quantity),
    };
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      setDialogOpen(false);
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const toggleActive = async (product) => {
    setError('');
    try {
      await api.put(`/admin/products/${product.id}/active`, { active: !product.active });
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={openCreate}>
          Add product
        </Button>
      </Stack>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Base price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell align="right">{formatCurrency(p.base_price)}</TableCell>
                <TableCell align="right">{p.quantity}</TableCell>
                <TableCell align="center">
                  <Switch checked={Boolean(p.active)} onChange={() => toggleActive(p)} />
                  {!p.active && <Chip label="inactive" size="small" />}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingId ? 'Edit product' : 'Add product'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              fullWidth
            />
            <TextField
              label="Base price"
              type="number"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              fullWidth
            />
            <TextField
              label="Stock quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
