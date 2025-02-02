import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ProspectType } from '../../types';

interface ProspectTypeSwitchProps {
  value: ProspectType;
  onChange: (type: ProspectType) => void;
}

const ProspectTypeSwitch: React.FC<ProspectTypeSwitchProps> = ({ value, onChange }) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: ProspectType | null
  ) => {
    if (newType !== null) {
      onChange(newType);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="prospect type"
      size="small"
      sx={{
        backgroundColor: 'background.paper',
        '& .MuiToggleButton-root.Mui-selected': {
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        },
      }}
    >
      <ToggleButton value="hitter">
        Hitters
      </ToggleButton>
      <ToggleButton value="pitcher">
        Pitchers
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ProspectTypeSwitch;