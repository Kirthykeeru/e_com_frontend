import { Fragment, useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
  Pagination,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api, { getErrorMessage } from '../../utils/api';

const LIMIT = 10;

export default function AuditLogTab() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/audit-logs', { params: { page, limit: LIMIT } })
      .then((res) => {
        setLogs(res.data.logs);
        setTotal(res.data.total);
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, [page]);

  const pageCount = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Timestamp</TableCell>
              <TableCell>Actor</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Target</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <Fragment key={log.id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton size="small" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                      <ExpandMoreIcon
                        sx={{ transform: expandedId === log.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
                      />
                    </IconButton>
                  </TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                  <TableCell>{log.actor_email}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    {log.target_type} {log.target_id ? `#${log.target_id}` : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 0, border: expandedId === log.id ? undefined : 'none' }}>
                    <Collapse in={expandedId === log.id} unmountOnExit>
                      <Box component="pre" sx={{ p: 2, m: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>
                        {log.details ? JSON.stringify(JSON.parse(log.details), null, 2) : '(no details)'}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={pageCount} page={page} onChange={(e, p) => setPage(p)} />
      </Box>
    </Box>
  );
}
