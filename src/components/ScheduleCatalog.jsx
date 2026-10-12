import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Check, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/currency";
import { addDays, shortDate, weekday } from "../utils/dates";
import { getSubcategories } from "../data/products";
import { scheduleQuantity } from "../utils/pricing";
import FilterChips from "./FilterChips";
import ProductThumb from "./ProductThumb";
import QuantityStepper from "./QuantityStepper";
import SummaryBar from "./SummaryBar";

export default function ScheduleCatalog({ products, category, startDate, dayLabels = false }) {
  const { items, upsert } = useCart();
  const [filter, setFilter] = useState("All");
  const [schedules, setSchedules] = useState({});
  const scroller = useRef(null);
  const dates = useMemo(() => Array.from({ length: 14 }, (_, index) => addDays(startDate, index)), [startDate]);
  const shown = products.filter((product) => filter === "All" || product.subcategory === filter);
  const getKey = (product) => `${category}:${product.id}:${startDate}`;
  const getLine = (product) => items.find((item) => item.key === getKey(product));
  const getSchedule = (product) => schedules[getKey(product)] ?? getLine(product)?.schedule ?? {};
  const pageTotal = products.reduce((sum, product) => sum + product.price * scheduleQuantity(getSchedule(product)), 0);
  const change = (product, date, value) => {
    const key = getKey(product);
    const schedule = { ...getSchedule(product), [date]: value };
    setSchedules((current) => ({ ...current, [key]: schedule }));
    if (getLine(product)) {
      const quantity = scheduleQuantity(schedule);
      upsert({ ...product, key, category, quantity, schedule, startDate, lineTotal: product.price * quantity });
    }
  };
  const add = (product) => {
    const schedule = getSchedule(product);
    const quantity = scheduleQuantity(schedule);
    const key = getKey(product);
    upsert({ ...product, key, category, quantity, schedule, startDate, lineTotal: product.price * quantity });
  };
  return (
    <>
      <FilterChips categories={getSubcategories(products)} selected={filter} onSelect={setFilter} products={products} />
      <div className="scroll-controls"><span>Swipe to plan across 14 days</span><div><button type="button" onClick={() => scroller.current?.scrollBy({ left: -420, behavior: "smooth" })} aria-label="Scroll dates left"><ChevronLeft /></button><button type="button" onClick={() => scroller.current?.scrollBy({ left: 420, behavior: "smooth" })} aria-label="Scroll dates right"><ChevronRight /></button></div></div>
      <div className="schedule-table" ref={scroller}>
        <div className="schedule-head">
          <div className="sticky-product">Product</div><div className="sticky-price">Price</div>
          {dates.map((date, index) => <div className="date-cell" key={date}><strong>{dayLabels ? `Day ${index + 1}` : shortDate(date)}</strong><small>{dayLabels ? shortDate(date) : weekday(date)}</small></div>)}
          <div className="total-cell">Total</div><div className="action-cell">Cart</div>
        </div>
        {shown.map((product) => {
          const schedule = getSchedule(product);
          const quantity = scheduleQuantity(schedule);
          const key = getKey(product);
          const inCart = items.some((item) => item.key === key);
          return <div className="schedule-row" key={product.id}>
            <div className="sticky-product"><ProductThumb name={product.name} grocery={category === "grocery"} /><span><small>{product.subcategory}</small><strong>{product.name}</strong><em>{product.quantityLabel}</em></span></div>
            <div className="sticky-price"><del>{currency(product.mrp)}</del><strong>{currency(product.price)}</strong></div>
            {dates.map((date) => <div className="date-cell" key={date}><QuantityStepper value={schedule[date] || 0} onChange={(value) => change(product, date, value)} label={`${product.name} for ${date}`} /></div>)}
            <div className="total-cell"><strong>{quantity}</strong><span>{currency(quantity * product.price)}</span></div>
            <div className="action-cell"><button type="button" className={`icon-add ${inCart ? "added" : ""}`} disabled={!quantity} onClick={() => add(product)} aria-label={`Add ${product.name} to cart`}>{inCart ? <Check /> : <Plus />}</button></div>
          </div>;
        })}
      </div>
      <SummaryBar pageTotal={pageTotal} />
    </>
  );
}
