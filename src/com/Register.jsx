import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [check_password, setCheck_Password] = useState("");
  const [tel, setTel] = useState("");
  const register = async (e) => {
    e.preventDefault();

    // เช็ครหัสผ่านก่อน
    if (password !== check_password) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const reg = await axios.post(
        "http://localhost/Web_app/backend/api/member.php/register",
        {
          name: username,
          password: password,
          tel: tel,
          email: email,
          role: "user",
        }
      );

      if (reg.data.success) {
        alert("สมัครสมาชิกสำเร็จ");
        navigate("/login");
        setUsername("");
        setEmail("");
        setTel("");
        setPassword("");
        setCheck_Password("");
      } else {
        alert("อีเมลนี้ถูกใช้แล้ว");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg animate-fadeIn">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <img src="/image-Photoroom.png" alt="logo" className="w-10" />
        </div>

        <div className="text-center mb-5">
          <h3 className="text-lg font-bold">ลงทะเบียน</h3>
          <p className="text-sm text-gray-500">สร้างบัญชีใหม่เพื่อเข้าสู่ระบบ</p>
        </div>

        <form onSubmit={register} className="space-y-4">
          <div>
            <label className="text-sm">ชื่อนาม-สกุล</label>
            <input
              type="text"
              placeholder="ชื่อของคุณ"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-gray-100 border focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm">อีเมล</label>
            <input
              type="email"
              placeholder="example@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-gray-100 border focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm">เบอร์โทร</label>
            <input
              type="tel"
              placeholder="000-000-xxxx"
              required
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-gray-100 border focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="*******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-gray-100 border focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              placeholder="*******"
              required
              value={check_password}
              onChange={(e) => setCheck_Password(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-gray-100 border focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition"
          >
            ลงทะเบียน
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          มีบัญชีอยู่แล้ว?
          <Link
            to="/login"
            className="text-blue-600 font-semibold ml-1 hover:text-blue-800"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;