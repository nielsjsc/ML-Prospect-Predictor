import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormGroup,
} from '@mui/material';
import {Organization, MLB_ORGANIZATIONS, RangeFilter } from '../../../types/filters';
import { ProspectFilters, HitterGrade, PitcherGrade } from '../../../types/filters';

const HITTER_GRADES: HitterGrade[] = ['Hit', 'Game', 'Raw', 'Spd'];
const PITCHER_GRADES: PitcherGrade[] = ['FB', 'SL', 'CB', 'CH', 'CMD'];

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: ProspectFilters;
  onFilterChange: (filters: ProspectFilters) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  filters,
  onFilterChange,
}) => {
  const handleAgeChange = (_: Event, newValue: number | number[]) => {
    onFilterChange({
      ...filters,
      age: { min: (newValue as number[])[0], max: (newValue as number[])[1] }
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Organization</InputLabel>
            <Select<Organization | ''>
                value={filters.organization || ''}
                onChange={(e) => onFilterChange({
                ...filters,
                organization: e.target.value as Organization | undefined
                })}
            >
                <MenuItem value="">All</MenuItem>
                {MLB_ORGANIZATIONS.map(org => (
                <MenuItem key={org} value={org}>{org}</MenuItem>
                ))}
            </Select>
            </FormControl>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>Age Range</Typography>
          <Slider
            value={[filters.age?.min || 18, filters.age?.max || 25]}
            onChange={handleAgeChange}
            valueLabelDisplay="auto"
            min={18}
            max={25}
          />
        </Box>

        {filters.type === 'hitter' ? (
        <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Hitting Grades</Typography>
            {HITTER_GRADES.map(grade => (
            <Box key={grade} sx={{ mt: 2 }}>
                <Typography variant="body2">{grade}</Typography>
                <Slider
                    value={[
                        filters.grades[grade]?.min || 20,
                        filters.grades[grade]?.max || 80
                    ]}
                    onChange={(event: Event, value: number | number[], activeThumb: number) => onFilterChange({
                        ...filters,
                        grades: {
                        ...filters.grades,
                        [grade]: { 
                            min: Array.isArray(value) ? value[0] : 20,
                            max: Array.isArray(value) ? value[1] : 80 
                        }
                        }
                    })}
                    valueLabelDisplay="auto"
                    min={20}
                    max={80}
                    step={5}
                    />
            </Box>
            ))}
        </Box>
        ) : (
        <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Pitching Grades</Typography>
            {PITCHER_GRADES.map(grade => (
              <Box key={grade} sx={{ mt: 2 }}>
                <Typography variant="body2">{grade}</Typography>
                <Slider
                    value={[
                        filters.grades[grade]?.min || 20,
                        filters.grades[grade]?.max || 80
                    ]}
                    onChange={(event: Event, value: number | number[], activeThumb: number) => onFilterChange({
                        ...filters,
                        grades: {
                        ...filters.grades,
                        [grade]: { 
                            min: Array.isArray(value) ? value[0] : 20,
                            max: Array.isArray(value) ? value[1] : 80 
                        }
                        }
                    })}
                    valueLabelDisplay="auto"
                    min={20}
                    max={80}
                    step={5}
                    />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;