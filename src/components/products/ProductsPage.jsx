import { useEffect, useState } from 'react';
import { Container, Grid, Typography, Alert, CircularProgress, Snackbar } from '@mui/material';
import api, { getErrorMessage } from '../../utils/api';
import { useCart } from '../../contexts/CartContext';
import ProductCard from './ProductCard';

export default function ProductsPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/products')
      .then((res) => {
        if (!cancelled) setProducts(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddToCart = (product, quantity) => {
    addItem(product, quantity);
    setConfirmation(`Added ${quantity} × "${product.name}" to cart`);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
        Products
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={Boolean(confirmation)}
        autoHideDuration={2500}
        onClose={() => setConfirmation('')}
        message={confirmation}
      />
    </Container>
  );
}
