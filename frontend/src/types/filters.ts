export type SortField = 
    | 'Name'
    | 'Age'
    | 'Top_100'
    | 'Organization'
    | 'FV_future'
    | 'Predicted_WAR'
    | 'Predicted_wRC'
    | 'Predicted_ERA';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    field: SortField;
    direction: SortDirection;
}

export interface GradeRange {
    min: number;
    max: number;
  }
  
export type ProspectType = 'hitter' | 'pitcher';
  
export interface RangeFilter {
    min: number;
    max: number;
    }
  
  export interface ProspectFilters {
    type: ProspectType;
    organization?: string;
    age?: RangeFilter;
    searchTerm?: string;
    grades: {
      [key: string]: GradeRange;
    };
  }

export interface FilterChangeEvent {
    filterType: keyof ProspectFilters;
    value: any;
}