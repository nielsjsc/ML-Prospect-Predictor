import React from 'react';
import { Box, Slider, Typography, Grid } from '@mui/material';
import { ProspectType } from '../../types';

interface GradeRange {
  min: number;
  max: number;
}

interface GradesFilterProps {
  type: ProspectType;
  grades: Record<string, GradeRange>;
  onChange: (field: string, value: GradeRange) => void;
}

const HITTER_GRADES = [
  { field: 'Hit_future', label: 'Hit' },
  { field: 'Game_future', label: 'Game Power' },
  { field: 'Raw_future', label: 'Raw Power' },
  { field: 'Spd_future', label: 'Speed' }
];

const PITCHER_GRADES = [
  { field: 'FB_future', label: 'Fastball' },
  { field: 'SL_future', label: 'Slider' },
  { field: 'CB_future', label: 'Curveball' },
  { field: 'CH_future', label: 'Changeup' },
  { field: 'CMD_future', label: 'Command' }
];

const GradesFilter: React.FC<GradesFilterProps> = ({ type, grades, onChange }) => {
  const gradeFields = type === 'hitter' ? HITTER_GRADES : PITCHER_GRADES;

  const handleChange = (field: string) => (_event: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      onChange(field, { min: value[0], max: value[1] });
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Scouting Grades
      </Typography>
      <Grid container spacing={3}>
        {gradeFields.map(({ field, label }) => (
          <Grid item xs={12} sm={6} key={field}>
            <Typography variant="body2" gutterBottom>
              {label}
            </Typography>
            <Slider
              value={[grades[field]?.min || 20, grades[field]?.max || 80]}
              onChange={handleChange(field)}
              valueLabelDisplay="auto"
              min={20}
              max={80}
              step={5}
              marks
              sx={{ width: '90%' }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GradesFilter;