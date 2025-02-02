import React from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { RangeFilter } from '../../types';

interface AgeFilterProps {
  value: RangeFilter;
  onChange: (range: RangeFilter) => void;
}

const MIN_AGE = 16;
const MAX_AGE = 35;

const AgeFilter: React.FC<AgeFilterProps> = ({ value, onChange }) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onChange({ min: newValue[0], max: newValue[1] });
    }
  };

  return (
    <Box sx={{ width: 200, px: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Age Range
      </Typography>
      <Slider
        value={[value.min || MIN_AGE, value.max || MAX_AGE]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={MIN_AGE}
        max={MAX_AGE}
        marks={[
          { value: MIN_AGE, label: MIN_AGE },
          { value: MAX_AGE, label: MAX_AGE }
        ]}
        sx={{
          '& .MuiSlider-valueLabel': {
            backgroundColor: 'primary.main',
          }
        }}
      />
    </Box>
  );
};

export default AgeFilter;