import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#041E42',  // MLB Blue
        marginBottom: 2 
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          MLB Prospect Predictor
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/predictions/hitters"
            sx={{ 
              backgroundColor: location.pathname === '/predictions/hitters' 
                ? 'rgba(255,255,255,0.1)' 
                : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            Hitters
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/predictions/pitchers"
            sx={{ 
              backgroundColor: location.pathname === '/predictions/pitchers' 
                ? 'rgba(255,255,255,0.1)' 
                : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            Pitchers
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/about"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;