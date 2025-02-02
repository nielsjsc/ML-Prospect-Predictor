import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Home from './pages/Home';
import { ProspectFilters, ProspectType } from './types/filters';

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
  const [filters, setFilters] = useState<ProspectFilters>(initialFilters);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home filters={filters} onFilterChange={setFilters} />} />
            {/* Add other routes */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;