import React from 'react';
import { Box, Container } from '@mui/material';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: '#f5f5f5'  // Light gray background
      }}
    >
      <Navigation />
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1, 
          py: 3,
          px: { xs: 2, sm: 3 },  // Responsive padding
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          textAlign: 'center',
          bgcolor: '#041E42',  
          color: 'white',
          mt: 'auto'
        }}
      >
        Baseball Prospect Predictor
      </Box>
    </Box>
  );
};

export default Layout;