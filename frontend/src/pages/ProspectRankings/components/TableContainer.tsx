import React, { useState } from 'react';
import { Paper, LinearProgress } from '@mui/material';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';
import { Prospect } from '../../../types/prospects';
import { SortConfig } from '../../../types/sorts';
import { getHitterColumns, getPitcherColumns } from './ColumnDefs';

interface TableContainerProps {
  prospects: Prospect[];
  type: 'hitter' | 'pitcher';
  loading: boolean;
  error?: string | null;
  onSortChange: (field: keyof Prospect) => void;
  sortConfig: SortConfig;
}

const TableContainer: React.FC<TableContainerProps> = (props) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const columns = props.type === 'hitter' ? getHitterColumns() : getPitcherColumns();

  return (
    <Paper sx={{ height: 650, width: '100%' }}>
      {props.loading && (
        <LinearProgress sx={{ position: 'absolute', top: 0, width: '100%', zIndex: 1 }} />
      )}
      <DataGrid
        rows={props.prospects}
        columns={columns}
        getRowId={(row) => row.Name}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        loading={props.loading}
        sortingMode="client"
        onSortModelChange={(model) => {
          if (model.length > 0) {
            props.onSortChange(model[0].field as keyof Prospect);
          }
        }}
        initialState={{
          sorting: {
            sortModel: [{
              field: props.sortConfig.field,
              sort: props.sortConfig.direction
            }]
          }
        }}
      />
    </Paper>
  );
};

export default TableContainer;