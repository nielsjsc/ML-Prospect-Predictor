import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { MLB_TEAMS } from '../../constants/teams';

interface OrganizationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const OrganizationSelect: React.FC<OrganizationSelectProps> = ({ value, onChange }) => {
  const selectedTeam = MLB_TEAMS.find(team => team.id === value) || null;

  return (
    <Autocomplete
      value={selectedTeam}
      onChange={(_, newValue) => onChange(newValue?.id || '')}
      options={MLB_TEAMS}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Organization"
          size="small"
          placeholder="Select team..."
        />
      )}
      sx={{ minWidth: 200 }}
    />
  );
};

export default OrganizationSelect;