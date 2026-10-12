import { useState } from "react";
import { ArrowUpRight, CalendarDays, Check, Plus, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import { pageTypes } from "../data/categories";

const icons = ["01", "02", "03", "04"];

export default function HomePage() {
  const { categories, addCategory } = useCategories();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", filters: [] });
  const [error, setError] = useState("");
  const toggleFilter = (filter) => setForm((current) => ({ ...current, filters: current.filters.includes(filter) ? current.filters.filter((item) => item !== filter) : [...current.filters, filter] }));
  const create = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.type) return setError("Enter a category name and select a page type.");
    const id = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    addCategory({ ...form, id, name: form.name.trim(), path: `/custom/${id}`, description: "Your custom ordering page, ready to plan and add to cart." });
    setOpen(false);
    setForm({ name: "", type: "", filters: [] });
    setError("");
  };
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy"><span className="eyebrow"><Sparkles size={14} /> Everyday food, thoughtfully planned</span><h1>Good food, on <em>your schedule.</em></h1><p>Order for today, plan the next two weeks, or make every celebration delicious—all in one place.</p><div><Link className="primary-button" to="/today">Order for today <ArrowUpRight size={18} /></Link><a className="text-link" href="#categories">Explore all options</a></div></div>
        <div className="hero-visual"><div className="hero-orbit orbit-one">Breakfast</div><div className="hero-bowl"><span>Fresh</span><strong>Tiffin</strong><small>made daily</small></div><div className="hero-orbit orbit-two">14-day plans</div><div className="hero-orbit orbit-three">Groceries</div></div>
      </section>
      <section className="category-section" id="categories">
        <div className="section-heading"><div><span className="eyebrow">Choose how you order</span><h2>One kitchen. Every occasion.</h2></div><p>Each page is designed around the way you want to plan.</p></div>
        <div className="category-grid">
          {categories.map((category, index) => <article className={`category-card card-${(index % 4) + 1}`} key={category.id}>
            <div className="card-number">{icons[index % 4]}</div><span className="page-type">{category.type}</span><h3>{category.name}</h3><p>{category.description}</p>
            <div className="mini-preview"><span></span><span></span><span></span><b>{category.type.includes("Rewards") ? "Refer · Earn · Redeem" : category.type.includes("14") || category.type.includes("Calendar") ? "14 date columns" : "−  0  +"}</b></div>
            <Link to={category.path}>Open page <ArrowUpRight size={17} /></Link>
          </article>)}
          <button type="button" className="new-category-card" onClick={() => setOpen(true)}><span><Plus /></span><strong>Create a new category</strong><small>Choose a page type and make it yours</small></button>
        </div>
      </section>
      {open && <div className="modal-backdrop" role="presentation" onMouseDown={() => setOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head"><div><span className="eyebrow">New order flow</span><h2 id="new-title">Create category</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Close"><X /></button></div>
        <form onSubmit={create}>
          <label>Category name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Office lunch" autoFocus /></label>
          <fieldset><legend>Choose a page type</legend><div className="type-options">{pageTypes.map((type) => <button type="button" className={form.type === type ? "selected" : ""} onClick={() => setForm({ ...form, type })} key={type}><CalendarDays /><span><strong>{type}</strong><small>{type.includes("14") || type.includes("Calendar") ? "14 quantity columns" : "One quantity per item"}</small></span>{form.type === type && <Check />}</button>)}</div></fieldset>
          <fieldset><legend>Applicable subcategories</legend><div className="check-chips">{["Breakfast", "Lunch & Dinner", "Snack & Chat"].map((filter) => <label key={filter}><input type="checkbox" checked={form.filters.includes(filter)} onChange={() => toggleFilter(filter)} />{filter}</label>)}</div></fieldset>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button><button className="primary-button" type="submit">Create category</button></div>
        </form>
      </section></div>}
    </div>
  );
}
