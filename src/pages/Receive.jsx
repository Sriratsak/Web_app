import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// 🕒 1. ย้ายฟังก์ชันมาไว้นอก Component เพื่อให้เรียกใช้ได้ทันทีตอนเริ่มโหลด
const getThaiToday = () => {
  return new Date().toLocaleDateString('sv-SE'); // คืนค่า YYYY-MM-DD ตามเวลาเครื่อง
};

export default function Withdraw() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ 2. เซตค่าเริ่มต้นตรงๆ ด้วยฟังก์ชันเลย (หน้าจอจะโชว์วันที่ปัจจุบันทันที 100%)
  const [filterDate, setFilterDate] = useState(getThaiToday());

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    // 🕒 3. บังคับอัปเดตวันที่อีกรอบเพื่อความชัวร์ (เผื่อเปิดค้างไว้ข้ามคืน)
    setFilterDate(getThaiToday()); 
    
    fetchProducts();
    fetchHistory();
  }, []);

  // 🔥 โหลดสินค้า
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost/Web_app/backend/api/product.php", { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : [];
      const formatted = data.map((item) => ({
        id: item.prod_id,
        name: item.prod_name,
        stock: Math.max(0, Number(item.prod_quantity) || Number(item.quantity) || 0),
        category: item.cat_name || "ทั่วไป",
      }));
      setProducts(formatted);
    } catch (err) {
      console.error("โหลดสินค้าไม่สำเร็จ", err);
    }
  };

  // 🔥 โหลด history
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost/Web_app/backend/api/stock_out.php", { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : [];
      const formatted = data.map((item) => ({
        name: item.prod_name,
        qty: item.quantity,
        fullDate: item.date || "", 
        displayTime: item.date ? new Date(item.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : "",
        note: item.note || "",
      }));
      setHistory(formatted);
    } catch (err) {
      console.error("โหลด history ไม่สำเร็จ", err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const toggleProduct = (product) => {
    const exists = selectedItems.find((i) => i.id === product.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== product.id));
    } else {
      setSelectedItems([...selectedItems, { ...product, qty: "1" }]);
    }
  };

  const updateQty = (id, value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      setSelectedItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty: value } : item))
      );
    }
  };

  const handlePreSubmit = () => {
    if (selectedItems.length === 0) return alert("อ้วงลืมเลือกของ 😡");
    for (let item of selectedItems) {
      const p = products.find((prod) => prod.id === item.id);
      const numQty = Number(item.qty);
      if (!item.qty || numQty <= 0) return alert(`ใส่จำนวนของ ${item.name}`);
      if (numQty > p.stock) return alert(`ของ ${item.name} เหลือแค่ ${p.stock}`);
    }
    setIsModalOpen(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    const nowLocal = getThaiToday(); 

    try {
      const requests = selectedItems.map((item) =>
        axios.post("http://localhost/Web_app/backend/api/stock_out.php", {
          prod_id: item.id,
          quantity: Number(item.qty),
          note,
          date: nowLocal, 
          user_id: 1, 
        }, { withCredentials: true })
      );
      await Promise.all(requests);
      alert("บันทึกการเบิกสำเร็จ");
      setSelectedItems([]);
      setNote("");
      setIsModalOpen(false);
      await fetchProducts();
      await fetchHistory();
    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ ลองเช็ค API ");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => item.fullDate === filterDate);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900 font-kanit">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 overflow-y-auto">
          <header className="mb-6">
            <h2 className="text-2xl font-bold mb-1">📤 บันทึกการเบิกสินค้า</h2>
            <p className="text-gray-500">บันทึกรายการนำสินค้าออกจากคลังและตัดยอดสต็อก</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="🔍 ค้นหาสินค้าเพื่อเบิก..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-0 bg-gray-50 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-kanit"
                />
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border-0 bg-gray-50 px-4 py-2 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none cursor-pointer font-kanit"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat === "all" ? "ทุกหมวดหมู่" : cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 border-0 bg-gray-50 rounded-2xl p-4 mb-6 custom-scrollbar">
                {filteredProducts.map((item) => {
                  const selected = selectedItems.find(i => i.id === item.id);
                  const isOutOfStock = item.stock <= 0;
                  return (
                    <div key={item.id} className={`flex justify-between items-center p-3 rounded-2xl border-2 transition-all ${selected ? "bg-white border-red-500 shadow-md" : "bg-transparent border-transparent"} ${isOutOfStock ? "opacity-50" : ""}`}>
                      <div className={`flex items-center gap-4 cursor-pointer select-none ${isOutOfStock ? "cursor-not-allowed" : ""}`} onClick={() => !isOutOfStock && toggleProduct(item)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "bg-red-500 border-red-500" : "border-gray-300"}`}>
                          {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className={`text-xs ${isOutOfStock ? "text-red-500 font-bold" : "text-gray-400"}`}>{isOutOfStock ? "สินค้าหมด" : `คงเหลือ ${item.stock} หน่วย`}</p>
                        </div>
                      </div>
                      
                      {selected && (
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 font-bold uppercase pl-2">จำนวน:</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={selected.qty}
                            onChange={(e) => updateQty(item.id, e.target.value)}
                            className="w-14 bg-white border-0 py-1.5 rounded-xl text-center font-black text-red-600 focus:ring-0 outline-none shadow-sm font-kanit"
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
                className="w-full border-0 bg-gray-50 p-4 rounded-2xl min-h-[100px] focus:ring-1 focus:ring-red-500 outline-none text-sm mb-4 font-kanit"
              />
              <button
                onClick={handlePreSubmit}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-[0.98] font-kanit"
              >
                บันทึกการเบิกสินค้า
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col h-[650px]">
              <div className="flex justify-between items-center mb-6 gap-3 flex-none">
                <h3 className="font-bold text-lg flex items-center gap-2">📜 ประวัติการเบิก</h3>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border-0 bg-gray-100 px-4 py-2 rounded-xl text-sm outline-none font-kanit" />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 font-kanit">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-24 text-gray-300">
                    <p className="text-5xl mb-4">📅</p>
                    <p className="text-sm font-medium">ไม่มีประวัติการเบิกในวันที่เลือก</p>
                  </div>
                ) : (
                  filteredHistory.map((item, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-50 hover:border-red-200 transition-all shadow-sm">
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">🕙 เวลา {item.displayTime} น.</p>
                        {item.note && <p className="text-xs text-red-400 mt-2 bg-red-50 px-2 py-1 rounded-lg w-fit">📝 {item.note}</p>}
                      </div>
                      <div className="bg-red-100 text-red-700 px-4 py-2 rounded-2xl font-black">-{item.qty}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 text-center animate-pop-in font-kanit">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">⚠️</div>
            <h3 className="text-2xl font-black mb-2 text-gray-800">ยืนยันการเบิกออก?</h3>
            <p className="text-gray-400 text-sm mb-6">กรุณาตรวจสอบรายการก่อนตัดยอดสต็อก</p>
            <div className="bg-gray-50 rounded-3xl p-5 mb-8 max-h-52 overflow-y-auto border text-left text-sm">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b border-dashed last:border-0">
                  <span className="text-gray-600 font-medium">{item.name}</span>
                  <span className="font-bold text-red-600">-{item.qty} ชิ้น</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl border border-gray-200 font-bold text-gray-400 hover:bg-gray-50 font-kanit">ยกเลิก</button>
              <button onClick={confirmSubmit} disabled={loading} className="flex-1 py-4 rounded-2xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg font-kanit">
                {loading ? "กำลังบันทึก..." : "ยืนยันเบิกออก"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700;800&display=swap');
        .font-kanit { font-family: 'Kanit', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; } 
        @keyframes pop-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } } 
        .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      ` }} />
    </div>
  );
}