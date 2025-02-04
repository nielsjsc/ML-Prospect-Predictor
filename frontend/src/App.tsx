import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ProspectRankings from './pages/ProspectRankings';
import PlayerPage from './pages/PlayerPage';
import { ProspectFilters, ProspectType } from './types/filters';
import { ProspectProvider } from './context/ProspectContext';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#041E42',  // Blue
    },
    secondary: {
      main: '#C41E3A',  // Red
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
});

const initialFilters: ProspectFilters = {
  type: 'hitter' as ProspectType,
  grades: {},
};

function App() {
  const [filters, setFilters] = useState<ProspectFilters>({
    type: 'hitter' as ProspectType,
    grades: {},
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProspectProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home filters={filters} onFilterChange={setFilters} />} />
              <Route path="/prospects" element={<Navigate to="/prospects/hitters" replace />} />
              <Route path="/prospects/:type" element={<ProspectRankings />} />
              <Route path="/player/:name" element={<PlayerPage />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ProspectProvider>
    </ThemeProvider>
  );
}

export default App;