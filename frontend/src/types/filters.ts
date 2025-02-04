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

export const MLB_ORGANIZATIONS = [
  'ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CWS', 'CIN', 'CLE', 'COL', 'DET',
  'HOU', 'KC', 'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM', 'NYY', 'OAK',
  'PHI', 'PIT', 'SD', 'SF', 'SEA', 'STL', 'TB', 'TEX', 'TOR', 'WSH'
] as const;

export type Organization = typeof MLB_ORGANIZATIONS[number];

export type HitterGrade = 'Hit' | 'Game' | 'Raw' | 'Spd';
export type PitcherGrade = 'FB' | 'SL' | 'CB' | 'CH' | 'CMD';

export interface GradeRange {
  min: number;
  max: number;
}

export interface RangeFilter {
  min: number;
  max: number;
}

export type ProspectType = 'hitter' | 'pitcher';

export interface ProspectFilters {
  type: ProspectType;
  organization?: Organization;
  age?: RangeFilter;
  searchTerm?: string;
  grades: {
    [K in HitterGrade | PitcherGrade]?: GradeRange;
  };
}

export const DEFAULT_FILTERS: ProspectFilters = {
  type: 'hitter',
  age: { min: 18, max: 25 },
  grades: {}
};

export type FilterChangePayload<T extends keyof ProspectFilters> = {
  filterType: T;
  value: ProspectFilters[T];
};
export interface FilterChangeEvent {
  filterType: keyof ProspectFilters;
  value: any;
}