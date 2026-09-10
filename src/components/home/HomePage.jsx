import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const HIGHLIGHTS = [
  { icon: VerifiedIcon, title: 'Quality tested', text: 'Every item is checked against safety standards before listing.' },
  { icon: LocalShippingIcon, title: 'Fast dispatch', text: 'Orders are picked and shipped from stock the same day.' },
  { icon: SupportAgentIcon, title: 'Trade pricing', text: 'Sign in for account-specific pricing on bulk orders.' },
];

export default function HomePage() {
  return (
    <Box>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 6, md: 10 } }}>
        <Container sx={{ textAlign: 'center' }}>
          <BoltIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Electric Shop
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Wiring, lighting, and electrical hardware for trade and home projects.
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            color="secondary"
            size="large"
          >
            Shop products
          </Button>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <Grid item key={title} xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <Icon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
