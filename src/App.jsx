import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard_admin from "./admin/Dashboard_admin";
import Products_admin from "./admin/Products_admin";
import StockReport_admin from "./admin/StockReport_admin";
// import Withdraw_admin from "./admin/Withdraw_admin";
// import Receive_admin from "./admin_admin";
import Users_admin from "./admin/Users_admin"; 
import Withdraw from "./pages/Withdraw";
import Receive from "./pages/Receive";
import Login from "./com/Login";
import Register from "./com/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/dashboard_admin" element={<Dashboard_admin />} />
        <Route path="/products_admin" element={<Products_admin />} />
        <Route path="/users_admin" element={<Users_admin />} /> 
        <Route path="/StockReport_admin" element={<StockReport_admin />} /> 

        {/* User */}
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/Receive" element={<Receive/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;