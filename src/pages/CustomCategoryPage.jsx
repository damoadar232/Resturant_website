import { Navigate, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import ScheduleCatalog from "../components/ScheduleCatalog";
import SingleOrderCatalog from "../components/SingleOrderCatalog";
import { useCategories } from "../context/CategoryContext";
import { todayProducts } from "../data/products";
import { todayISO, tomorrowISO } from "../utils/dates";
import { useState } from "react";

export default function CustomCategoryPage() {
  const { id } = useParams();
  const { customCategories } = useCategories();
  const category = customCategories.find((item) => item.id === id);
  const [date, setDate] = useState("");
  if (!category) return <Navigate to="/" replace />;
  const products = category.filters?.length ? todayProducts.filter((product) => category.filters.includes(product.subcategory)) : todayProducts;
  const schedule = category.type.includes("Day 1") || category.type.includes("Calendar");
  const dateFirst = category.type.includes("Date first");
  return <div className={`order-page ${schedule ? "wide" : ""}`}><PageHero eyebrow={category.type} title={category.name} description={category.description}>{dateFirst && <label className="date-picker"><span><small>Order date</small><input type="date" min={tomorrowISO()} value={date} onChange={(event) => setDate(event.target.value)} /></span></label>}</PageHero>{schedule ? <ScheduleCatalog products={products} category={`custom-${id}`} startDate={todayISO()} dayLabels={category.type.includes("Day 1")} /> : <SingleOrderCatalog products={products} category={`custom-${id}`} eventDate={date} controlsDisabled={dateFirst && !date} />}</div>;
}
