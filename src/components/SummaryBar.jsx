import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/currency";

export default function SummaryBar({ pageTotal = 0 }) {
  const { quantity, amount } = useCart();
  return (
    <aside className="summary-bar" aria-label="Order summary">
      <div><small>Page total</small><strong>{currency(pageTotal)}</strong></div>
      <div><ShoppingBag size={20} /><span><strong>{quantity} items</strong><small>{currency(amount)} in cart</small></span></div>
      <Link to="/cart">Go to cart <ArrowRight size={17} /></Link>
    </aside>
  );
}
