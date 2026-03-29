import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Receive() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPopular, setShowPopular] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    fetchProducts();
    fetchHistory();
  }, []);

  // 🔥 โหลดสินค้า
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost/Web_app/backend/api/product.php",
        { withCredentials: true },
      );

      const data = Array.isArray(res.data) ? res.data : [];

      const formatted = data.map((item) => ({
        id: item.prod_id,
        name: item.prod_name,
        stock: Math.max(0, Number(item.quantity) || 0),
        category: item.cat_name || "ทั่วไป",
        popular: false,
      }));

      setProducts(formatted);
      //1
      // 🔹 debug เฉพาะ field สำคัญ
      // console.log(
      //   "Products loaded:",
      //   formatted.map(({ id, name, stock, category }) => ({
      //     id,
      //     name,
      //     stock,
      //     category,
      //   })),
      // );
    } catch (err) {
      console.error("โหลดสินค้าไม่สำเร็จ", err);
    }
  };

  // 🔥 โหลด history
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost/Web_app/backend/api/stock_out.php",
        { withCredentials: true },
      );

      const data = Array.isArray(res.data) ? res.data : [];

      const formatted = data.map((item) => ({
        name: item.prod_name,
        qty: item.quantity,
        fullDate: item.date || "",
        note: item.note || "",
      }));

      setHistory(formatted);
      //2
      // 🔹 debug เฉพาะ field สำคัญ
      // console.log(
      //   "History loaded:",
      //   formatted.map(({ name, qty, fullDate }) => ({
      //     name,
      //     qty,
      //     fullDate,
      //   })),
      // );
    } catch (err) {
      console.error("โหลด history ไม่สำเร็จ", err);
    }
  };

  // 🔍 filter สินค้า
  const filteredProducts = products.filter((p) => {
    const matchSearch = (p.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;

    const matchPopular = showPopular ? p.popular : true;

    return matchSearch && matchCategory && matchPopular;
  });

  // 🔹 toggle เลือกสินค้า
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
        item.id === id ? { ...item, qty: Number(qty) } : item,
      ),
    );
  };

  // 🔹 ตรวจสอบก่อน submit
  const handlePreSubmit = () => {
    if (selectedItems.length === 0) {
      alert("อ้วงลืมเลือกของ 😡");
      return;
    }

    for (let item of selectedItems) {
      const p = products.find((prod) => prod.id === item.id);
      if (!p) {
        alert(`ไม่พบสินค้า ${item.name}`);
        return;
      }
      if (!item.qty || item.qty <= 0) {
        alert(`ใส่จำนวนของ ${item.name}`);
        return;
      }
      if (item.qty > p.stock) {
        alert(`ของ ${item.name} เหลือ ${p.stock}`);
        return;
      }
    }

    setIsModalOpen(true);
  };

  // 🔹 ยืนยัน submit
  const confirmSubmit = async () => {
    const now = new Date();
    try {
      const requests = selectedItems.map((item) =>
        axios.post(
          "http://localhost/Web_app/backend/api/stock_out.php",
          {
            prod_id: item.id,
            quantity: Number(item.qty),
            note,
            date: now.toISOString(),
          },
          { withCredentials: true },
        ),
      );

      await Promise.all(requests);

      // 🔹 debug submit เฉพาะรายการที่บันทึก
      console.log(
        "Stock out submitted:",
        selectedItems.map(({ id, name, qty }) => ({ id, name, qty })),
      );

      await fetchProducts();
      await fetchHistory();
    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ");
      return;
    }

    setSelectedItems([]);
    setNote("");
    setIsModalOpen(false);
  };

  // 🔹 filter history ตามวันที่
  const filteredHistory = history.filter(
    (item) => item.fullDate === filterDate,
  );

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 overflow-y-auto">
          <header className="mb-6">
            <h2 className="text-2xl font-bold mb-1">📤 บันทึกการเบิกสินค้า</h2>
            <p className="text-gray-500">
              บันทึกรายการนำสินค้าออกจากคลังและตัดยอดสต็อก
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* --- ฝั่งซ้าย: ฟอร์มเลือกสินค้า --- */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              {/* ค้นหา + filter */}
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
                      <option key={cat} value={cat}>
                        {cat === "all" ? "ทุกหมวดหมู่" : cat}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowPopular(!showPopular)}
                    className={`px-5 py-2 rounded-2xl text-sm font-medium border transition-all ${
                      showPopular
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-500 border-gray-200"
                    }`}
                  >
                    ⭐ ใช้บ่อย
                  </button>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className="max-h-80 overflow-y-auto space-y-2 border-0 bg-gray-50 rounded-2xl p-4 mb-6 custom-scrollbar">
                {filteredProducts.map((item) => {
                  const selected = selectedItems.find((i) => i.id === item.id);
                  const isOutOfStock = item.stock <= 0;

                  return (
                    <div
                      key={item.id}
                      className={`flex justify-between items-center p-3 rounded-2xl border-2 transition-all ${
                        selected
                          ? "bg-white border-red-500 shadow-md"
                          : "bg-transparent border-transparent"
                      } ${isOutOfStock ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`flex items-center gap-4 cursor-pointer select-none ${
                          isOutOfStock ? "cursor-not-allowed" : ""
                        }`}
                        onClick={() => !isOutOfStock && toggleProduct(item)}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selected
                              ? "bg-red-500 border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p
                            className={`text-xs ${
                              isOutOfStock
                                ? "text-red-500 font-bold"
                                : "text-gray-400"
                            }`}
                          >
                            {isOutOfStock
                              ? "สินค้าหมด"
                              : `คงเหลือ ${item.stock} หน่วย`}
                          </p>
                        </div>
                      </div>
                      {selected && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-medium">
                            เบิก:
                          </span>
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

            {/* --- ฝั่งขวา: ประวัติ --- */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col h-[650px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 flex-none">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  📜 ประวัติการเบิก
                </h3>
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
                    <div
                      key={i}
                      className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-50 hover:border-red-200 transition-all"
                    >
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
        </main>
      </div>
    </div>
  );
}
