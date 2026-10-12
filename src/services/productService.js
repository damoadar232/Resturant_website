import { eventProducts, groceries, todayProducts, weeklyProducts } from "../data/products";

export const getProducts = (category) => ({
  today: todayProducts,
  events: eventProducts,
  weekly: weeklyProducts,
  grocery: groceries,
}[category] || []);
