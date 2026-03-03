export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const startOfWeekMonday = (date = new Date()) => {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

export const endOfWeekMonday = (date = new Date()) => {
  const d = startOfWeekMonday(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const formatISODate = (date: Date) => date.toISOString().slice(0, 10);

export const daysBetween = (a: Date, b: Date) => {
  const ms = Math.abs(startOfDay(a).getTime() - startOfDay(b).getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};
