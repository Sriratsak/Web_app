import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Receive() {
  // 1. ข้อมูลสินค้า (ในอนาคตเปลี่ยนเป็นดึงจาก API)
  const [products, setProducts] = useState([
    { id: 1, name: "ข้าวสาร", stock: 10, category: "อาหาร", popular: true },
    { id: 2, name: "น้ำปลา", stock: 5, category: "อาหาร", popular: true },
    { id: 3, name: "น้ำตาล", stock: 8, category: "อาหาร", popular: false },
    { id: 4, name: "สบู่", stock: 15, category: "ของใช้", popular: true },
    { id: 5, name: "แชมพู", stock: 7, category: "ของใช้", popular: false },
    { id: 6, name: "น้ำมันพืช", stock: 12, category: "อาหาร", popular: true },
    { id: 7, name: "ผงซักฟอก", stock: 20, category: "ของใช้", popular: false },
  ]);

  // 2. States สำหรับการจัดการฟอร์มและฟิลเตอร์
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPopular, setShowPopular] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // ดึงหมวดหมู่ที่ไม่ซ้ำกันออกมาทำ Dropdown
  const categories = ["all", ...new Set(products.map(p => p.category))];

  // 3. Logic การกรองสินค้า
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchPopular = showPopular ? p.popular : true;
    return matchSearch && matchCategory && matchPopular;
  });

  // 4. การจัดการเลือกสินค้า
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

  // 5. การบันทึกข้อมูล
  const handlePreSubmit = () => {
    if (selectedItems.length === 0) {
      alert("อ้วงลืมเลือกสินค้าหรือเปล่า? เลือกก่อนบันทึกนะจ๊ะ");
      return;
    }
    for (let item of selectedItems) {
      if (!item.qty || item.qty <= 0) {
        alert(`กรุณากรอกจำนวนให้สินค้า ${item.name} ด้วยนะ`);
        return;
      }
    }
    setIsModalOpen(true);
  };

  const confirmSubmit = () => {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0]; 
    const timeDisplay = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // อัปเดตสต็อกในเครื่อง (บวกเพิ่ม)
    const updatedProducts = products.map((p) => {
      const selected = selectedItems.find((i) => i.id === p.id);
      return selected ? { ...p, stock: p.stock + selected.qty } : p;
    });

    setProducts(updatedProducts);

    // เพิ่มลงประวัติ
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

  // กรองประวัติแสดงตามวันที่เลือก
  const filteredHistory = history.filter(item => item.fullDate === filterDate);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar />

      <div className="flex-1 p-8">
        <header className="mb-6">
          <h2 className="text-2xl font-bold mb-1">📥 รับสินค้าเข้าคลัง</h2>
          <p className="text-gray-500">เพิ่มจำนวนสต็อกสินค้าเข้าระบบจัดการคลัง</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* --- ฝั่งซ้าย: ฟอร์มเลือกสินค้า --- */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="🔍 ค้นชื่อสินค้าที่ต้องการรับเข้า..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-0 bg-gray-50 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
              
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border-0 bg-gray-50 px-4 py-2 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "ทุกหมวดหมู่" : cat}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowPopular(!showPopular)}
                  className={`px-5 py-2 rounded-2xl text-sm font-medium border transition-all ${
                    showPopular ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  ⭐ ใช้บ่อย
                </button>
              </div>
            </div>

            {/* รายการสินค้าที่เลือกได้ */}
            <div className="max-h-80 overflow-y-auto space-y-2 border-0 bg-gray-50 rounded-2xl p-4 mb-6 custom-scrollbar">
              {filteredProducts.map((item) => {
                const selected = selectedItems.find(i => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center p-3 rounded-2xl border-2 transition-all ${
                      selected ? "bg-white border-green-500 shadow-md" : "bg-transparent border-transparent"
                    }`}
                  >
                    <div 
                      className="flex items-center gap-4 cursor-pointer select-none" 
                      onClick={() => toggleProduct(item)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                        {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">สต็อกปัจจุบัน: {item.stock}</p>
                      </div>
                    </div>
                    
                    {selected && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">จำนวน:</span>
                        <input
                          type="number"
                          min="1"
                          value={selected.qty}
                          onChange={(e) => updateQty(item.id, e.target.value)}
                          className="w-16 bg-gray-100 border-0 px-2 py-1.5 rounded-xl text-center font-bold focus:ring-1 focus:ring-green-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <textarea
              placeholder="เขียนบันทึกเพิ่มเติม (ถ้ามี)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border-0 bg-gray-50 p-4 rounded-2xl min-h-[100px] focus:ring-1 focus:ring-green-500 outline-none text-sm mb-4"
            />
            
            <button
              onClick={handlePreSubmit}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-[0.98]"
            >
              ยืนยันการรับเข้า
            </button>
          </div>

          {/* --- ฝั่งขวา: ประวัติ (ล็อกขนาดพร้อม Scrollbar) --- */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col h-[650px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 flex-none">
              <h3 className="font-bold text-lg flex items-center gap-2">📜 ประวัติรับสินค้า</h3>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border-0 bg-gray-100 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            {/* ส่วนที่ Scroll ได้ */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-24 text-gray-300">
                  <p className="text-5xl mb-4">📅</p>
                  <p className="text-sm">ไม่มีรายการประวัติในวันที่เลือก</p>
                </div>
              ) : (
                filteredHistory.map((item, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-50 hover:border-green-200 transition-all">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                        🕙 {item.displayTime} น.
                      </p>
                      {item.note && (
                        <p className="text-xs text-blue-500 mt-2 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                          📝 {item.note}
                        </p>
                      )}
                    </div>
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl font-black">
                      +{item.qty}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL ยืนยันรายการ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-pop-in">
            <div className="p-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
              <h3 className="text-2xl font-black text-center mb-2 text-gray-800">ยืนยันรับเข้าสต็อก?</h3>
              <p className="text-gray-400 text-center text-sm mb-6">กรุณาตรวจสอบรายการสินค้าที่เลือก</p>
              
              <div className="bg-gray-50 rounded-3xl p-5 mb-8 max-h-52 overflow-y-auto border border-gray-100 text-sm">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2.5 border-b border-dashed border-gray-200 last:border-0">
                    <span className="text-gray-600 font-medium">{item.name}</span>
                    <span className="font-bold text-green-600">+{item.qty} ชิ้น</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 rounded-2xl border border-gray-200 font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={confirmSubmit} 
                  className="flex-1 py-4 rounded-2xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg"
                >
                  ยืนยันบันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS สำหรับ Scrollbar เล็กน้อย */}
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