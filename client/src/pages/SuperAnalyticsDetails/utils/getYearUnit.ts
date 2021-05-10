interface ChartYear {
  value: string | null;
  unit: string | null;
}

export const getYearUnit = (chartYear?: ChartYear | null): string | null => {
  if (!chartYear) {
    return null;
  }

  const { value } = chartYear;

  return value === 'NA' || !value ? null : chartYear.unit;
};
