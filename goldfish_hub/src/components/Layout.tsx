import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Home', path: '/' },
    { label: 'Birthdays', path: '/birthdays' },
    { label: 'Tasks', path: '/tasks' },
    { label: 'Recurring Events', path: '/recurring-events' },
  ];

  const currentTab = tabs.findIndex(tab => tab.path === location.pathname);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(tabs[newValue].path);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <PetsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GoldFish Hub
          </Typography>
        </Toolbar>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          centered
          textColor="inherit"
          indicatorColor="secondary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 