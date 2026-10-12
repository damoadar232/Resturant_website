import { ArrowLeft, ArrowRight, ShoppingBasket, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ProductThumb from "../components/ProductThumb";
import QuantityStepper from "../components/QuantityStepper";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/currency";
import { deliveryCount, discountTotal, mrpSubtotal, scheduleQuantity } from "../utils/pricing";

const categoryNames = { today: "Today's Order", events: "Events & Celebrations", weekly: "Weekly Order", grocery: "Grocery Order" };

export default function CartPage() {
  const { items, amount, quantity, remove, upsert, clear } = useCart();
  const groups = Object.entries(Object.groupBy ? Object.groupBy(items, (item) => item.category) : items.reduce((acc, item) => ({ ...acc, [item.category]: [...(acc[item.category] || []), item] }), {}));
  const mrp = mrpSubtotal(items);
  const discount = discountTotal(items);
  const fee = deliveryCount(items) * 30;
  const updateSchedule = (line, date, value) => {
    const schedule = { ...line.schedule, [date]: value };
    const nextQuantity = scheduleQuantity(schedule);
    upsert({ ...line, schedule, quantity: nextQuantity, lineTotal: line.price * nextQuantity });
  };
  const clearCart = () => {
    if (window.confirm("Clear every item from your cart?")) clear();
  };
  if (!items.length) return <div className="empty-cart"><div><ShoppingBasket /></div><span className="eyebrow">Your basket is waiting</span><h1>Nothing in your cart yet</h1><p>Browse today’s fresh menu or plan ahead for the week.</p><Link className="primary-button" to="/today">Start ordering <ArrowRight /></Link></div>;
  return <div className="cart-page"><div className="page-title"><Link to="/today"><ArrowLeft /> Continue shopping</Link><span className="eyebrow">Shared cart</span><h1>Your order</h1><p>{quantity} items across {groups.length} order {groups.length === 1 ? "type" : "types"}</p></div>
    <div className="cart-layout"><div className="cart-groups">{groups.map(([category, lines]) => <section className="cart-group" key={category}><header><h2>{categoryNames[category] || "Custom Order"}</h2><span>{currency(lines.reduce((sum, line) => sum + line.lineTotal, 0))}</span></header>{lines.map((line) => <article className={`cart-line ${line.schedule ? "has-schedule" : ""}`} key={line.key}><ProductThumb name={line.name} grocery={category === "grocery"} /><div className="cart-product"><span>{line.subcategory}</span><h3>{line.name}</h3><p>{line.eventDate ? `Event: ${line.eventDate}` : line.startDate ? `Schedule starts: ${line.startDate}` : line.quantityLabel}</p>{line.schedule && <div className="cart-schedule">{Object.entries(line.schedule).filter(([, q]) => q > 0).map(([date, scheduledQuantity]) => <div key={date}><small>{date}</small><QuantityStepper value={scheduledQuantity} onChange={(value) => updateSchedule(line, date, value)} label={`${line.name} for ${date}`} /></div>)}</div>}</div><div className="cart-price"><strong>{currency(line.price)}</strong><small>each</small></div>{!line.schedule && <QuantityStepper value={line.quantity} onChange={(quantity) => upsert({ ...line, quantity, lineTotal: line.price * quantity })} label={line.name} />}<div className="cart-line-total"><strong>{currency(line.lineTotal)}</strong><button type="button" onClick={() => remove(line.key)} aria-label={`Remove ${line.name}`}><Trash2 /></button></div></article>)}</section>)}</div>
      <aside className="cart-total"><span className="eyebrow">Order summary</span><div><span>MRP subtotal</span><strong>{currency(mrp)}</strong></div><div className="discount"><span>Product discount</span><strong>− {currency(discount)}</strong></div><div><span>Merchandise subtotal</span><strong>{currency(amount)}</strong></div><div><span>Estimated delivery</span><strong>{currency(fee)}</strong></div><div className="grand"><span>Estimated total</span><strong>{currency(amount + fee)}</strong></div><small>₹30 per unique delivery date. Final eligibility is rechecked at checkout.</small><Link className="primary-button" to="/checkout">Proceed to checkout <ArrowRight /></Link><button type="button" className="clear-cart" onClick={clearCart}><Trash2 size={15} /> Clear cart</button></aside>
    </div>
  </div>;
}
