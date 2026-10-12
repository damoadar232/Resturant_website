import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartAmount, cartQuantity } from "../utils/pricing";

const CartContext = createContext(null);
const STORAGE_KEY = "tiffin-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items]);

  const upsert = (item) => {
    setItems((current) => {
      const match = current.findIndex((line) => line.key === item.key);
      if (item.quantity <= 0) return current.filter((line) => line.key !== item.key);
      return match < 0 ? [...current, item] : current.map((line, index) => index === match ? item : line);
    });
  };
  const remove = (key) => setItems((current) => current.filter((item) => item.key !== key));
  const clear = () => setItems([]);
  const value = useMemo(() => ({ items, upsert, remove, clear, quantity: cartQuantity(items), amount: cartAmount(items) }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
