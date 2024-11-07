import { format } from 'date-fns';

export const formatISODateToPGDate = (isoDate: string): string => {
  const dt = new Date(isoDate);
  return dt.toISOString().slice(0, 19).replace('T', ' ');
};

export const formatDate = (date: string | Date): string | null => {
  const parsedDate: Date = new Date(date);
  return isNaN(parsedDate.getTime())
    ? null
    : format(parsedDate, 'dd/MM/yyyy HH:mm:ss');
};
