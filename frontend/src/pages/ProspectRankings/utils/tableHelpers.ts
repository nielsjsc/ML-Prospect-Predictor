import { Prospect} from '../../../types/prospects';
import { ProspectFilters } from '../../../types/filters';

export const filterProspects = (
  prospects: Prospect[],
  filters: ProspectFilters
): Prospect[] => {
  return prospects.filter(prospect => {
    // Name search
    if (filters.searchTerm && 
        !prospect.Name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Organization filter
    if (filters.organization && prospect.Org !== filters.organization) {
      return false;
    }

    // Age range
    if (filters.age) {
      if (prospect.Age < filters.age.min || prospect.Age > filters.age.max) {
        return false;
      }
    }

    // Grade filters
    if (filters.grades) {
      for (const [field, range] of Object.entries(filters.grades)) {
        const grade = prospect[field as keyof Prospect] as number;
        if (grade < range.min || grade > range.max) {
          return false;
        }
      }
    }

    return true;
  });
};

export const sortProspects = (
  prospects: Prospect[],
  sortField: keyof Prospect,
  sortDirection: 'asc' | 'desc'
): Prospect[] => {
  return [...prospects].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });
};

export const getTableStats = (prospects: Prospect[]) => {
  return {
    total: prospects.length,
    top100: prospects.filter(p => p.Top_100 <= 100).length,
    avgAge: (prospects.reduce((sum, p) => sum + p.Age, 0) / prospects.length).toFixed(1)
  };
};

export const exportToCSV = (prospects: Prospect[], filename: string) => {
  const headers = Object.keys(prospects[0]).join(',');
  const rows = prospects.map(p => Object.values(p).join(','));
  const csv = [headers, ...rows].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};