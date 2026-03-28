import { Link } from "react-router-dom";

function Login() {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      
      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg animate-fadeIn">
        
    
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <img src="/image-Photoroom.png" alt="logo" className="w-10" />
        </div>

    
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold">ระบบจัดการคลังสินค้า</h3>
          <p className="text-sm text-gray-500">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-sm">อีเมล</label>
            <input
              type="email"
              placeholder="example@email.com"
              required
              className="w-full mt-1 p-2 rounded-lg bg-gray-100 border focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="*******"
              required
              className="w-full mt-1 p-2 rounded-lg bg-gray-100 border focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Link */}
        <p className="text-center mt-4 text-sm">
          ยังไม่มีบัญชี?
          <Link to="/register" className="text-blue-600 font-semibold ml-1 hover:text-blue-800">
            ลงทะเบียน
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;