import { useState, useCallback } from 'react';
import { Prospect } from '../../../types/prospects';
import { ProspectFilters } from '../../../types/filters';
import { sortProspects, filterProspects } from '../utils/tableHelpers';

interface SortConfig {
  field: keyof Prospect;
  direction: 'asc' | 'desc';
}

interface UseSortFilterReturn {
  sortConfig: SortConfig;
  handleSort: (field: keyof Prospect) => void;
  filteredProspects: Prospect[];
}

export const useSortFilter = (
  prospects: Prospect[],
  filters: ProspectFilters
): UseSortFilterReturn => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'Predicted_WAR',
    direction: 'desc'
  });

  const handleSort = useCallback((field: keyof Prospect) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  const filteredProspects = filterProspects(
    sortProspects(prospects, sortConfig.field, sortConfig.direction),
    filters
  );

  return {
    sortConfig,
    handleSort,
    filteredProspects
  };
};