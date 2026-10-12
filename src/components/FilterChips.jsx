export default function FilterChips({ categories, selected, onSelect, products }) {
  return (
    <div className="filter-chips" aria-label="Product filters">
      {["All", ...categories].map((category) => {
        const count = category === "All" ? products.length : products.filter((product) => product.subcategory === category).length;
        return <button type="button" className={selected === category ? "active" : ""} onClick={() => onSelect(category)} key={category}>{category}<span>{count}</span></button>;
      })}
    </div>
  );
}
