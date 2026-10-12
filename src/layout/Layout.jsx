import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return <><Header /><main id="main"><Outlet /></main><footer className="footer"><strong>Tiffin & Co.</strong><span>Freshly planned. Thoughtfully delivered.</span><small>Frontend ordering prototype · Prices from supplied product master</small></footer></>;
}
