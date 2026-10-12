export const saveMockOrder = (order) => {
  const orders = JSON.parse(localStorage.getItem("tiffin-orders") || "[]");
  localStorage.setItem("tiffin-orders", JSON.stringify([order, ...orders]));
  return order;
};
