import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar"; // ✅ 1. Import เข้ามา

export default function Products() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    sku: "",
    name: "",
    qty: 0,
  });

  const [products, setProducts] = useState([]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        
        {/* ✅ 2. เรียกใช้ Navbar แทนที่ Header เดิม */}
        <Navbar />

        {/* Main Content */}
        <main className="p-8">
          {/* Header ส่วนหัวของหน้าจัดการสินค้า */}
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

          {/* Card แสดงรายการสินค้า */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="mb-4">
              <h3 className="font-semibold">รายการสินค้า</h3>
              <p className="text-sm text-gray-400">
                ทั้งหมด {products.length} รายการ
              </p>
            </div>

            {/* ค้นหา */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 ค้นหารายการสินค้า..."
                className="w-full bg-gray-100 px-4 py-2 rounded-lg outline-none text-sm"
              />
            </div>

            {/* แสดงสินค้า */}
            {products.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
                ไม่พบข้อมูลสินค้า
              </div>
            ) : (
              <ul className="space-y-2">
                {products.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
                    <div>
                      <p className="font-semibold text-gray-800 text-base">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        รหัส: {item.sku}
                      </p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {item.qty}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>

        {/* Modal เพิ่มสินค้า (โค้ดส่วนเดิมของอ้วง) */}
        {open && (
           <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
             {/* ... โค้ด Modal ... */}
             <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
                <h2 className="text-lg font-semibold mb-6">เพิ่มสินค้า</h2>
                {/* SKU, Name, Qty inputs... */}
                <div className="flex gap-2 mt-6">
                   <button onClick={() => setOpen(false)} className="w-1/2 bg-gray-200 py-2 rounded-lg">ยกเลิก</button>
                   <button 
                     onClick={() => {
                       setProducts([...products, form]);
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