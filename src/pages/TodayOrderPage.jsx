import PageHero from "../components/PageHero";
import SingleOrderCatalog from "../components/SingleOrderCatalog";
import { todayProducts } from "../data/products";

export default function TodayOrderPage() {
  return <div className="order-page"><PageHero eyebrow="Single quantity order" title="Today's Order" description="Freshly prepared favourites for your day. Choose a quantity and add what you love." /><SingleOrderCatalog products={todayProducts} category="today" /></div>;
}
