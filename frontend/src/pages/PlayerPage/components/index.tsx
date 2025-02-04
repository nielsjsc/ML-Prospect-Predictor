import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Prospect } from '../../../types/prospects';
import ScoutingRadar from './ScoutingRadar';
import ProjectedStats from './ProjectedStats';
import MinorStats from './MinorStats';
import ValueMetrics from './ValueMetrics';

interface PlayerDetailProps {
  player: Prospect;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ player }) => {
  return (
    <Paper sx={{ p: 2, m: 1, width: '100%' }}>
      <Grid container spacing={2}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Typography variant="h6">
            {player.Name} ({player.Org}) - {player.Pos}
          </Typography>
        </Grid>

        {/* Left Section - Scouting Radar Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300, p: 2 }}>
            <ScoutingRadar player={player} />
          </Box>
        </Grid>

        {/* Right Section - Projected Stats */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300, p: 2 }}>
            <ProjectedStats player={player} />
          </Box>
        </Grid>

        {/* Minor League Stats */}
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}>
            <MinorStats player={player} />
          </Box>
        </Grid>

        {/* Value Metrics */}
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}>
            <ValueMetrics player={player} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PlayerDetail;