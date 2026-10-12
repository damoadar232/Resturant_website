import { useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/currency";
import { getSubcategories } from "../data/products";
import FilterChips from "./FilterChips";
import ProductThumb from "./ProductThumb";
import QuantityStepper from "./QuantityStepper";
import SummaryBar from "./SummaryBar";

export default function SingleOrderCatalog({ products, category, eventDate = "", controlsDisabled = false }) {
  const { items, upsert } = useCart();
  const [filter, setFilter] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").toLowerCase();
  const shown = useMemo(() => products.filter((product) =>
    (filter === "All" || product.subcategory === filter) && (!search || product.name.toLowerCase().includes(search))
  ), [products, filter, search]);
  const getLine = (product) => {
    const key = `${category}:${product.id}:${eventDate}`;
    return items.find((item) => item.key === key);
  };
  const getQuantity = (product) => {
    const key = `${category}:${product.id}:${eventDate}`;
    return quantities[key] ?? getLine(product)?.quantity ?? 0;
  };
  const pageTotal = products.reduce((sum, product) => sum + product.price * getQuantity(product), 0);

  const add = (product) => {
    const quantity = getQuantity(product);
    const key = `${category}:${product.id}:${eventDate}`;
    upsert({ ...product, key, category, quantity, eventDate: eventDate || undefined, lineTotal: product.price * quantity });
  };
  const changeQuantity = (product, quantity) => {
    const key = `${category}:${product.id}:${eventDate}`;
    setQuantities((current) => ({ ...current, [key]: quantity }));
    if (getLine(product)) {
      upsert({ ...product, key, category, quantity, eventDate: eventDate || undefined, lineTotal: product.price * quantity });
    }
  };
  return (
    <>
      <FilterChips categories={getSubcategories(products)} selected={filter} onSelect={setFilter} products={products} />
      {search && <p className="search-note">Showing results for “{search}” · {shown.length} found</p>}
      <div className="catalog">
        {shown.map((product) => {
          const quantity = getQuantity(product);
          const key = `${category}:${product.id}:${eventDate}`;
          const inCart = items.some((item) => item.key === key);
          return (
            <article className="product-card" key={product.id}>
              <ProductThumb name={product.name} />
              <div className="product-copy"><span className="tag">{product.subcategory}</span><h3>{product.name}</h3><p>{product.quantityLabel}</p></div>
              <div className="price"><del>{currency(product.mrp)}</del><strong>{currency(product.price)}</strong><small>Today’s price</small></div>
              <QuantityStepper value={quantity} onChange={(value) => changeQuantity(product, value)} disabled={controlsDisabled} label={product.name} />
              <div className="line-total"><small>Total</small><strong>{currency(product.price * quantity)}</strong></div>
              <button type="button" className={`add-button ${inCart ? "added" : ""}`} disabled={quantity === 0 || controlsDisabled} onClick={() => add(product)}>
                {inCart ? <Check size={16} /> : <Plus size={16} />}{inCart ? "Added" : "Add to cart"}
              </button>
            </article>
          );
        })}
        {shown.length === 0 && <div className="empty-state"><h2>No products found</h2><p>Try another filter or search term.</p></div>}
      </div>
      <SummaryBar pageTotal={pageTotal} />
    </>
  );
}
