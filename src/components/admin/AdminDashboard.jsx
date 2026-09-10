import { useState } from 'react';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';
import UserManagementTab from './UserManagementTab';
import ProductManagementTab from './ProductManagementTab';
import PriceOverrideTab from './PriceOverrideTab';
import OrdersTab from './OrdersTab';
import AuditLogTab from './AuditLogTab';

const TABS = ['Users', 'Products', 'Price Overrides', 'Orders', 'Audit Log'];

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Admin Dashboard
      </Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        {TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      <Box hidden={tab !== 0}>{tab === 0 && <UserManagementTab />}</Box>
      <Box hidden={tab !== 1}>{tab === 1 && <ProductManagementTab />}</Box>
      <Box hidden={tab !== 2}>{tab === 2 && <PriceOverrideTab />}</Box>
      <Box hidden={tab !== 3}>{tab === 3 && <OrdersTab />}</Box>
      <Box hidden={tab !== 4}>{tab === 4 && <AuditLogTab />}</Box>
    </Container>
  );
}
