import React from 'react';
import { Container, Typography, Paper, Grid, Box, Divider } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        MLB Prospect Predictor
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Project Overview
            </Typography>
            <Typography paragraph>
              The MLB Prospect Predictor combines machine learning and baseball analytics to project 
              future performance of baseball prospects. By analyzing minor league statistics and scouting grades, 
              our system provides insights into player development and potential MLB performance.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Technical Implementation
            </Typography>
            <Typography paragraph>
              Built with React and Material UI, our application provides an intuitive interface for 
              accessing prospect projections. The machine learning models, trained using Google Vertex AI, 
              process historical minor league statistics and scouting assessments to generate predictions 
              for future MLB performance.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Features
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Performance Projections</Typography>
                  <Typography>
                    • WAR (Wins Above Replacement) predictions<br />
                    • wRC+ projections for hitters<br />
                    • ERA and related metrics for pitchers
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Scouting Analysis</Typography>
                  <Typography>
                    • Interactive radar charts for scouting grades<br />
                    • Tool-specific projections<br />
                    • Comparative analysis with MLB averages
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Technologies
            </Typography>
            <Typography paragraph>
              • React with Material UI for component-based interface<br />
              • Google Vertex AI for machine learning model training<br />
              • Python with statistical libraries for data processing<br />
              • Recharts for data visualization
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Model Details</Typography>
            <Typography>
              Our machine learning models analyze historical minor league performance and 
              scouting assessments to generate MLB projections. The system considers both 
              statistical performance and traditional scouting wisdom to provide comprehensive 
              player evaluations.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;