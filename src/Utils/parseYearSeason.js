export default function parseYearSeason(yearRange) {

  if (!yearRange) return { min: new Date().getFullYear(), max: new Date().getFullYear() + 1 }

  const [minYear, maxYear] = yearRange.split('/').map(Number);

  return { min: minYear, max: maxYear };
};


