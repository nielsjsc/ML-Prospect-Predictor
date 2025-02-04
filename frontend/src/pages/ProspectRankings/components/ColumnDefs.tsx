import React from 'react';
import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

export const getHitterColumns = (): GridColDef[] => [
  { 
    field: 'Name', 
    headerName: 'Name', 
    width: 150, 
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Link to={`/player/${params.value}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {params.value}
      </Link>
    )
  },
  { field: 'Age', headerName: 'Age', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Org', headerName: 'Team', width: 100, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Top 100', headerName: 'Top 100', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Org Rk', headerName: 'Org Rank', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Pos', headerName: 'Position', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Predicted_WAR', headerName: 'Projected WAR', width: 140, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Predicted_wRC', headerName: 'Projected wRC+', width: 140, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Hit', headerName: 'Hit', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Game', headerName: 'Game', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Raw', headerName: 'Raw', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Spd', headerName: 'Speed', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'FV', headerName: 'FV', width: 70, renderCell: (params) => params.value ?? 'N/A' }
];

export const getPitcherColumns = (): GridColDef[] => [
  { 
    field: 'Name', 
    headerName: 'Name', 
    width: 150, 
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      return React.createElement(Link, {
        to: `/player/${params.value}`,
        style: { textDecoration: 'none', color: 'inherit' }
      }, params.value);
    }
  },
  { field: 'Age', headerName: 'Age', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Org', headerName: 'Team', width: 100, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Top 100', headerName: 'Top 100', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Org Rk', headerName: 'Org Rank', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Pos', headerName: 'Position', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Predicted_WAR', headerName: 'Projected WAR', width: 140, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'Predicted_ERA', headerName: 'Projected ERA', width: 140, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'FB', headerName: 'FB', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'SL', headerName: 'SL', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'CB', headerName: 'CB', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'CH', headerName: 'CH', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'CMD', headerName: 'CMD', width: 90, renderCell: (params) => params.value ?? 'N/A' },
  { field: 'FV', headerName: 'FV', width: 70, renderCell: (params) => params.value ?? 'N/A' }
];