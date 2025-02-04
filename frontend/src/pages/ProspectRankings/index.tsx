import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { ProspectFilters, ProspectType } from '../../types/filters';
import { useProspects as useProspectsAPI } from './hooks/useProspects';
import { useProspects as useProspectsContext } from '../../context/ProspectContext';
import { useSortFilter } from './hooks/useSortFilter';
import TableHeader from './components/TableHeader';
import TableToolbar from './components/TableToolbar';
import TableContainer from './components/TableContainer';
import FilterDrawer from './components/FilterDrawer';

const ProspectRankings: React.FC = () => {
  const { type } = useParams<{ type?: string }>();  // Remove default value
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProspectFilters>({
    type: type === 'pitchers' ? 'pitcher' : 'hitter',  // Will now properly read URL param
    grades: {}
  });

  const { prospects, loading, error, refreshData } = useProspectsAPI(filters);
  const { setProspects } = useProspectsContext();
  const { filteredProspects, sortConfig, handleSort } = useSortFilter(prospects, filters);

  useEffect(() => {
    if (prospects.length > 0) {
      setProspects(prospects);
    }
  }, [prospects, setProspects]);

  useEffect(() => {
    const newType = type === 'pitchers' ? 'pitcher' : 'hitter';
    if (filters.type !== newType) {
      setFilters(prev => ({
        ...prev,
        type: newType
      }));
    }
  }, [type]);

  const handleFilterChange = (newFilters: ProspectFilters) => {
    const newType = newFilters.type;
    const urlType = newType === 'pitcher' ? 'pitchers' : 'hitters';
    if (type !== urlType) {
      navigate(`/prospects/${urlType}`);
    }
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
          showFilters={showFilters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
  
        <TableContainer
          prospects={filteredProspects}
          type={filters.type}
          loading={loading}
          error={error}
          onSortChange={handleSort}
          sortConfig={sortConfig}
        />
  
        <FilterDrawer
          open={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Box>
    </Container>
  );
};

export default ProspectRankings;