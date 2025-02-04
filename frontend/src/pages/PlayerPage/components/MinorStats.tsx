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

interface MinorStatsProps {
  player: Prospect;
}

const isPitcher = (player: Prospect): player is PitcherProspect => {
  return (player as PitcherProspect).FB !== undefined;
};

const formatPercent = (value: number | undefined) => {
  if (value === undefined) return '---';
  return `${(value * 100).toFixed(1)}%`;
};

const MinorStats: React.FC<MinorStatsProps> = ({ player }) => {
    console.log("Player data:", player);
    console.log("Is pitcher:", isPitcher(player));
  const renderHitterStats = (player: HitterProspect) => (
    <TableBody>
      <TableRow>
        <TableCell>2024</TableCell>
        <TableCell align="right">{player.PA || '---'}</TableCell>
        <TableCell align="right">{typeof player.OBP === 'number' ? player.OBP.toFixed(3) : '---'}</TableCell>
        <TableCell align="right">{typeof player.SLG === 'number' ? player.SLG.toFixed(3) : '---'}</TableCell>
        <TableCell align="right">{typeof player.ISO === 'number' ? player.ISO.toFixed(3) : '---'}</TableCell>
        <TableCell align="right">{formatPercent(player.BB_pct)}</TableCell>
        <TableCell align="right">{formatPercent(player.K_pct)}</TableCell>
        <TableCell align="right">{player.wRC_plus || '---'}</TableCell>
      </TableRow>
    </TableBody>
  );

  const renderPitcherStats = (player: PitcherProspect) => (
    <TableBody>
      <TableRow>
        <TableCell>2024</TableCell>
        <TableCell align="right">{typeof player.IP === 'number' ? player.IP.toFixed(1) : '---'}</TableCell>
        <TableCell align="right">{formatPercent(player.K_pct)}</TableCell>
        <TableCell align="right">{formatPercent(player.BB_pct)}</TableCell>
        <TableCell align="right">{formatPercent(player.GB_pct)}</TableCell>
        <TableCell align="right">{typeof player.ERA === 'number' ? player.ERA.toFixed(2) : '---'}</TableCell>
        <TableCell align="right">{typeof player.xFIP === 'number' ? player.xFIP.toFixed(2) : '---'}</TableCell>
      </TableRow>
    </TableBody>
  );

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Minor League Statistics
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Level</TableCell>
            {isPitcher(player) ? (
              <>
                <TableCell align="right">IP</TableCell>
                <TableCell align="right">K%</TableCell>
                <TableCell align="right">BB%</TableCell>
                <TableCell align="right">GB%</TableCell>
                <TableCell align="right">ERA</TableCell>
                <TableCell align="right">xFIP</TableCell>
              </>
            ) : (
              <>
                <TableCell align="right">PA</TableCell>
                <TableCell align="right">OBP</TableCell>
                <TableCell align="right">SLG</TableCell>
                <TableCell align="right">ISO</TableCell>
                <TableCell align="right">BB%</TableCell>
                <TableCell align="right">K%</TableCell>
                <TableCell align="right">wRC+</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        {isPitcher(player) ? renderPitcherStats(player) : renderHitterStats(player as HitterProspect)}
      </Table>
    </TableContainer>
  );
};

export default MinorStats;