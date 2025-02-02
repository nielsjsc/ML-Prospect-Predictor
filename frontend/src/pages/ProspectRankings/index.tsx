import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { ProspectFilters } from '../../types/filters';
import { useProspects } from './hooks/useProspects';
import { useSortFilter } from './hooks/useSortFilter';
import TableHeader from './components/TableHeader';
import TableToolbar from './components/TableToolbar';
import TableContainer from './components/TableContainer';

const ProspectRankings: React.FC = () => {
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<ProspectFilters>({
    type: 'hitter',
    grades: {}
  });

  const { prospects, loading, error, refreshData } = useProspects(filters);
  const { sortConfig, handleSort, filteredProspects } = useSortFilter(prospects, filters);

  const handleFilterChange = (newFilters: ProspectFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <TableHeader
          type={filters.type}
          prospects={filteredProspects}
          viewType={viewType}
          onViewChange={setViewType}
        />

        <TableToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <TableContainer
          prospects={filteredProspects}
          type={filters.type}
          loading={loading}
          error={error}
        />
      </Box>
    </Container>
  );
};

export default ProspectRankings;