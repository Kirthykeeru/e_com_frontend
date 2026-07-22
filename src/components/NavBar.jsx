import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Electric Shop
          </Button>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/cart">
                Cart
              </Button>
              <Button color="inherit" component={Link} to="/orders">
                My Orders
              </Button>
            </>
          )}
          {user?.role === 'admin' && (
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
          )}
        </Box>
        <Box>
          {user ? (
            <>
              <Typography component="span" sx={{ mr: 2 }}>
                {user.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
