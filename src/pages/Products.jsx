import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function Products() {
  const [open, setOpen] = useState(false);

  // ฟอร์มสินค้า
  const [form, setForm] = useState({
    prod_id: "",
    prod_name: "",
    prod_price: 0,
    prod_capacity: 0,
    category_id: "",
  });

  // ฟอร์มหมวดหมู่ใหม่
  const [newCategory, setNewCategory] = useState("");

  // เก็บข้อมูลสินค้า
  const [products, setProducts] = useState([]);

  // เก็บหมวดหมู่
  const [categories, setCategories] = useState([]);

  // ดึงข้อมูลสินค้าเมื่อโหลดหน้า
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Web_app/backend/api/product.php"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Web_app/backend/api/category.php"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // เพิ่มสินค้า
  const handleAddProduct = async () => {
    try {
      let cat_id_to_use = form.category_id;

      // ถ้ามีกรอกหมวดหมู่ใหม่ ให้สร้างหมวดหมู่ก่อน
      if (newCategory.trim() !== "") {
        const res = await axios.post(
          "http://localhost/Web_app/backend/api/category.php",
          { cat_name: newCategory }
        );
        cat_id_to_use = res.data.cat_id; // สมมติ API return cat_id ของหมวดหมู่ใหม่
      }

      // เพิ่มสินค้า
      await axios.post("http://localhost/Web_app/backend/api/product.php", {
        prod_name: form.prod_name,
        prod_price: form.prod_price,
        prod_capacity: form.prod_capacity,
        cat_id: cat_id_to_use,
      });

      // Reset form
      setOpen(false);
      setForm({ prod_id: "", prod_name: "", prod_price: 0, prod_capacity: 0, category_id: "" });
      setNewCategory("");
      fetchProducts();
      fetchCategories(); // โหลดหมวดหมู่ใหม่
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white shadow px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">ระบบจัดการสินค้า</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">ผู้ใช้งาน: แอดมิน</span>
            <button className="bg-gray-200 px-3 py-1 rounded-lg text-sm">
              ออกจากระบบ
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="p-8">
          {/* Header */}
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

          {/* Card */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="mb-4">
              <h3 className="font-semibold">รายการสินค้า</h3>
              <p className="text-sm text-gray-400">
                ทั้งหมด {products.length} รายการ
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 ค้นหารายการสินค้า..."
                className="w-full bg-gray-100 px-4 py-2 rounded-lg outline-none text-sm"
              />
            </div>

            {/* ตารางสินค้า */}
            {products.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
                ไม่พบข้อมูลสินค้า
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">รหัสสินค้า</th>
                      <th className="border px-4 py-2 text-left">ชื่อสินค้า</th>
                      <th className="border px-4 py-2 text-right">ราคา</th>
                      <th className="border px-4 py-2 text-right">จำนวน</th>
                      <th className="border px-4 py-2 text-right">หมวดหมู่</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{item.prod_id}</td>
                        <td className="border px-4 py-2">{item.prod_name}</td>
                        <td className="border px-4 py-2 text-right">{item.prod_price}</td>
                        <td className="border px-4 py-2 text-right">{item.prod_capacity}</td>
                        <td className="border px-4 py-2 text-right">{item.cat_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Modal เพิ่มสินค้า */}
        {open && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-6">เพิ่มสินค้า</h2>

              {/* ฟอร์มสินค้า */}
              {["prod_name", "prod_price", "prod_capacity"].map((field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-sm mb-1">{field.replace("_", " ")}</label>
                  <input
                    type={field.includes("price") || field.includes("capacity") ? "number" : "text"}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                  />
                </div>
              ))}

              {/* Dropdown เลือกหมวดหมู่ */}
              <div className="mb-4">
                <label className="block text-sm mb-1">เลือกหมวดหมู่</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categories.map((cat) => (
                    <option key={cat.cat_id} value={cat.cat_id}>
                      {cat.cat_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input หมวดหมู่ใหม่ */}
              <div className="mb-4">
                <label className="block text-sm mb-1">สร้างหมวดหมู่ใหม่ (ถ้ามี)</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="กรอกชื่อหมวดหมู่ใหม่"
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
                  onClick={handleAddProduct}
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