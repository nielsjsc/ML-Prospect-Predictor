import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  ButtonGroup,
  Chip 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TableViewIcon from '@mui/icons-material/TableView';
import GridViewIcon from '@mui/icons-material/GridView';
import { Prospect } from '../../../types/prospects';
import { exportToCSV } from '../utils/tableHelpers';

interface TableHeaderProps {
  type: 'hitter' | 'pitcher';
  prospects: Prospect[];
  viewType: 'table' | 'grid';
  onViewChange: (view: 'table' | 'grid') => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  type,
  prospects,
  viewType,
  onViewChange
}) => {
  const handleExport = () => {
    exportToCSV(prospects, `${type}_prospects.csv`);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 3 
    }}>
      <Box>
        <Typography variant="h5" component="h1">
          {type === 'hitter' ? 'Hitting' : 'Pitching'} Prospects
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip 
            label={`${prospects.length} prospects`} 
            size="small" 
            sx={{ mr: 1 }} 
          />
          <Chip 
            label={`${prospects.filter(p => p.Top_100 <= 100).length} in Top 100`}
            size="small"
            color="primary"
          />
        </Box>
      </Box>

      <Box>
        <ButtonGroup size="small" sx={{ mr: 2 }}>
          <Button
            variant={viewType === 'table' ? 'contained' : 'outlined'}
            onClick={() => onViewChange('table')}
            startIcon={<TableViewIcon />}
          >
            Table
          </Button>
          <Button
            variant={viewType === 'grid' ? 'contained' : 'outlined'}
            onClick={() => onViewChange('grid')}
            startIcon={<GridViewIcon />}
          >
            Grid
          </Button>
        </ButtonGroup>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;