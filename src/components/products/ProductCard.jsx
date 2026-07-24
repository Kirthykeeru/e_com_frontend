import { useState } from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Button, Chip, Stack, IconButton, TextField } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { formatCurrency } from '../../utils/currency';

export default function ProductCard({ product, onAddToCart }) {
  const hasDiscount = product.price < product.base_price;
  const outOfStock = product.quantity <= 0;
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const clampQuantity = (value) => Math.min(Math.max(value, 1), product.quantity || 1);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (Number.isNaN(value)) return;
    setQuantity(clampQuantity(value));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={1}>
      {product.image_url && !imageError ? (
        <CardMedia
          component="img"
          height="160"
          image={product.image_url}
          alt={product.name}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          style={{
            height: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#eef2f7',
          }}
        >
          <ElectricBoltIcon sx={{ fontSize: 48, color: '#9aa7b5' }} />
        </div>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.description}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="h6" color="primary">
            {formatCurrency(product.price)}
          </Typography>
          {hasDiscount && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
              {formatCurrency(product.base_price)}
            </Typography>
          )}
        </Stack>
        {outOfStock ? (
          <Chip label="Out of stock" size="small" color="default" sx={{ mt: 1 }} />
        ) : (
          <Chip label={`${product.quantity} in stock`} size="small" color="success" variant="outlined" sx={{ mt: 1 }} />
        )}
      </CardContent>
      <CardActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 2, pb: 2 }}>
        {!outOfStock && (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <IconButton
              size="small"
              onClick={() => setQuantity((q) => clampQuantity(q - 1))}
              disabled={quantity <= 1}
              aria-label="decrease quantity"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              type="number"
              size="small"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, max: product.quantity, style: { width: 48, textAlign: 'center' } }}
            />
            <IconButton
              size="small"
              onClick={() => setQuantity((q) => clampQuantity(q + 1))}
              disabled={quantity >= product.quantity}
              aria-label="increase quantity"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
        <Button fullWidth variant="contained" disabled={outOfStock} onClick={handleAddToCart}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
