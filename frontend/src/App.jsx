import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Toaster from "./components/common/Toaster";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <Navbar />
        <div className="main-area">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </AppProvider>
  );
}
