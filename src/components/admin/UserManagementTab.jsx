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
  MenuItem,
  Alert,
  Stack,
  Chip,
  Box,
} from '@mui/material';
import api, { getErrorMessage } from '../../utils/api';

const emptyUserForm = { name: '', email: '', password: '', role: 'buyer' };

export default function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyUserForm);
  const [passwordDialogUser, setPasswordDialogUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const loadUsers = () => {
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(loadUsers, []);

  const handleCreate = async () => {
    setError('');
    try {
      await api.post('/admin/users', createForm);
      setCreateOpen(false);
      setCreateForm(emptyUserForm);
      loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSetPassword = async () => {
    setError('');
    try {
      await api.put(`/admin/users/${passwordDialogUser.id}/password`, { password: newPassword });
      setPasswordDialogUser(null);
      setNewPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Create user
        </Button>
      </Stack>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip size="small" label={u.role} color={u.role === 'admin' ? 'primary' : 'default'} />
                </TableCell>
                <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => setPasswordDialogUser(u)}>
                    Set password
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Create user</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Role"
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
              fullWidth
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(passwordDialogUser)} onClose={() => setPasswordDialogUser(null)} fullWidth maxWidth="xs">
        <DialogTitle>Set password for {passwordDialogUser?.email}</DialogTitle>
        <DialogContent>
          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogUser(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSetPassword}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
