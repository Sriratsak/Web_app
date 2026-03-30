// นำเข้า Module ที่จำเป็น
import { Link, useNavigate } from "react-router-dom"; // Link: สำหรับสร้างลิงก์ไปหน้าอื่น, useNavigate: เปลี่ยนหน้าแบบ programmatically
import { useState } from "react"; // useState: ใช้จัดการ state ของ component
import axios from "axios"; // axios: สำหรับทำ HTTP request ไป backend

function Login() {
  // ---การเก็บค่าข้างในจะเป็น array destructuring การแยกค่าออกจาก State ตัวแปรพิเศษของ component สำหรับเก็บค่าที่ผู้ใช้กรอกหรือเปลี่ยนแปรง ---
  // --- useState(""); เป็นฟังก์ชันของ React ที่ สร้าง state ใหม่ ---
  const [email, setEmail] = useState(""); //  เก็บค่าอีเมล
  const [password, setPassword] = useState(""); // เก็บค่ารหัสผ่าน
  const navigate = useNavigate(); // ใช้เปลี่ยนหน้า หลัง login สำเร็จ

  // --- State สำหรับจัดการ Error Modal ---
  const [errorModal, setErrorModal] = useState({
    show: false, // ควบคุมให้ modal แสดงหรือซ่อน
    title: "", // หัวข้อ error
    message: "", // รายละเอียด error
  });
  // --- เป็นชื่อฟังก์ชัน (Function) ใช้เก็บ logic ---
  const check_login = async (e) => {
    e.preventDefault();
    try { //ส่ง HTTP request ไป server
      const response = await axios.post(
        //มี 3 พารามิเตอร์หลักๆ คือ url, data, config
        "http://localhost/Web_app/backend/api/member.php/login",
        { email, password },
        // withCredentials: true = บอก axios ส่ง cookie / session ไปด้วย
        { withCredentials: true },
      );
      console.log(response.data)
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.user.role === "user") navigate("/withdraw");
        else if (response.data.user.role === "admin")
          //ทำงานเป็นการส่งผู้ใช้ไปตาม path ต้องการ
          navigate("/dashboard_admin"); 
      }

    } catch (error) {
      // ค่าเริ่มต้นถ้าติดต่อ Server ไม่ได้
      //ต่างจาก const ที่ ไม่สามารถเปลี่ยนค่าได้หลังประกาศ
      let mainTitle = "เข้าสู่ระบบไม่สำเร็จ";
      let detailMsg = "เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองใหม่อีกครั้ง";
      
      //ตรวจสอบก่อนว่า server ส่ง error message มาจริง ๆ
      if (error.response && error.response.data) {
        const serverMsg = error.response.data.message;

        // --- แยกกรณีตาม Message ที่ Backend ส่งมา ---
        if (serverMsg.includes("ระงับ")) {
          // กรณีบัญชีถูกระงับ (ตามรูปที่คุณส่งมา)
          mainTitle = "บัญชีถูกระงับการใช้งาน";
          detailMsg =
            "บัญชีของคุณถูกระงับการเข้าถึงระบบชั่วคราว โปรดตรวจสอบข้อมูลให้ถูกต้อง หรือติดต่อผู้จัดการเพื่อขอเปิดใช้งาน";
        } else {
          // กรณีรหัสผ่านผิด หรือไม่พบอีเมล
          mainTitle = "รหัสผ่านไม่ถูกต้อง";
          detailMsg =
            "คุณระบุอีเมลหรือรหัสผ่านผิดพลาด โปรดตรวจสอบและกรอกข้อมูลใหม่อีกครั้ง หรือติดต่อผู้จัดการหากลืมรหัสผ่าน";
        }
      }

      setErrorModal({
        show: true,
        title: mainTitle,
        message: detailMsg,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4 relative">
      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg animate-fadeIn">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <img src="/image-Photoroom.png" alt="logo" className="w-10" />
        </div>

        <div className="text-center mb-5">
          <h3 className="text-lg font-bold font-kanit">ระบบจัดการคลังสินค้า</h3>
          <p className="text-sm text-gray-500">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        <form className="space-y-4" onSubmit={check_login}>
          <div>
            <label className="text-sm font-semibold text-gray-700">อีเมล</label>
            <input
              type="email"
              placeholder="example@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              รหัสผ่าน
            </label>
            <input
              type="password"
              placeholder="*******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-black active:scale-[0.98] transition-all font-bold shadow-lg"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          ยังไม่มีบัญชี?
          <Link
            to="/register"
            className="text-indigo-600 font-bold ml-1 hover:text-indigo-800"
          >
            ลงทะเบียนใหม่
          </Link>
        </p>
      </div>

      {/* --- Error Modal ดีไซน์ใหม่ตามสั่ง --- */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[340px] p-8 rounded-[2.5rem] shadow-2xl text-center transform transition-all scale-in-center border border-gray-100">
            {/* Warning Icon สวยๆ */}
            <div className="w-20 h-20 bg-amber-50 text-amber-500 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* ข้อความ Title & Message ตามโจทย์ */}
            <h2 className="text-2xl font-black text-gray-800 mb-3 tracking-tight">
              {errorModal.title}
            </h2>

            <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100">
              <p className="text-gray-600 leading-relaxed font-medium text-[15px]">
                {errorModal.message}
              </p>
            </div>

            {/* ปุ่มกดรับทราบ */}
            <button
              onClick={() =>
                setErrorModal({ show: false, title: "", message: "" })
              }
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-gray-200"
            >
              ตกลง และปิดหน้านี้
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
