import PageHero from "../components/PageHero";
import ScheduleCatalog from "../components/ScheduleCatalog";
import { groceries } from "../data/products";
import { todayISO } from "../utils/dates";

export default function GroceryOrderPage() {
  return <div className="order-page wide"><PageHero eyebrow="14 calendar delivery dates" title="Grocery Order" description="Stock your pantry on your schedule. Choose quantities under the exact dates you need them." /><ScheduleCatalog products={groceries} category="grocery" startDate={todayISO()} /></div>;
}
