import React, { useState, useCallback } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash/debounce';
import type { DebouncedFunc } from 'lodash';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      onChange(value);
    }, 300),
    [onChange]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <TextField
      value={localValue}
      onChange={handleChange}
      placeholder="Search prospects..."
      variant="outlined"
      size="small"
      sx={{ width: { xs: '100%', sm: 250 } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: localValue && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default SearchFilter;