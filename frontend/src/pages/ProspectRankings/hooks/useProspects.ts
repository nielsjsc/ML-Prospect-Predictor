import { useState, useEffect } from 'react';
import { Prospect } from '../../../types/prospects';
import { ProspectFilters } from '../../../types/filters';
import { fetchProspects } from '../../../services/prospectService';
import { filterProspects } from '../utils/tableHelpers';

interface UseProspectsReturn {
  prospects: Prospect[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useProspects = (filters: ProspectFilters): UseProspectsReturn => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProspects = async () => {
    try {
      setLoading(true);
      const data = await fetchProspects(filters.type);
      const filteredData = filterProspects(data, filters);
      setProspects(filteredData);
      setError(null);
    } catch (err) {
      setError('Failed to load prospects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProspects();
  }, [filters.type]);

  return {
    prospects,
    loading,
    error,
    refreshData: loadProspects
  };
};