import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Products() {
  const [open, setOpen] = useState(false);

  // ฟอร์มสินค้า
  const [form, setForm] = useState({
    prod_name: "",
    prod_price: 0,
    prod_capacity: 0,
    cat_id: "",
  });

  // ฟอร์มหมวดหมู่ใหม่
  const [newCategory, setNewCategory] = useState("");

  // ข้อมูลสินค้าและหมวดหมู่
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // โหลดข้อมูลเมื่อหน้าเปิด
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost/Web_app/backend/api/product.php",
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost/Web_app/backend/api/category.php",
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // เพิ่มสินค้า
  const handleAddProduct = async () => {
    try {
      let cat_id_to_use = form.cat_id;

      // สร้างหมวดหมู่ใหม่ถ้ามี
      if (newCategory.trim() !== "") {
        const res = await axios.post(
          "http://localhost/Web_app/backend/api/category.php",
          { name: newCategory }, // ต้องตรงกับ PHP
        );
        cat_id_to_use = res.data.cat_id;
      }

      // เพิ่มสินค้า
      await axios.post("http://localhost/Web_app/backend/api/product.php", {
        prod_name: form.prod_name,
        prod_price: form.prod_price,
        prod_capacity: form.prod_capacity,
        cat_id: cat_id_to_use,
      });

      // รีเซ็ตฟอร์มและโหลดข้อมูลใหม่
      setForm({ prod_name: "", prod_price: 0, prod_capacity: 0, cat_id: "" });
      setNewCategory("");
      setOpen(false);
      fetchProducts();
      fetchCategories();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };
  // State สำหรับ modal เพิ่มหมวดหมู่
  const [openCategory, setOpenCategory] = useState(false);

  // ฟังก์ชันเพิ่มหมวดหมู่
  const handleAddCategory = async () => {
    try {
      if (!newCategory.trim()) return alert("กรุณากรอกชื่อหมวดหมู่");

      const res = await axios.post(
        "http://localhost/Web_app/backend/api/category.php",
        { cat_name: newCategory },
      );

      if (res.data.success) {
        fetchCategories(); // โหลดหมวดหมู่ใหม่
        setNewCategory("");
        setOpenCategory(false);
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">จัดการสินค้า</h2>
              <p className="text-gray-500">จัดการข้อมูลสินค้าในคลัง</p>
            </div>

            {/* ปุ่มชิดขวา */}
            <div className="flex gap-2">
              <button
                onClick={() => setOpenCategory(true)} // เปิด modal เพิ่มหมวดหมู่
                className="bg-black  text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
              >
                + เพิ่มหมวดหมู่
              </button>

              <button
                onClick={() => setOpen(true)} // เปิด modal เพิ่มสินค้า
                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                + เพิ่มสินค้าใหม่
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="mb-4">
              <h3 className="font-semibold">รายการสินค้า</h3>
              <p className="text-sm text-gray-400">
                ทั้งหมด {products.length} รายการ
              </p>
            </div>

            {products.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
                ไม่พบข้อมูลสินค้า
              </div>
            ) : (
              <table className="w-full border-collapse shadow-lg rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left uppercase tracking-wider">
                      ชื่อสินค้า
                    </th>
                    <th className="px-6 py-3 text-right uppercase tracking-wider">
                      ราคา
                    </th>
                    <th className="px-6 py-3 text-right uppercase tracking-wider">
                      จำนวน
                    </th>
                    <th className="px-6 py-3 text-left uppercase tracking-wider">
                      หมวดหมู่
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((p, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-100 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {p.prod_name}
                      </td>
                      <td className="px-6 py-4 text-right text-green-600 font-semibold">
                        {p.prod_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {p.prod_capacity}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.cat_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
        {openCategory && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-6">เพิ่มหมวดหมู่</h2>

              <div className="mb-4">
                <label className="block text-sm mb-1">ชื่อหมวดหมู่</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                  placeholder="กรอกชื่อหมวดหมู่ใหม่"
                />
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setOpenCategory(false)}
                  className="w-1/2 bg-gray-200 py-2 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `คุณต้องการเพิ่มหมวดหมู่ "${newCategory}" หรือไม่?`,
                      )
                    ) {
                      handleAddCategory();
                    }
                  }}
                  className="w-1/2 bg-blue-600 text-white py-2 rounded-lg"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal เพิ่มสินค้า */}
        {open && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-6">เพิ่มสินค้า</h2>

              <div className="mb-4">
                <label className="block text-sm mb-1">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={form.prod_name}
                  onChange={(e) =>
                    setForm({ ...form, prod_name: e.target.value })
                  }
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">เลือกหมวดหมู่</label>
                <select
                  value={form.cat_id}
                  onChange={(e) => setForm({ ...form, cat_id: e.target.value })}
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categories.map((c) => (
                    <option key={c.cat_id} value={c.cat_id}>
                      {c.cat_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">ราคา</label>
                <input
                  type="number"
                  value={form.prod_price}
                  onChange={(e) =>
                    setForm({ ...form, prod_price: e.target.value })
                  }
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">จำนวน</label>
                <input
                  type="number"
                  value={form.prod_capacity}
                  onChange={(e) =>
                    setForm({ ...form, prod_capacity: e.target.value })
                  }
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="w-1/2 bg-gray-200 py-2 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `คุณต้องการเพิ่มสินค้า "${form.prod_name}" หรือไม่?`,
                      )
                    ) {
                      handleAddProduct();
                    }
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
