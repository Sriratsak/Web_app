import React from "react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow-sm px-8 flex justify-between items-center w-full">
      {/* ฝั่งซ้าย: เว้นว่างไว้เหมือนในรูป หรือจะใส่ชื่อหน้าก็ได้ */}
      <div className="flex-1"></div>

      {/* ฝั่งขวา: ข้อมูลผู้ใช้งานและปุ่ม */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          ผู้ใช้งาน: <span className="font-medium">แอดมินหล่อ</span>
        </span>
        
        <button 
          onClick={() => alert("ออกจากระบบเรียบร้อย!")}
          className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors shadow-sm"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}