import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange, disabled = false, label = "Quantity" }) {
  return (
    <div className={`stepper ${disabled ? "disabled" : ""}`} aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={disabled || value === 0} aria-label={`Decrease ${label}`}><Minus size={14} /></button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={disabled} aria-label={`Increase ${label}`}><Plus size={14} /></button>
    </div>
  );
}
