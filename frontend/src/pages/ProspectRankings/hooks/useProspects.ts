import { useState, useEffect, useCallback } from 'react';
import { Prospect } from '../../../types/prospects';
import { ProspectFilters } from '../../../types/filters';
import { fetchProspects } from '../../../services/firebase';
import { filterProspects } from '../utils/tableHelpers';

export const useProspects = (filters: ProspectFilters) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProspects = useCallback(async () => {
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
  }, [filters]);

  useEffect(() => {
    loadProspects();
  }, [loadProspects]);

  return { prospects, loading, error, refreshData: loadProspects };
};