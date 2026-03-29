import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/Web_app/backend/api",
  withCredentials: true,
});

// 🕒 1. สร้างฟังก์ชันไว้นอก Component เพื่อให้เรียกใช้ได้ทันทีไม่ต้องรอ Render
const getThaiToday = () => {
  return new Date().toLocaleDateString('sv-SE'); 
};

export default function Receive() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ 2. แก้ตรงนี้: เซตค่าเริ่มต้นเป็นวันที่ปัจจุบันทันที (ห้ามใส่ "")
  const [filterDate, setFilterDate] = useState(getThaiToday());

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product.php");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetch products error:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get("/stock_in.php");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetch history error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🕒 3. อัปเดตเผื่อไว้กรณีเปิดเครื่องข้ามวัน
    const today = getThaiToday();
    setFilterDate(today); 

    fetchProducts();
    fetchHistory();
  }, []);

  const categories = ["all", ...new Set(products.map((p) => p.cat_name).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.prod_name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.cat_name === selectedCategory;
    return matchSearch && matchCategory;
  });

  const toggleProduct = (product) => {
    const exists = selectedItems.find((i) => i.prod_id === product.prod_id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.prod_id !== product.prod_id));
    } else {
      setSelectedItems([...selectedItems, { ...product, qty: "" }]);
    }
  };

  const updateQty = (prod_id, value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.prod_id === prod_id ? { ...item, qty: value } : item
        )
      );
    }
  };

  const handlePreSubmit = () => {
    if (selectedItems.length === 0) { alert("กรุณาเลือกสินค้าก่อน"); return; }
    for (let item of selectedItems) {
      if (!item.qty || Number(item.qty) <= 0) {
        alert(`กรุณากรอกจำนวนสินค้า ${item.prod_name} ให้ถูกต้อง`);
        return;
      }
    }
    setIsModalOpen(true);
  };

  const confirmSubmit = async () => {
    try {
      const currentToday = getThaiToday(); // ดึงวันที่ล่าสุดตอนกดปุ่ม
      for (let item of selectedItems) {
        await api.post("/stock_in.php", {
          prod_id: item.prod_id,
          quantity: Number(item.qty),
          date: currentToday, // ✅ ส่งวันที่ปัจจุบันไปบันทึก
          note: note
        });
      }
      alert("บันทึกรับเข้าสำเร็จแล้วจ้า! ✨");
      await fetchHistory();
      await fetchProducts();
      setSelectedItems([]);
      setNote("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("submit error:", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  // กรองประวัติ: ตอนนี้ filterDate จะมีค่า "2026-03-30" ตั้งแต่เริ่มโหลด ทำให้ข้อมูลขึ้นทันที
  const filteredHistory = history.filter((item) => item.date === filterDate);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900 font-kanit">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 overflow-y-auto">
          <header className="mb-6">
            <h2 className="text-2xl font-bold mb-1">📥 รับสินค้าเข้าคลัง</h2>
            <p className="text-gray-500">เพิ่มจำนวนสต็อกสินค้าเข้าระบบจัดการคลัง</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="🔍 ค้นชื่อสินค้าที่ต้องการรับเข้า..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-0 bg-gray-50 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-kanit"
                />
                <div className="flex gap-3">
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border-0 bg-gray-50 px-4 py-2 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none cursor-pointer font-kanit">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat === "all" ? "ทุกหมวดหมู่" : cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 bg-gray-50 rounded-2xl p-4 mb-6 custom-scrollbar">
                {loading ? (
                  <p className="text-center text-gray-400 py-10 font-kanit">กำลังโหลด...</p>
                ) : filteredProducts.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 font-kanit">ไม่พบสินค้า</p>
                ) : filteredProducts.map((item) => {
                  const selected = selectedItems.find((i) => i.prod_id === item.prod_id);
                  return (
                    <div key={item.prod_id}
                      className={`flex justify-between items-center p-3 rounded-2xl border-2 transition-all ${selected ? "bg-white border-green-500 shadow-md" : "bg-transparent border-transparent"}`}>
                      <div className="flex items-center gap-4 cursor-pointer select-none" onClick={() => toggleProduct(item)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.prod_name}</p>
                          <p className="text-xs text-gray-400">{item.cat_name} · ราคา {item.prod_price} บาท</p>
                        </div>
                      </div>
                      
                      {selected && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-2">จำนวน:</span>
                          <input 
                            type="text" 
                            inputMode="numeric" 
                            value={selected.qty}
                            placeholder="0"
                            onChange={(e) => updateQty(item.prod_id, e.target.value)}
                            className="w-14 bg-gray-100 border-0 px-1 py-1.5 rounded-xl text-center font-black text-green-600 focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-inner font-kanit"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <textarea placeholder="เขียนบันทึกเพิ่มเติม (ถ้ามี)..."
                value={note} onChange={(e) => setNote(e.target.value)}
                className="w-full border-0 bg-gray-50 p-4 rounded-2xl min-h-[100px] focus:ring-1 focus:ring-green-500 outline-none text-sm mb-4 font-kanit"
              />
              <button onClick={handlePreSubmit}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-[0.98] font-kanit">
                ยืนยันการรับเข้า
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col h-[650px]">
              <div className="flex justify-between items-center mb-6 flex-none">
                <h3 className="font-bold text-lg">📜 ประวัติรับสินค้า</h3>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                  className="border-0 bg-gray-100 px-4 py-2 rounded-xl text-sm outline-none font-kanit"
                />
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 font-kanit">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-24 text-gray-300">
                    <p className="text-5xl mb-4">📅</p>
                    <p className="text-sm font-medium">ไม่มีรายการประวัติในวันที่เลือก</p>
                  </div>
                ) : filteredHistory.map((item, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center hover:border-green-200 border border-gray-50 transition-all group shadow-sm hover:shadow-md">
                    <div>
                      <p className="font-bold text-gray-800">{item.prod_name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                         👤 {item.user_name} · 📅 {item.date}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl font-black group-hover:scale-110 transition-transform">
                      +{item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-pop-in">
            <div className="p-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">✓</div>
              <h3 className="text-2xl font-black text-center mb-2 font-kanit">ยืนยันรับเข้าสต็อก?</h3>
              <p className="text-gray-400 text-center text-sm mb-6 font-kanit">กรุณาตรวจสอบรายการสินค้าที่เลือก</p>
              <div className="bg-gray-50 rounded-3xl p-5 mb-8 max-h-52 overflow-y-auto border border-gray-100 text-sm">
                {selectedItems.map((item) => (
                  <div key={item.prod_id} className="flex justify-between py-2.5 border-b border-dashed border-gray-200 last:border-0 font-kanit">
                    <span className="text-gray-600 font-medium">{item.prod_name}</span>
                    <span className="font-bold text-green-600">+{item.qty} ชิ้น</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 font-kanit">
                <button onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl border border-gray-200 font-bold text-gray-400 hover:bg-gray-50 transition-colors">
                  ยกเลิก
                </button>
                <button onClick={confirmSubmit}
                  className="flex-1 py-4 rounded-2xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                  ยืนยันบันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700;800&display=swap');
        .font-kanit { font-family: 'Kanit', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
        @keyframes pop-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}