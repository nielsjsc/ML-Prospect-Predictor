import React from 'react';
import { Box, Paper, LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Prospect } from '../../../types/prospects';
import { getHitterColumns, getPitcherColumns } from './ColumnDefs';

interface TableContainerProps {
  prospects: Prospect[];
  type: 'hitter' | 'pitcher';
  loading: boolean;
  error?: string | null;  // Update to allow null
}

const TableContainer: React.FC<TableContainerProps> = ({
  prospects,
  type,
  loading,
  error
}) => {
  const columns = type === 'hitter' ? getHitterColumns() : getPitcherColumns();

  return (
    <Paper sx={{ height: 600, width: '100%', position: 'relative' }}>
      {loading && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            width: '100%', 
            zIndex: 1 
          }} 
        />
      )}
      <DataGrid
        rows={prospects}
        columns={columns}
        getRowId={(row) => row.Name}
        loading={loading}
        pagination
        paginationModel={{ page: 0, pageSize: 25 }}
        pageSizeOptions={[10, 25, 50, 100]}
        sortingMode="server"
        filterMode="server"
        disableColumnFilter
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
            backgroundColor: 'action.hover',
          },
        }}
      />
    </Paper>
  );
};

export default TableContainer;