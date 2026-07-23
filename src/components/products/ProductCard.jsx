import { Card, CardContent, CardActions, CardMedia, Typography, Button, Chip, Stack } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

export default function ProductCard({ product, onAddToCart }) {
  const hasDiscount = product.price < product.base_price;
  const outOfStock = product.quantity <= 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={1}>
      {product.image_url ? (
        <CardMedia component="img" height="160" image={product.image_url} alt={product.name} />
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
            ${Number(product.price).toFixed(2)}
          </Typography>
          {hasDiscount && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
              ${Number(product.base_price).toFixed(2)}
            </Typography>
          )}
        </Stack>
        {outOfStock ? (
          <Chip label="Out of stock" size="small" color="default" sx={{ mt: 1 }} />
        ) : (
          <Chip label={`${product.quantity} in stock`} size="small" color="success" variant="outlined" sx={{ mt: 1 }} />
        )}
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" disabled={outOfStock} onClick={() => onAddToCart(product)}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
