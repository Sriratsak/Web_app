import { useState } from "react";
import { Link } from "react-router-dom";
import "../Kongkiat.css";
function Login() {
  return (
    <>
      <div className="container">
        <div className="groud">
          <div className="inner">
            <div className="Logo">
              <img src="image-Photoroom.png" />
            </div>

            <div className="text">
              <h3>ระบบจัดการคลังสินค้า</h3>
              <p className="p1">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            </div>

            <form>
              <div className="la">
                <label>อีเมล</label>
                <input type="email" placeholder="example@email.com" required />
              </div>

              <div className="la">
                <label>รหัสผ่าน</label>
                <input type="password" placeholder="*******" required />
              </div>

              <div className="but">
                <button type="submit">เข้าสู่ระบบ</button>
              </div>
            </form>

            <p className="p">
              ยังไม่มีบัญชี?
              <Link to="/register"> ลงทะเบียน</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
