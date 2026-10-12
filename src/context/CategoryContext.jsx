import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { baseCategories } from "../data/categories";

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [customCategories, setCustomCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tiffin-categories")) || []; } catch { return []; }
  });
  useEffect(() => localStorage.setItem("tiffin-categories", JSON.stringify(customCategories)), [customCategories]);
  const addCategory = (category) => setCustomCategories((current) => [...current, category]);
  const categories = useMemo(() => [...baseCategories, ...customCategories], [customCategories]);
  return <CategoryContext.Provider value={{ categories, customCategories, addCategory }}>{children}</CategoryContext.Provider>;
}

export const useCategories = () => useContext(CategoryContext);
