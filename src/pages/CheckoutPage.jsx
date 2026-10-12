import { CheckCircle2, CreditCard, Gift, IndianRupee, MapPin, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/currency";
import { cartAmount, deliveryCount, discountTotal, mrpSubtotal } from "../utils/pricing";
import { saveMockOrder } from "../services/orderService";
import { todayISO } from "../utils/dates";
import { useReferral } from "../context/ReferralContext";
import { MINIMUM_REWARD_ORDER, REFERRAL_REWARD } from "../services/referralService";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { wallet, validateReward, redeemReward } = useReferral();
  const [form, setForm] = useState({ name: "", mobile: "", location: localStorage.getItem("tiffin-location") || "Hyderabad", building: "", street: "", payment: "cod" });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [applyReward, setApplyReward] = useState(false);
  if (!items.length && !order) return <Navigate to="/cart" replace />;
  const mrp = mrpSubtotal(items), discount = discountTotal(items), subtotal = cartAmount(items), deliveries = deliveryCount(items), fee = deliveries * 30;
  const rewardValidation = validateReward(subtotal);
  const rewardDiscount = applyReward && rewardValidation.valid ? rewardValidation.amount : 0;
  const totalBeforeDelivery = subtotal - rewardDiscount;
  const total = totalBeforeDelivery + fee;
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Enter your full name.";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) next.mobile = "Enter a valid 10-digit mobile number.";
    if (!form.building.trim()) next.building = "Enter your house, flat, or building.";
    if (!form.street.trim()) next.street = "Enter your street or area.";
    if (items.some((item) => item.category === "events" && (!item.eventDate || item.eventDate <= todayISO()))) next.cart = "An event date is no longer valid. Please update the event order.";
    const currentRewardValidation = validateReward(subtotal);
    if (applyReward && !currentRewardValidation.valid) next.reward = currentRewardValidation.message;
    setErrors(next);
    if (Object.keys(next).length) return;
    const reference = `TCO-${Date.now().toString(36).toUpperCase()}`;
    try {
      saveMockOrder({
        reference,
        createdAt: new Date().toISOString(),
        customer: form,
        items,
        merchandiseSubtotal: subtotal,
        referralReward: rewardDiscount,
        deliveryFee: fee,
        total,
        status: "Mock order created",
      });
      if (applyReward) redeemReward(reference, subtotal);
      setOrder({ reference, payment: form.payment, rewardDiscount });
      clear();
    } catch (error) {
      setErrors({ order: error.message || "The mock order could not be created. Your cart and reward were not changed." });
    }
  };
  if (order) return <div className="order-success"><CheckCircle2 /><span className="eyebrow">Mock order confirmed</span><h1>Thank you, your plan is saved.</h1><p>Reference <strong>{order.reference}</strong></p>{order.payment !== "cod" && <div className="payment-notice">No real {order.payment === "upi" ? "UPI" : "card"} payment was processed. Gateway integration requires backend credentials.</div>}<Link className="primary-button" to="/">Back to home</Link></div>;
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  return <div className="checkout-page"><div className="page-title"><span className="eyebrow">Secure checkout</span><h1>Complete your order</h1><p>Review your delivery details and choose how you’d like to pay.</p></div>
    <form className="checkout-layout" onSubmit={submit}><div className="checkout-forms">
      <section className="form-section"><div className="form-section-title"><span>1</span><div><h2>Contact details</h2><p>We’ll use these for delivery updates.</p></div></div><div className="form-grid"><label>Full name<input value={form.name} onChange={update("name")} placeholder="Your full name" />{errors.name && <small className="form-error">{errors.name}</small>}</label><label>Mobile number<input value={form.mobile} onChange={update("mobile")} inputMode="numeric" placeholder="10-digit mobile number" />{errors.mobile && <small className="form-error">{errors.mobile}</small>}</label></div></section>
      <section className="form-section"><div className="form-section-title"><span>2</span><div><h2>Delivery address</h2><p>Where should we bring your order?</p></div></div><label>Delivery location<div className="input-icon"><MapPin /><input value={form.location} onChange={update("location")} /></div></label><div className="form-grid"><label>House, flat or building<input value={form.building} onChange={update("building")} placeholder="Flat 204, Maple Residency" />{errors.building && <small className="form-error">{errors.building}</small>}</label><label>Street or area<input value={form.street} onChange={update("street")} placeholder="Road name, locality" />{errors.street && <small className="form-error">{errors.street}</small>}</label></div></section>
      <section className="form-section"><div className="form-section-title"><span>3</span><div><h2>Referral rewards</h2><p>One milestone reward can be used on eligible merchandise.</p></div></div>
        <div className={`reward-option ${rewardValidation.valid ? "eligible" : ""}`}><Gift /><div><strong>{currency(REFERRAL_REWARD)} referral reward</strong><span>{wallet.rewardAvailable ? `${currency(wallet.availableBalance)} confirmed wallet balance` : "No unused milestone reward available"}</span><small>Requires a merchandise subtotal of {currency(MINIMUM_REWARD_ORDER)}.</small></div><label className="reward-switch"><input type="checkbox" checked={applyReward} disabled={!rewardValidation.valid} onChange={(event) => setApplyReward(event.target.checked)} /><span>{applyReward ? "Applied" : "Apply"}</span></label></div>
        {!rewardValidation.valid && <p className="reward-message">{rewardValidation.message}</p>}
        {errors.reward && <p className="form-error">{errors.reward}</p>}
      </section>
      <section className="form-section"><div className="form-section-title"><span>4</span><div><h2>Payment method</h2><p>This prototype records your selection only.</p></div></div><div className="payment-options">{[["upi", Smartphone, "UPI", "Gateway required"], ["card", CreditCard, "Credit / debit card", "Gateway required"], ["cod", IndianRupee, "Cash on delivery", "Pay at your door"]].map(([value, Icon, title, note]) => <label className={form.payment === value ? "selected" : ""} key={value}><input type="radio" name="payment" value={value} checked={form.payment === value} onChange={update("payment")} /><Icon /><span><strong>{title}</strong><small>{note}</small></span></label>)}</div></section>
      {errors.cart && <p className="form-error banner">{errors.cart}</p>}
      {errors.order && <p className="form-error banner">{errors.order}</p>}
    </div><aside className="bill"><span className="eyebrow">Bill summary</span><div><span>MRP subtotal</span><strong>{currency(mrp)}</strong></div><div className="discount"><span>Product discount</span><strong>− {currency(discount)}</strong></div><div><span>Merchandise subtotal</span><strong>{currency(subtotal)}</strong></div>{rewardDiscount > 0 && <div className="reward-line"><span>Referral reward</span><strong>− {currency(rewardDiscount)}</strong></div>}<div><span>Before delivery</span><strong>{currency(totalBeforeDelivery)}</strong></div><div><span>Delivery fee</span><strong>{currency(fee)}</strong></div><small>₹30 × {deliveries} unique {deliveries === 1 ? "delivery" : "deliveries"}</small><div className="payable"><span>Amount payable</span><strong>{currency(total)}</strong></div><button className="primary-button" type="submit">Place mock order</button><p><ShieldCheck /> No real online payment is processed.</p></aside></form>
  </div>;
}
