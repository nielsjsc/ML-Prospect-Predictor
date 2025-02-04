import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Box, useTheme } from '@mui/material';
import { Prospect,PitcherProspect } from '../../../types/prospects';

interface ScoutingRadarProps {
  player: Prospect;
}

const isPitcher = (player: Prospect): player is PitcherProspect => {
  return (player as PitcherProspect).FB !== undefined;
};

const extractGradeValue = (gradeString: string | number): number => {
  if (!gradeString) return 20;
  if (typeof gradeString === 'number') return gradeString;
  const parts = gradeString.split('/');
  if (parts.length === 2) {
    return parseInt(parts[1].trim());
  }
  return parseInt(gradeString);
};

const ScoutingRadar: React.FC<ScoutingRadarProps> = ({ player }) => {
  const theme = useTheme();

  const formatGrades = () => {
    const grades = isPitcher(player) ? [
      { subject: 'Fastball', value: extractGradeValue(player.FB), average:  50},
      { subject: 'Slider', value: extractGradeValue(player.SL), average: 55 },
      { subject: 'Curveball', value: extractGradeValue(player.CB), average: 55 },
      { subject: 'Changeup', value: extractGradeValue(player.CH), average: 50 },
      { subject: 'Command', value: extractGradeValue(player.CMD), average: 45 }
    ] : [
      { subject: 'Hit', value: extractGradeValue(player.Hit), average: 45 },
      { subject: 'Game Power', value: extractGradeValue(player.Game), average: 45 },
      { subject: 'Raw Power', value: extractGradeValue(player.Raw), average: 50 },
      { subject: 'Speed', value: extractGradeValue(player.Spd), average: 50 },
      { subject: 'Future Value', value: parseInt(player.FV), average: 45 }
    ];
    return grades;
  };

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <RadarChart data={formatGrades()}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={90} domain={[20, 80]} />
          <Radar
            name="MLB Average"
            dataKey="average"
            stroke="#ff0000"
            fill="#ff0000"
            fillOpacity={0}
          />
          <Radar
            name="Player Grades"
            dataKey="value"
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.main}
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ScoutingRadar;