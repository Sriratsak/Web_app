import { useState } from "react";
import { Link } from "react-router-dom";
import "../Kongkiat.css";
function Register() {
  return (
    <>
      <div className="container">
        <div className="groud">
          <div className="inner">
            <div className="Logo">
              <img src="image-Photoroom.png" />
            </div>

            <div className="text">
              <h3>ลงทะเบียน</h3>
              <p className="p1">สร้างบัญชีใหม่เพื่อเข้าสู่ระบบ</p>
            </div>

            <form>
              <div className="la">
                <label>ชื่อนาม-สกุล</label>
                <input type="text" placeholder="ชื่อของคุณ" required />
              </div>
              <div className="la">
                <label>อีเมล</label>

                <input type="email" placeholder="example@email.com" required />
              </div>
              <div className="la">
                <label>รหัสผ่าน</label>

                <input type="password" placeholder="*******" required />
              </div>

              <div className="la">
                <label>ยืนยันรหัสผ่าน</label>

                <input type="password" placeholder="*******" required />
              </div>

              <div className="but">
                <button type="submit">ลงทะเบียน</button>
              </div>
            </form>
            <p className="p">
              มีบัญชีอยู่แล้ว?
              <Link to="/login"> เข้าสู่ระบบ</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
