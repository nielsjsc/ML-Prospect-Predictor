import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { 
  ProspectFilters, 
  ProspectType, 
  RangeFilter,
  GradeRange
} from '../../types/filters';
import ProspectTypeSwitch from './ProspectTypeSwitch';
import OrganizationSelect from './OrganizationSelect';
import GradesFilter from './GradesFilter';
import AgeFilter from './AgeFilter';
import SearchFilter from './SearchFilter';

interface FiltersProps {
  filters: ProspectFilters;
  onFilterChange: (filters: ProspectFilters) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const handleTypeChange = (type: ProspectType) => {
    onFilterChange({ 
      ...filters, 
      type,
      grades: {} // Reset grades when switching type
    });
  };

  const handleOrgChange = (organization: string) => {
    onFilterChange({ ...filters, organization });
  };

  const handleAgeChange = (age: RangeFilter) => {
    onFilterChange({ ...filters, age });
  };

  const handleGradeChange = (field: string, value: GradeRange) => {
    onFilterChange({
      ...filters,
      grades: { ...filters.grades, [field]: value }
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    onFilterChange({ ...filters, searchTerm });
  };

  const defaultGrades = filters.grades || {};

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ProspectTypeSwitch 
              value={filters.type} 
              onChange={handleTypeChange}
            />
            <SearchFilter 
              value={filters.searchTerm || ''} 
              onChange={handleSearchChange}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <OrganizationSelect 
            value={filters.organization || ''} 
            onChange={handleOrgChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <AgeFilter 
            value={filters.age || { min: 16, max: 35 }} 
            onChange={handleAgeChange}
          />
        </Grid>
        <Grid item xs={12}>
          <GradesFilter 
            type={filters.type}
            grades={defaultGrades}
            onChange={handleGradeChange}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Filters;