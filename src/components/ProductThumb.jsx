import { Soup } from "lucide-react";

export default function ProductThumb({ name, grocery = false }) {
  return (
    <div className={`product-thumb ${grocery ? "grocery" : ""}`} aria-hidden="true">
      <Soup size={22} />
      <span>{name.charAt(0)}</span>
    </div>
  );
}
