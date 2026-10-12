import { CalendarDays, Info } from "lucide-react";
import { useState } from "react";
import PageHero from "../components/PageHero";
import SingleOrderCatalog from "../components/SingleOrderCatalog";
import { eventProducts } from "../data/products";
import { shortDate, tomorrowISO } from "../utils/dates";

export default function EventsOrderPage() {
  const [date, setDate] = useState("");
  return <div className="order-page"><PageHero eyebrow="Date first + single quantity" title="Events & Celebrations" description="Party-sized favourites for gatherings big and small. Book at least one day ahead."><label className="date-picker"><CalendarDays /><span><small>Event date</small><input type="date" min={tomorrowISO()} value={date} onChange={(event) => setDate(event.target.value)} /></span></label></PageHero>
    {!date ? <div className="date-notice"><Info /><span><strong>Choose your event date first</strong><p>Quantity controls unlock once you select tomorrow or a later date.</p></span></div> : <div className="date-confirm"><CheckDate date={date} /></div>}
    <SingleOrderCatalog products={eventProducts} category="events" eventDate={date} controlsDisabled={!date} />
  </div>;
}

function CheckDate({ date }) { return <><CalendarDays size={18} /> Ordering for <strong>{shortDate(date)}</strong></>; }
