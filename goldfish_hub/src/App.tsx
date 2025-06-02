import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Home from './pages/Home';
import Birthdays from './pages/Birthdays';
import Tasks from './pages/Tasks';
import RecurringEvents from './pages/RecurringEvents';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9800', // Orange color for the goldfish theme
    },
    secondary: {
      main: '#2196f3',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/birthdays" element={<Birthdays />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/recurring-events" element={<RecurringEvents />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
