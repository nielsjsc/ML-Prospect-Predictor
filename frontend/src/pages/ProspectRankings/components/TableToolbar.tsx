import React from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Tooltip,
  Button,
  ButtonGroup
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { ProspectFilters } from '../../../types/filters';

interface TableToolbarProps {
  filters: ProspectFilters;
  onFilterChange: (filters: ProspectFilters) => void;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  filters,
  onFilterChange,
  onSearchChange,
  onToggleFilters
}) => {
  return (
    <Box sx={{ 
      p: 1, 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search prospects..."
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
          sx={{ width: 250 }}
        />
        
        <ButtonGroup size="small">
          <Button
            variant={filters.type === 'hitter' ? 'contained' : 'outlined'}
            onClick={() => onFilterChange({ ...filters, type: 'hitter' })}
          >
            Hitters
          </Button>
          <Button
            variant={filters.type === 'pitcher' ? 'contained' : 'outlined'}
            onClick={() => onFilterChange({ ...filters, type: 'pitcher' })}
          >
            Pitchers
          </Button>
        </ButtonGroup>
      </Box>

      <Box>
        <Tooltip title="Show filters">
          <IconButton onClick={onToggleFilters}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TableToolbar;