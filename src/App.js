import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import Enquiries from "./pages/Enquiries";

import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Colorlist from "./pages/Colotlist";
import Categorylist from "./pages/Categorylist";
import Sizelist from "./pages/Sizelist";
import Productlist from "./pages/Productlist";

import Addcolor from "./pages/Addcolor";
import Addcat from "./pages/Addcat";
import AddSize from "./pages/AddSize";
import Addproduct from "./pages/Addproduct";
import ViewOrder from "./pages/ViewOrder";
import AddSupplier from "./pages/AddSupplier";
import SupplierList from "./pages/SupplierList";
import Reports from "./pages/Reports";
import CashierDashboard from "./cashier/CashierDashboard"
import CashierEnquiries from "./cashier/CashierEnquiries"
import CashierMainLayout from "./components/CashierMainLayout"
import { PrivateRoute } from "./routes/PrivateRoute";
import NotFound from "./pages/NotFound";
import CashierSales from "./cashier/CashierSales";
import EditProduct from "./pages/EditProduct";
import EditSupplier from "./pages/EditSupplier";
import Sales from "./pages/Sales";
import DashboardPowerBI from './pages/DashboardPowerBI'
import CashierSalesList from "./cashier/CashierSalesList";
import SalesReport from "./reports/SalesReport";
import InventoryReport from "./reports/InventoryReport";

const user = JSON.parse(localStorage.getItem("user"))
console.log(user);

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />

        <Route path="/cashier" element={(user?.isAdmin === "admin" || user?.isAdmin === "cashier") ? <CashierMainLayout /> : <Login/>}>
          <Route index element={<CashierDashboard />} />
          <Route path="sales" element={<CashierSales/>}/>
          <Route path="sales-list" element={<CashierSalesList/>}/>
          
          <Route path="cashier-enquiries" element={<CashierEnquiries />} />
        </Route>


        <Route path="/admin" element={user?.isAdmin === "admin" ? <MainLayout /> : <Login/>}>
          <Route index element={<DashboardPowerBI />} />
          <Route path="enquiries" element={<Enquiries />} />
          {/* <Route path="enquiries/:id" element={<ViewEnq />} /> */}
          {/* <Route path="blog-list" element={<Bloglist />} />
          <Route path="blog" element={<Addblog />} />
          <Route path="blog/:id" element={<Addblog />} />
          <Route path="coupon-list" element={<Couponlist />} />
          <Route path="coupon" element={<AddCoupon />} />
          <Route path="coupon/:id" element={<AddCoupon />} />
          <Route path="blog-category-list" element={<Blogcatlist />} />
          <Route path="blog-category" element={<Addblogcat />} />
          <Route path="blog-category/:id" element={<Addblogcat />} /> */}
          <Route path="sales-admin" element={<Sales/>}/>
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<ViewOrder />} />
          <Route path="customers" element={<Customers />} />
          <Route path="list-color" element={<Colorlist />} />
          <Route path="color" element={<Addcolor />} />
          <Route path="color/:id" element={<Addcolor />} />
          <Route path="list-category" element={<Categorylist />} />
          <Route path="category" element={<Addcat />} />
          <Route path="category/:id" element={<Addcat />} />
          <Route path="list-size" element={<Sizelist />} />
          <Route path="size" element={<AddSize />} />
          <Route path="size/:id" element={<AddSize />} />
          <Route path="list-product" element={<Productlist />} />
          <Route path="product" element={<Addproduct />} />
          <Route path="edit-product/:id" element={<EditProduct/>} />
          <Route path="suppliers" element={<AddSupplier/>} />
          <Route path="list-supplier" element={<SupplierList/>} />
          <Route path="edit-supplier/:id" element={<EditSupplier/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="sales-report" element={<SalesReport/>} />
          <Route path="inventory-report" element={<InventoryReport/>} />
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;