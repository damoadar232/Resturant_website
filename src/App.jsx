import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { CategoryProvider } from "./context/CategoryContext";
import { ReferralProvider } from "./context/ReferralContext";
import Layout from "./layout/Layout";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CustomCategoryPage from "./pages/CustomCategoryPage";
import EventsOrderPage from "./pages/EventsOrderPage";
import GroceryOrderPage from "./pages/GroceryOrderPage";
import HomePage from "./pages/HomePage";
import TodayOrderPage from "./pages/TodayOrderPage";
import WeeklyOrderPage from "./pages/WeeklyOrderPage";
import ReferralPage from "./pages/ReferralPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/today", element: <TodayOrderPage /> },
      { path: "/events", element: <EventsOrderPage /> },
      { path: "/weekly", element: <WeeklyOrderPage /> },
      { path: "/grocery", element: <GroceryOrderPage /> },
      { path: "/custom/:id", element: <CustomCategoryPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/referral", element: <ReferralPage /> },
    ],
  },
]);

export default function App() {
  return (
    <CategoryProvider>
      <ReferralProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ReferralProvider>
    </CategoryProvider>
  );
}
