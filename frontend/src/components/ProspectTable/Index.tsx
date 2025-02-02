import React from 'react';
import { 
  DataGrid, 
  GridColDef, 
} from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { Prospect, HitterProspect, PitcherProspect } from '../../types/prospects';

interface ProspectTableProps {
  prospects: Prospect[];
  type: 'hitter' | 'pitcher';
  loading: boolean;
}

const getHitterColumns = (): GridColDef[] => [
  { field: 'Name', headerName: 'Name', width: 150 },
  { field: 'Age', headerName: 'Age', width: 90 },
  { field: 'Organization', headerName: 'Team', width: 100 },
  { field: 'Top_100', headerName: 'Top 100', width: 110 },
  { field: 'Predicted_WAR', headerName: 'Pred. WAR', width: 130 },
  { field: 'Predicted_wRC', headerName: 'Pred. wRC+', width: 130 },
  { field: 'Hit_future', headerName: 'Hit', width: 90 },
  { field: 'Game_future', headerName: 'Game Power', width: 110 },
  { field: 'Raw_future', headerName: 'Raw Power', width: 110 },
  { field: 'Spd_future', headerName: 'Speed', width: 90 }
];

const getPitcherColumns = (): GridColDef[] => [
  { field: 'Name', headerName: 'Name', width: 150 },
  { field: 'Age', headerName: 'Age', width: 90 },
  { field: 'Organization', headerName: 'Team', width: 100 },
  { field: 'Top_100', headerName: 'Top 100', width: 110 },
  { field: 'Predicted_WAR', headerName: 'Pred. WAR', width: 130 },
  { field: 'Predicted_ERA', headerName: 'Pred. ERA', width: 130 },
  { field: 'FB_future', headerName: 'FB', width: 90 },
  { field: 'SL_future', headerName: 'SL', width: 90 },
  { field: 'CB_future', headerName: 'CB', width: 90 },
  { field: 'CH_future', headerName: 'CH', width: 90 },
  { field: 'CMD_future', headerName: 'CMD', width: 90 }
];

const ProspectTable: React.FC<ProspectTableProps> = ({ 
  prospects, 
  type,
  loading 
}) => {
  const columns = type === 'hitter' ? getHitterColumns() : getPitcherColumns();

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={prospects}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.Name}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
          sorting: {
            sortModel: [{ field: 'Predicted_WAR', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
};

export default ProspectTable;