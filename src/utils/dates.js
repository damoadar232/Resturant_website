export const toISODate = (date) => {
  const local = new Date(date);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 10);
};
export const addDays = (date, days) => {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + days);
  return toISODate(next);
};
export const todayISO = () => toISODate(new Date());
export const tomorrowISO = () => addDays(todayISO(), 1);
export const shortDate = (date) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));
export const weekday = (date) => new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(new Date(`${date}T12:00:00`));
