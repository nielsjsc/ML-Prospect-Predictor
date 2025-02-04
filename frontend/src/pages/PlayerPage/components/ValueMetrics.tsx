import React from 'react';
import { Paper, Typography, Box, Tooltip } from '@mui/material';
import { Prospect } from '../../../types/prospects';

interface ValueMetricsProps {
  player: Prospect;
}

const calculateValue = (war: number): string => {
  const dollarPerWAR = 8000000; // $8M per WAR
  const value = war * dollarPerWAR;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

const ValueMetrics: React.FC<ValueMetricsProps> = ({ player }) => {
  const projectedValue = calculateValue(player.Predicted_WAR);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Projected Value
      </Typography>
      <Tooltip title="Based on $8M per WAR market rate">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100px'
        }}>
          <Typography variant="h4" color="primary">
            {projectedValue}
          </Typography>
        </Box>
      </Tooltip>
    </Paper>
  );
};

export default ValueMetrics;