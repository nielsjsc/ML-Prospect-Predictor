import { useState, useMemo } from 'react';
import { Prospect } from '../../../types/prospects';
import { ProspectFilters } from '../../../types/filters';
import { SortConfig } from '../../../types/sorts';

interface UseSortFilterReturn {
  sortConfig: SortConfig;
  handleSort: (field: keyof Prospect) => void;
  filteredProspects: Prospect[];
}

const extractFutureGrade = (gradeString: string): number => {
  if (!gradeString) return 0;
  if (!gradeString.includes('/')) return parseInt(gradeString);
  return parseInt(gradeString.split('/')[1].trim());
};

export const useSortFilter = (prospects: Prospect[], filters: ProspectFilters): UseSortFilterReturn => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'Predicted_WAR',
    direction: 'desc'
  });

  const handleSort = (field: keyof Prospect) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortProspects = (a: Prospect, b: Prospect) => {
    const field = sortConfig.field as keyof Prospect;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    // Handle 'N/A' values - always push to bottom
    if (a[field] === 'N/A' && b[field] !== 'N/A') return 1;
    if (a[field] !== 'N/A' && b[field] === 'N/A') return -1;
    if (a[field] === 'N/A' && b[field] === 'N/A') return 0;

    // Normal sorting
    if (a[field] < b[field]) return -1 * direction;
    if (a[field] > b[field]) return 1 * direction;
    return 0;
  };

  const filteredProspects = useMemo(() => {
    return prospects
      .filter(prospect => {
        // Search term filter
        if (filters.searchTerm && 
            !prospect.Name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          return false;
        }

        // Organization filter
        if (filters.organization && prospect.Org !== filters.organization) {
          return false;
        }

        // Grade filters
        for (const [grade, range] of Object.entries(filters.grades)) {
          if (!range) continue;
          const futureGrade = extractFutureGrade(prospect[grade as keyof Prospect] as string);
          if (futureGrade < range.min || futureGrade > range.max) {
            return false;
          }
        }

        return true;
      })
      .sort(sortProspects);
  }, [prospects, filters, sortConfig]);

  return { filteredProspects, sortConfig, handleSort };
};