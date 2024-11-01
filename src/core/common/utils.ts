export const formatISODateToPGDate = (isoDate: string): string => {
  const dt = new Date(isoDate);
  return dt.toISOString().slice(0, 19).replace('T', ' ');
};
