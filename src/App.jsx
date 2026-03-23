import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./com/Login";
import Register from "./com/Register";

// function Home() ลบได้ถ้าจะทำหน้า App เป็น แดชบอร์ด 
function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  );
}
// -----------------------------------------------------
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
