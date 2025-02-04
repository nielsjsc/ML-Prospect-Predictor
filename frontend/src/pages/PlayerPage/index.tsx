import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import  ScoutingRadar  from './components/ScoutingRadar';
import ProjectedStats from './components/ProjectedStats';
import MinorStats from './components/MinorStats';
import ValueMetrics from './components/ValueMetrics';
import { useProspects } from '../../context/ProspectContext';
import { Prospect } from '../../types/prospects';

const PlayerPage: React.FC = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { prospects } = useProspects();
  
  const player = React.useMemo(() => 
    prospects.find(p => p.Name === name),
    [prospects, name]
  );
  const formatRankings = (player: Prospect) => {
    const rankings = [];
    if (player.Top_100 != 250) {
      rankings.push(`#${player.Top_100} Prospect`);
    }
    if (player.Org_Rk) {
      rankings.push(`#${player.Org_Rk} ${player.Org}`);
    }
    return rankings.join(' | ');
  };

  React.useEffect(() => {
    if (!player && prospects.length > 0) {
      navigate('/prospects');
    }
  }, [player, prospects, navigate]);

  if (!player) return (
    <Container>
      <Typography variant="h5">Loading...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {player.Name} - {player.Org} ({player.Pos})
          </Typography>
          {/* Add Rankings Typography */}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {formatRankings(player)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <ScoutingRadar player={player} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <ProjectedStats player={player} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <MinorStats player={player} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <ValueMetrics player={player} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlayerPage;