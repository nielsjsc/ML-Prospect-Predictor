import { GridColDef } from '@mui/x-data-grid';
import { HITTER_GRADES, PITCHER_GRADES } from '../../../constants/grades';
import { HitterProspect, PitcherProspect } from '../../../types/prospects';

const formatConfidence = (value: number, lower: number, upper: number) => {
  return `${value.toFixed(1)} (${lower.toFixed(1)} - ${upper.toFixed(1)})`;
};

export const getHitterColumns = (): GridColDef[] => [
  { field: 'Name', headerName: 'Name', width: 150, flex: 1 },
  { field: 'Age', headerName: 'Age', width: 90 },
  { field: 'Organization', headerName: 'Team', width: 100 },
  { field: 'Top_100', headerName: 'Top 100', width: 110 },
  { 
    field: 'Predicted_WAR',
    headerName: 'Predicted WAR',
    width: 200,
    valueGetter: (params: { row: HitterProspect }) => formatConfidence(
      params.row.Predicted_WAR,
      params.row.Predicted_WAR_Lower,
      params.row.Predicted_WAR_Upper
    )
  },
  { 
    field: 'Predicted_wRC',
    headerName: 'Predicted wRC+',
    width: 200,
    valueGetter: (params: { row: HitterProspect }) => formatConfidence(
      params.row.Predicted_wRC,
      params.row.Predicted_wRC_Lower,
      params.row.Predicted_wRC_Upper
    )
  },
  ...HITTER_GRADES.map(({ field, label }) => ({
    field,
    headerName: label,
    width: 110
  }))
];

export const getPitcherColumns = (): GridColDef[] => [
    { field: 'Name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'Age', headerName: 'Age', width: 90 },
    { field: 'Organization', headerName: 'Team', width: 100 },
    { field: 'Top_100', headerName: 'Top 100', width: 110 },
    { 
      field: 'Predicted_WAR',
      headerName: 'Predicted WAR',
      width: 200,
      valueGetter: (params: { row: PitcherProspect }) => formatConfidence(
        params.row.Predicted_WAR,
        params.row.Predicted_WAR_Lower,
        params.row.Predicted_WAR_Upper
      )
    },
    { 
      field: 'Predicted_ERA',
      headerName: 'Predicted ERA',
      width: 200,
      valueGetter: (params: { row: PitcherProspect }) => formatConfidence(
        params.row.Predicted_ERA,
        params.row.Predicted_ERA_Lower,
        params.row.Predicted_ERA_Upper
      )
    },
    ...PITCHER_GRADES.map(({ field, label }) => ({
      field,
      headerName: label,
      width: 110
    }))
  ];