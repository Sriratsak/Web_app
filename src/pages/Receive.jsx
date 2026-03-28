import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Receive() {
  const [products] = useState([
    { id: 1, name: "ข้าวสาร" },
    { id: 2, name: "น้ำปลา" },
    { id: 3, name: "น้ำตาล" },
  ]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");

  const [history, setHistory] = useState([]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white shadow px-6 flex justify-between items-center">
          <p className="text-gray-500 text-sm"></p>
        </header>

        {/* Main */}
        <main className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">บันทึกการเบิกสินค้า</h2>
            <p className="text-sm text-gray-400">
              บันทึกการเบิกสินค้าออกจากคลัง
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-4">📦 บันทึกการเบิกสินค้า</h3>
              <p className="text-gray-500 text-sm">กรอกข้อมูลการเบิกสินค้า</p>

              {/* Select */}
              <div className="mb-4">
                <label className="text-sm">เลือกสินค้า</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full mt-1 bg-gray-100 p-2 rounded-lg"
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {products.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Qty */}
              <div className="mb-4">
                <label className="text-sm">จำนวนที่เบิก</label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full mt-1 bg-gray-100 p-2 rounded-lg"
                  placeholder="กรอกจำนวน"
                />
              </div>

              {/* Note */}
              <div className="mb-6">
                <label className="text-sm">หมายเหตุ / เหตุผล</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full mt-1 bg-gray-100 p-2 rounded-lg"
                />
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  const newItem = {
                    name: selectedProduct,
                    qty: qty,
                    note: note,
                    date: new Date().toLocaleString(),
                  };

                  setHistory([newItem, ...history]);

                  setSelectedProduct("");
                  setQty("");
                  setNote("");
                }}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                บันทึกการรับสินค้า
              </button>
            </div>

            {/* RIGHT */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-2">ประวัติการเบิกสินค้าออกจากคลัง</h3>
              <p className="text-sm text-gray-400 mb-4">
                ({history.length} รายการ)
              </p>

              {history.length === 0 ? (
                <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
                  ยังไม่มีประวัติการรับสินค้า
                </div>
              ) : (
                <ul className="space-y-3">
                  {history.map((item, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg flex justify-between"
                    >
                      <div>
                        <p>{item.name}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>

                      <div className="text-green-600 font-semibold">
                        +{item.qty}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
