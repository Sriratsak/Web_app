import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Products() {
  const [open, setOpen] = useState(false);

  // ฟอร์ม
  const [form, setForm] = useState({
    sku: "",
    name: "",
    qty: 0,
  });

  // ✅ เพิ่ม state เก็บสินค้า
  const [products, setProducts] = useState([]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white shadow px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold"></h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">ผู้ใช้งาน: แอดมิน</span>
            <button className="bg-gray-200 px-3 py-1 rounded-lg text-sm">
              ออกจากระบบ
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">จัดการสินค้า</h2>
              <p className="text-gray-500">จัดการข้อมูลสินค้าในคลัง</p>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
            >
              + เพิ่มสินค้าใหม่
            </button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="mb-4">
              <h3 className="font-semibold">รายการสินค้า</h3>
              <p className="text-sm text-gray-400">
                ทั้งหมด {products.length} รายการ
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 ค้นหารายการสินค้า..."
                className="w-full bg-gray-100 px-4 py-2 rounded-lg outline-none text-sm"
              />
            </div>

            {/* 🔥 แสดงสินค้า */}
            {products.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
                ไม่พบข้อมูลสินค้า
              </div>
            ) : (
              <ul className="space-y-2">
                {products.map((item, index) => (
                  <li className="flex justify-between items-center bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
                    {/* ซ้าย */}
                    <div>
                      <p className="font-semibold text-gray-800 text-base">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        รหัส: {item.sku}
                      </p>
                    </div>

                    {/* ขวา */}
                    <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {item.qty}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-6">เพิ่มสินค้า</h2>

              {/* SKU */}
              <div className="mb-4">
                <label className="block text-sm mb-1">รหัสสินค้า</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                />
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm mb-1">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                />
              </div>

              {/* Qty */}
              <div className="mb-6">
                <label className="block text-sm mb-1">จำนวน</label>
                <input
                  type="number"
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: e.target.value })}
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="w-1/2 bg-gray-200 py-2 rounded-lg"
                >
                  ยกเลิก
                </button>

                <button
                  onClick={() => {
                    setProducts([...products, form]); // ✅ เพิ่มสินค้า
                    setOpen(false);
                    setForm({ sku: "", name: "", qty: 0 });
                  }}
                  className="w-1/2 bg-blue-600 text-white py-2 rounded-lg"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
