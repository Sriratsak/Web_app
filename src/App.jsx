import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard_admin from "./admin/Dashboard_admin";
import Products_admin from "./admin/Products_admin";
{/* ของแอดมิน */}
import Withdraw_admin from "./admin/Withdraw_admin";
import Receive_admin from "./admin/Receive_admin";
{/* ของ user*/}
import Withdraw from "./pages/Withdraw";
import Receive from "./pages/Receive";
{/* ของ สมัคร*/}
import Login from "./com/Login";
import Register from "./com/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* สำหรับสมัครและ login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ของแอดมิน */}
        <Route path="/dashboard_admin" element={<Dashboard_admin />} />
        <Route path="/products_admin" element={<Products_admin />} />
        <Route path="/withdraw_admin" element={<Withdraw_admin/>} />
        <Route path="/receive_admin" element={<Receive_admin />} />
        {/* ของ user */}
        <Route path="/withdraw" element={<Withdraw/>} />
        <Route path="/receive" element={<Receive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
