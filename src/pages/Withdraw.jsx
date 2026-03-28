import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Withdraw() {
  const [products, setProducts] = useState([
    { id: 1, name: "ข้าวสาร", stock: 10, category: "อาหาร", popular: true },
    { id: 2, name: "น้ำปลา", stock: 5, category: "อาหาร", popular: true },
    { id: 3, name: "น้ำตาล", stock: 8, category: "อาหาร", popular: false },
    { id: 4, name: "สบู่", stock: 15, category: "ของใช้", popular: true },
    { id: 5, name: "แชมพู", stock: 7, category: "ของใช้", popular: false },
  ]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPopular, setShowPopular] = useState(true);

  const [selectedItems, setSelectedItems] = useState([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);

  // 📂 ดึง category ไม่ซ้ำ
  const categories = ["all", ...new Set(products.map(p => p.category))];

  // 🔍 filter
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchPopular = showPopular ? p.popular : true;

    return matchSearch && matchCategory && matchPopular;
  });

  // ✅ เลือกสินค้า
  const toggleProduct = (product) => {
    const exists = selectedItems.find((i) => i.id === product.id);

    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== product.id));
    } else {
      setSelectedItems([...selectedItems, { ...product, qty: 1 }]);
    }
  };

  // 🔢 เปลี่ยนจำนวน
  const updateQty = (id, qty) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  // 🚀 submit
  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      alert("เลือกสินค้า");
      return;
    }

    for (let item of selectedItems) {
      const product = products.find((p) => p.id === item.id);

      if (!item.qty || item.qty <= 0) {
        alert(`กรอกจำนวน ${product.name}`);
        return;
      }

      if (item.qty > product.stock) {
        alert(`สินค้า ${product.name} ไม่พอ`);
        return;
      }
    }

    const updatedProducts = products.map((p) => {
      const selected = selectedItems.find((i) => i.id === p.id);
      return selected ? { ...p, stock: p.stock - selected.qty } : p;
    });

    setProducts(updatedProducts);

    const newHistory = selectedItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      note,
      date: new Date().toLocaleString(),
    }));

    setHistory([...newHistory, ...history]);

    setSelectedItems([]);
    setNote("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-2">
          📤 เบิกสินค้าออกจากคลัง
        </h2>
        <p className="text-gray-500 mb-6">
          เลือกสินค้า + กรอง + ค้นหา
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="bg-white p-6 rounded-2xl shadow">

            {/* 🔍 FILTER */}
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="🔍 ค้นหาสินค้า..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />

              <div className="flex gap-2">
                {/* CATEGORY */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border px-3 py-2 rounded-lg"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "ทั้งหมด" : cat}
                    </option>
                  ))}
                </select>

                {/* POPULAR */}
                <button
                  onClick={() => setShowPopular(!showPopular)}
                  className={`px-3 py-2 rounded-lg border ${
                    showPopular
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  ⭐ ใช้บ่อย
                </button>
              </div>
            </div>

            {/* 📦 LIST */}
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
              {filteredProducts.map((item) => {
                const selected = selectedItems.find(i => i.id === item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center p-2 rounded-lg border ${
                      selected ? "bg-gray-100 border-black" : ""
                    }`}
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleProduct(item)}
                    >
                      <input type="checkbox" checked={!!selected} readOnly />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.category} | คงเหลือ {item.stock}
                        </p>
                      </div>
                    </div>

                    {selected && (
                      <input
                        type="number"
                        min="1"
                        value={selected.qty}
                        onChange={(e) =>
                          updateQty(item.id, e.target.value)
                        }
                        className="w-20 border px-2 py-1 rounded-lg"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* NOTE */}
            <textarea
              placeholder="หมายเหตุ"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border mt-4 p-2 rounded-lg"
            />

            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-black text-white py-3 rounded-lg"
            >
              บันทึก
            </button>
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-3">
              📜 ประวัติ
            </h3>

            {history.length === 0 ? (
              <p className="text-gray-400 text-sm">
                ยังไม่มีข้อมูล
              </p>
            ) : (
              history.map((item, i) => (
                <div key={i} className="border-b py-2 flex justify-between">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.date}
                    </p>
                  </div>
                  <p className="text-red-500">-{item.qty}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}