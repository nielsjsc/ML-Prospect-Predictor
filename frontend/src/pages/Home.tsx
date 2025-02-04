import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProspectFilters } from '../types/filters';

interface HomeProps {
  filters: ProspectFilters;
  onFilterChange: (filters: ProspectFilters) => void;
}

const Home: React.FC<HomeProps> = ({ filters, onFilterChange }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: '#041E42', color: 'white', borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom>
          Baseball Prospect Predictor
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Leverage machine learning to predict prospect performance
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ p: 3, cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' } }}
            onClick={() => {
              onFilterChange({ ...filters, type: 'hitter' });
              navigate('/prospects/hitters');
            }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              Hitting Prospects
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              View WAR and wRC+ predictions for top hitting prospects
            </Typography>
            <Button variant="contained" color="primary">
              View Hitters
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ p: 3, cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' } }}
            onClick={() => {
              onFilterChange({ ...filters, type: 'pitcher' });
              navigate('/prospects/pitchers');
            }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              Pitching Prospects
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Explore WAR and ERA predictions for pitching prospects
            </Typography>
            <Button variant="contained" color="primary">
              View Pitchers
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;