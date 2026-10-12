export const lineTotal = (price, quantity) => price * quantity;
export const scheduleQuantity = (schedule = {}) => Object.values(schedule).reduce((sum, quantity) => sum + quantity, 0);
export const cartQuantity = (items) => items.reduce((sum, item) => sum + item.quantity, 0);
export const cartAmount = (items) => items.reduce((sum, item) => sum + item.lineTotal, 0);
export const mrpSubtotal = (items) => items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
export const discountTotal = (items) => mrpSubtotal(items) - cartAmount(items);
export const deliveryCount = (items) => {
  const dates = new Set();
  items.forEach((item) => {
    if (item.category === "today") dates.add("today");
    else if (item.eventDate) dates.add(`event-${item.eventDate}`);
    else if (Object.values(item.schedule || {}).some((quantity) => quantity > 0)) {
      Object.entries(item.schedule).filter(([, quantity]) => quantity > 0).forEach(([date]) => dates.add(`${item.category}-${date}`));
    } else {
      dates.add(`${item.category}-today`);
    }
  });
  return dates.size;
};
