import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Camera,
  ChevronDown,
  BriefcaseBusiness,
  Home,
  MapPin,
  Menu,
  PartyPopper,
  Play,
  Repeat2,
  Search,
  Send,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCategories } from "../context/CategoryContext";
import { currency } from "../utils/currency";

const mobileLinks = [
  ["/", "Home", Home],
  ["/today", "Today", CalendarDays],
  ["/events", "Events", PartyPopper],
  ["/weekly", "Weekly", Repeat2],
  ["/cart", "Cart", ShoppingBag],
];

const socialLinks = [
  ["Instagram", "https://www.instagram.com/", Camera],
  ["Facebook", "https://www.facebook.com/", Users],
  ["YouTube", "https://www.youtube.com/", Play],
  ["LinkedIn", "https://www.linkedin.com/", BriefcaseBusiness],
  ["Telegram", "https://telegram.org/", Send],
];

export default function Header() {
  const { quantity, amount } = useCart();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location, setLocation] = useState(() => localStorage.getItem("tiffin-location") || "Hyderabad");
  const lastScrollY = useRef(0);
  const movement = useRef(0);
  const direction = useRef("up");

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      if (currentY <= 16) {
        movement.current = 0;
        direction.current = "up";
        setVisible(true);
        return;
      }

      if (Math.abs(delta) < 2) return;
      const nextDirection = delta > 0 ? "down" : "up";
      if (nextDirection !== direction.current) {
        direction.current = nextDirection;
        movement.current = 0;
      }

      movement.current += Math.abs(delta);
      if (nextDirection === "down" && currentY > 80 && movement.current >= 16) {
        setVisible(false);
        setMobileMenuOpen(false);
        setLocationOpen(false);
        setSearchOpen(false);
        movement.current = 0;
      } else if (nextDirection === "up" && movement.current >= 10) {
        setVisible(true);
        movement.current = 0;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const saveLocation = (event) => {
    event.preventDefault();
    const nextLocation = new FormData(event.currentTarget).get("location")?.toString().trim();
    if (!nextLocation) return;
    setLocation(nextLocation);
    localStorage.setItem("tiffin-location", nextLocation);
    setLocationOpen(false);
  };

  const searchProducts = (event) => {
    event.preventDefault();
    const term = new FormData(event.currentTarget).get("search")?.toString().trim();
    if (!term) return;
    navigate(`/today?search=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <header className={`site-header ${visible ? "" : "header-hidden"}`}>
        <div className="topbar">
          <div className="topbar-inner">
            <div className="location-wrap">
              <button className="location" type="button" aria-expanded={locationOpen} aria-controls="location-menu" onClick={() => setLocationOpen((open) => !open)}>
                <MapPin size={15} /><span><small>Delivering to</small>{location}</span><ChevronDown size={13} />
              </button>
              {locationOpen && (
                <form className="location-menu" id="location-menu" onSubmit={saveLocation}>
                  <label htmlFor="delivery-location">Change delivery location</label>
                  <div><input id="delivery-location" name="location" defaultValue={location} autoFocus /><button type="submit">Save</button></div>
                </form>
              )}
            </div>
            <span className="topbar-spacer" aria-hidden="true" />
            <nav className="social-links" aria-label="Social media">
              {socialLinks.map(([label, href, Icon]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon size={15} /></a>
              ))}
            </nav>
          </div>
        </div>
        <div className="main-navbar">
          <div className="navbar-inner">
            <NavLink to="/" className="brand" onClick={() => setMobileMenuOpen(false)}><span className="brand-mark">T</span><span>Tiffin <em>& Co.</em></span></NavLink>
            <nav className={`category-nav ${mobileMenuOpen ? "menu-open" : ""}`} aria-label="Order categories">
              {categories.map((category) => <NavLink key={category.id} to={category.path} onClick={() => setMobileMenuOpen(false)}>{category.name}</NavLink>)}
            </nav>
            <div className="navbar-actions">
              <button className="search-toggle" type="button" aria-label="Search products" aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)}><Search size={18} /></button>
              <NavLink to="/cart" className="cart-pill"><ShoppingBag size={18} /><span><strong>{quantity} items</strong><small>{currency(amount)}</small></span></NavLink>
              <button className="menu-toggle" type="button" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
                {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
            {searchOpen && <form className="header-search" role="search" onSubmit={searchProducts}><Search size={18} /><input name="search" type="search" placeholder="Search dishes, groceries…" aria-label="Search products" autoFocus /><button type="submit">Search</button></form>}
          </div>
        </div>
      </header>
      <div className="header-offset" aria-hidden="true" />
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {mobileLinks.map(([path, label, Icon]) => <NavLink key={path} to={path}><Icon size={20} /><span>{label}</span>{label === "Cart" && quantity > 0 && <b>{quantity}</b>}</NavLink>)}
      </nav>
    </>
  );
}
