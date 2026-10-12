import { CalendarDays } from "lucide-react";
import { useState } from "react";
import PageHero from "../components/PageHero";
import ScheduleCatalog from "../components/ScheduleCatalog";
import { weeklyProducts } from "../data/products";
import { todayISO } from "../utils/dates";

export default function WeeklyOrderPage() {
  const [startDate, setStartDate] = useState(todayISO());
  return <div className="order-page wide"><PageHero eyebrow="Day 1 through Day 14" title="Weekly Order" description="Build a meal rhythm that works for you. Every quantity stays tied to its day."><label className="date-picker"><CalendarDays /><span><small>Start date</small><input type="date" min={todayISO()} value={startDate} onChange={(event) => setStartDate(event.target.value)} /></span></label></PageHero><ScheduleCatalog products={weeklyProducts} category="weekly" startDate={startDate} dayLabels /></div>;
}
