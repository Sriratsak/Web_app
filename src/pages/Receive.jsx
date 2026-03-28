import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Withdraw() {
  // 1. ข้อมูลสินค้า (Mockup)
  const [products, setProducts] = useState([
    { id: 1, name: "ข้าวสาร", stock: 50, category: "อาหาร", popular: true },
    { id: 2, name: "น้ำปลา", stock: 20, category: "อาหาร", popular: true },
    { id: 3, name: "น้ำตาล", stock: 15, category: "อาหาร", popular: false },
    { id: 4, name: "สบู่", stock: 30, category: "ของใช้", popular: true },
    { id: 5, name: "แชมพู", stock: 10, category: "ของใช้", popular: false },
  ]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPopular, setShowPopular] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = ["all", ...new Set(products.map(p => p.category))];

  // 🔍 ฟิลเตอร์สินค้า
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchPopular = showPopular ? p.popular : true;
    return matchSearch && matchCategory && matchPopular;
  });

  const toggleProduct = (product) => {
    const exists = selectedItems.find((i) => i.id === product.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== product.id));
    } else {
      setSelectedItems([...selectedItems, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  // 📂 ตรวจสอบก่อนเปิด Modal
  const handlePreSubmit = () => {
    if (selectedItems.length === 0) {
      alert("อ้วงลืมเลือกของที่จะเบิกนะ! เลือกก่อนจ้า");
      return;
    }

    for (let item of selectedItems) {
      const p = products.find(prod => prod.id === item.id);
      if (!item.qty || item.qty <= 0) {
        alert(`อย่าลืมใส่จำนวนที่จะเบิกของ ${item.name} นะจ๊ะ`);
        return;
      }
      if (item.qty > p.stock) {
        alert(`ของ ${item.name} มีไม่พอให้เบิกจ้า (เหลือแค่ ${p.stock})`);
        return;
      }
    }
    setIsModalOpen(true);
  };

  const confirmSubmit = () => {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const timeDisplay = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // ➖ อัปเดตสต็อก (ลบจำนวนออก)
    const updatedProducts = products.map((p) => {
      const selected = selectedItems.find((i) => i.id === p.id);
      return selected ? { ...p, stock: p.stock - selected.qty } : p;
    });

    setProducts(updatedProducts);

    const newHistory = selectedItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      note,
      fullDate: dateKey,
      displayTime: timeDisplay,
    }));

    setHistory([...newHistory, ...history]);
    setSelectedItems([]);
    setNote("");
    setIsModalOpen(false);
  };

  const filteredHistory = history.filter(item => item.fullDate === filterDate);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar />

      <div className="flex-1 p-8">
        <header className="mb-6">
          <h2 className="text-2xl font-bold mb-1">📤 บันทึกการเบิกสินค้า</h2>
          <p className="text-gray-500">บันทึกรายการนำสินค้าออกจากคลังและตัดยอดสต็อก</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* --- ฝั่งซ้าย: ฟอร์มเลือกสินค้า --- */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="🔍 ค้นหาสินค้าเพื่อเบิก..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-0 bg-gray-50 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border-0 bg-gray-50 px-4 py-2 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat === "all" ? "ทุกหมวดหมู่" : cat}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowPopular(!showPopular)}
                  className={`px-5 py-2 rounded-2xl text-sm font-medium border transition-all ${
                    showPopular ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  ⭐ ใช้บ่อย
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 border-0 bg-gray-50 rounded-2xl p-4 mb-6 custom-scrollbar">
              {filteredProducts.map((item) => {
                const selected = selectedItems.find(i => i.id === item.id);
                const isOutOfStock = item.stock <= 0;

                return (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center p-3 rounded-2xl border-2 transition-all ${
                      selected ? "bg-white border-red-500 shadow-md" : "bg-transparent border-transparent"
                    } ${isOutOfStock ? "opacity-50" : ""}`}
                  >
                    <div 
                      className={`flex items-center gap-4 cursor-pointer select-none ${isOutOfStock ? "cursor-not-allowed" : ""}`} 
                      onClick={() => !isOutOfStock && toggleProduct(item)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "bg-red-500 border-red-500" : "border-gray-300"}`}>
                        {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className={`text-xs ${isOutOfStock ? "text-red-500 font-bold" : "text-gray-400"}`}>
                          {isOutOfStock ? "สินค้าหมด" : `คงเหลือ ${item.stock} หน่วย`}
                        </p>
                      </div>
                    </div>
                    {selected && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">เบิก:</span>
                        <input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={selected.qty}
                          onChange={(e) => updateQty(item.id, e.target.value)}
                          className="w-16 bg-gray-100 border-0 px-2 py-1.5 rounded-xl text-center font-bold focus:ring-1 focus:ring-red-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <textarea
              placeholder="เหตุผลการเบิก / หมายเหตุ..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border-0 bg-gray-50 p-4 rounded-2xl min-h-[100px] focus:ring-1 focus:ring-red-500 outline-none text-sm mb-4"
            />
            <button
              onClick={handlePreSubmit}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-[0.98]"
            >
              บันทึกการเบิกสินค้า
            </button>
          </div>

          {/* --- ฝั่งขวา: ประวัติ (ล็อกขนาดพร้อม Scrollbar) --- */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col h-[650px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 flex-none">
              <h3 className="font-bold text-lg flex items-center gap-2">📜 ประวัติการเบิก</h3>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border-0 bg-gray-100 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-24 text-gray-300">
                  <p className="text-5xl mb-4">📅</p>
                  <p className="text-sm">ไม่มีประวัติการเบิกในวันที่เลือก</p>
                </div>
              ) : (
                filteredHistory.map((item, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-50 hover:border-red-200 transition-all">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                        🕙 เวลา {item.displayTime} น.
                      </p>
                      {item.note && (
                        <p className="text-xs text-red-400 mt-2 bg-red-50 px-2 py-1 rounded-lg w-fit">
                          📝 {item.note}
                        </p>
                      )}
                    </div>
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-2xl font-black">
                      -{item.qty}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL ยืนยันการเบิก --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-pop-in">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">⚠️</div>
              <h3 className="text-2xl font-black mb-2 text-gray-800">ยืนยันการเบิกสินค้าออก</h3>
              <p className="text-gray-400 text-sm mb-6">กรุณาตรวจสอบรายการก่อนตัดยอดสต็อก</p>
              
              <div className="bg-gray-50 rounded-3xl p-5 mb-8 max-h-52 overflow-y-auto border border-gray-100 text-left text-sm">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2.5 border-b border-dashed border-gray-200 last:border-0">
                    <span className="text-gray-600 font-medium">{item.name}</span>
                    <span className="font-bold text-red-600">-{item.qty} ชิ้น</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl border border-gray-200 font-bold text-gray-400 hover:bg-gray-50 transition-colors">ยกเลิก</button>
                <button onClick={confirmSubmit} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg">ยืนยันเบิกออก</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
        @keyframes pop-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
    </div>
  );
}