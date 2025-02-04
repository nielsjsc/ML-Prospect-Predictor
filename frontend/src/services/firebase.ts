import { Prospect } from '../types/prospects';

const STORAGE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/mlb-prospect-predictor-001.firebasestorage.app';

export async function fetchProspects(type: 'hitter' | 'pitcher'): Promise<Prospect[]> {
  try {
    const fileName = type === 'hitter' ? 'hitter_predictions.json' : 'pitcher_predictions.json';
    const encodedPath = encodeURIComponent(`data/${fileName}`);
    const url = `${STORAGE_BASE_URL}/o/${encodedPath}?alt=media`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // Ensure we return the prospects array
    if (!data.prospects || !Array.isArray(data.prospects)) {
      throw new Error('Invalid data format');
    }
    
    console.log('Parsed prospects:', data.prospects);
    return data.prospects;
  } catch (error) {
    console.error('Error fetching prospects:', error);
    throw error;
  }
}