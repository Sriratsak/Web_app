import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Products from "./pages/Products";
import Withdraw from "./pages/Withdraw";
import Receive from "./pages/Receive";
import Login from "./com/Login";
import Register from "./com/Register";
import Admin from "./admin/admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/withdraw" element={<Withdraw/>} />
        <Route path="/receive" element={<Receive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
