import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography 
} from '@mui/material';
import { Prospect, HitterProspect, PitcherProspect } from '../../../types/prospects';

interface ProjectedStatsProps {
  player: Prospect;
}

const isPitcher = (player: Prospect): player is PitcherProspect => {
  return (player as PitcherProspect).FB !== undefined;
};

const ProjectedStats: React.FC<ProjectedStatsProps> = ({ player }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Projected Stats Per Year (Averages) While Under Team Control (6 Years)
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell align="right">Projection</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>WAR</TableCell>
            <TableCell align="right">{player.Predicted_WAR.toFixed(1)}</TableCell>
          </TableRow>
          {isPitcher(player) ? (
            <TableRow>
              <TableCell>ERA</TableCell>
              <TableCell align="right">{player.Predicted_ERA.toFixed(2)}</TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell>wRC+</TableCell>
              <TableCell align="right">{(player as HitterProspect).Predicted_wRC}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectedStats;