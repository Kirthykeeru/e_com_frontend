import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, TextField, Alert } from '@mui/material';
import api from '../utils/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/products').then((res) => {
      setProducts(res.data);
      const initial = {};
      res.data.forEach((product) => {
        initial[product.id] = 1;
      });
      setQuantities(initial);
    });
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += quantities[product.id] || 1;
    } else {
      cart.push({ productId: product.id, name: product.name, price: product.price, quantity: quantities[product.id] || 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setMessage(`${product.name} added to cart.`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Products
      </Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia component="img" height="180" image={product.image_url || 'https://via.placeholder.com/400x180'} alt={product.name} />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {product.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Price: ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Available: {product.quantity}
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  label="Qty"
                  value={quantities[product.id] || 1}
                  inputProps={{ min: 1, max: product.quantity }}
                  onChange={(e) => setQuantities({ ...quantities, [product.id]: parseInt(e.target.value, 10) })}
                  sx={{ width: 100, mr: 1 }}
                />
                <Button variant="contained" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
