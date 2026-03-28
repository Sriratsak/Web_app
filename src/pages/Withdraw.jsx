import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Withdraw() {
  // mock สินค้า
  const [products, setProducts] = useState([
    { id: 1, name: "ข้าวสาร", stock: 10 },
    { id: 2, name: "น้ำปลา", stock: 5 },
    { id: 3, name: "น้ำตาล", stock: 0 },
  ]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);

  const currentProduct = products.find(
    (p) => p.id === Number(selectedProduct)
  );

  const handleSubmit = () => {
    if (!selectedProduct || !qty || qty <= 0) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    if (qty > currentProduct.stock) {
      alert("จำนวนเกินสต็อก");
      return;
    }

    // ลด stock
    const updatedProducts = products.map((p) =>
      p.id === currentProduct.id
        ? { ...p, stock: p.stock - qty }
        : p
    );

    setProducts(updatedProducts);

    const newItem = {
      name: currentProduct.name,
      qty: qty,
      note: note,
      date: new Date().toLocaleString(),
    };

    setHistory([newItem, ...history]);

    setSelectedProduct("");
    setQty("");
    setNote("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white shadow px-6 flex justify-between items-center">
          <h1 className="text-lg font-semibold">
            
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              👤 ผู้ใช้งาน: แอดมิน
            </span>
            <button className="bg-gray-200 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition">
              ออกจากระบบ
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              📤 เบิกสินค้าออกจากคลัง
            </h2>
            <p className="text-gray-500 text-sm">
              กรอกข้อมูลเพื่อเบิกสินค้า
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT - FORM */}
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="font-semibold text-lg mb-1">
                📦 บันทึกการเบิกสินค้า
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                กรอกข้อมูลการเบิกสินค้า
              </p>

              <div className="space-y-5">
                {/* Select */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    เลือกสินค้า *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 
                    focus:ring-2 focus:ring-black focus:outline-none"
                  >
                    <option value="">-- เลือกสินค้า --</option>
                    {products.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {currentProduct && (
                    <p className="text-xs text-gray-500 mt-2">
                      คงเหลือ: {currentProduct.stock}
                    </p>
                  )}
                </div>

                {/* Qty */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    จำนวนที่เบิก *
                  </label>
                  <input
                    type="number"
                    placeholder="กรอกจำนวน"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 
                    focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    หมายเหตุ
                  </label>
                  <textarea
                    rows="3"
                    placeholder="เช่น ใช้งานในครัว"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 
                    focus:ring-2 focus:ring-black focus:outline-none resize-none"
                  />
                </div>

                {/* Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!selectedProduct || !qty || qty <= 0}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    selectedProduct && qty > 0
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  บันทึกการเบิกสินค้า
                </button>
              </div>
            </div>

            {/* RIGHT - HISTORY */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-1">
                📜 ประวัติการเบิกสินค้า
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                รายการล่าสุด ({history.length} รายการ)
              </p>

              {history.length === 0 ? (
                <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
                  ยังไม่มีประวัติ
                </div>
              ) : (
                <ul className="space-y-3">
                  {history.map((item, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-red-500 font-semibold">
                          -{item.qty}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.note}
                        </p>
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