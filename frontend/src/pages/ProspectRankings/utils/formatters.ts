export const formatConfidence = (value: number, lower: number, upper: number): string => {
  return `${value.toFixed(1)} (${lower.toFixed(1)} - ${upper.toFixed(1)})`;
};

export const formatGrade = (value: number): string => {
  return value ? value.toString() : 'N/A';
};

export const formatAge = (value: number): string => {
  return value ? value.toString() : '--';
};

export const formatRank = (value: number): string => {
  return value === 250 ? 'NR' : value.toString();
};