import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Prospect, HitterProspect, PitcherProspect } from '../types/prospects';
import { ProspectFilters } from '../types/filters';

const firebaseConfig = {
  storageBucket: 'mlb-prospect-predictor.appspot.com'
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function fetchProspects(type: 'hitter' | 'pitcher'): Promise<Prospect[]> {
  try {
    const fileName = type === 'hitter' ? 'hitter_predictions.json' : 'pitcher_predictions.json';
    const fileRef = ref(storage, fileName);
    const url = await getDownloadURL(fileRef);
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.prospects;
  } catch (error) {
    console.error('Error fetching prospects:', error);
    throw error;
  }
}

export function filterProspects(prospects: Prospect[], filters: ProspectFilters): Prospect[] {
  return prospects.filter(prospect => {
    if (filters.searchTerm && !prospect.Name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.organization && prospect.Organization !== filters.organization) {
      return false;
    }
    
    if (filters.age) {
      if (prospect.Age < filters.age.min || prospect.Age > filters.age.max) {
        return false;
      }
    }
    
    // Filter by grades
    for (const [field, range] of Object.entries(filters.grades)) {
      const grade = prospect[field as keyof Prospect] as number;
      if (grade < range.min || grade > range.max) {
        return false;
      }
    }
    
    return true;
  });
}