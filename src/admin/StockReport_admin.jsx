import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar_admin";
import Navbar from "../components/Navbar";

export default function InventoryReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalIn: 0, totalOut: 0 });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [resProd, resIn, resOut] = await Promise.all([
        axios.get("http://localhost/Web_app/backend/api/product.php"),
        axios.get("http://localhost/Web_app/backend/api/stock_in.php"),
        axios.get("http://localhost/Web_app/backend/api/stock_out.php")
      ]);

      const products = Array.isArray(resProd.data) ? resProd.data : [];
      const stockIn = Array.isArray(resIn.data) ? resIn.data : [];
      const stockOut = Array.isArray(resOut.data) ? resOut.data : [];

      // ✅ FIX: ไม่คำนวณ stock ซ้ำแล้ว
      const processed = products.map(prod => {
        const totalIn = stockIn
          .filter(item => item.prod_id === prod.prod_id)
          .reduce((sum, item) => sum + Number(item.quantity), 0);

        const totalOut = stockOut
          .filter(item => item.prod_id === prod.prod_id)
          .reduce((sum, item) => sum + Number(item.quantity), 0);

        return {
          ...prod,
          total_in: totalIn,
          total_out: totalOut,

          // 🔥 ใช้ค่าจริงจาก DB เลย
          current_stock: Number(prod.prod_capacity)
        };
      });

      setReportData(processed);

      const sumIn = processed.reduce((sum, item) => sum + item.total_in, 0);
      const sumOut = processed.reduce((sum, item) => sum + item.total_out, 0);
      setSummary({ totalIn: sumIn, totalOut: sumOut });

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 font-kanit">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <header className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black text-gray-800">📊 รายงานสรุป สต็อกเข้า-ออก</h2>
              <p className="text-gray-500">ข้อมูลรวมจากการรับเข้าและเบิกจ่ายสินค้า</p>
            </div>
            <button onClick={fetchData} className="bg-white px-4 py-2 rounded-xl shadow-sm text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all">
              🔄 อัปเดตข้อมูล
            </button>
          </header>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500 p-6 rounded-3xl text-white shadow-lg">
              <p className="opacity-80 text-sm font-bold">รวมการรับเข้าทั้งหมด</p>
              <h3 className="text-4xl font-black">
                {summary.totalIn.toLocaleString()} <span className="text-lg">ชิ้น</span>
              </h3>
            </div>
            <div className="bg-red-500 p-6 rounded-3xl text-white shadow-lg">
              <p className="opacity-80 text-sm font-bold">รวมการเบิกออกทั้งหมด</p>
              <h3 className="text-4xl font-black">
                {summary.totalOut.toLocaleString()} <span className="text-lg">ชิ้น</span>
              </h3>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[11px] uppercase">
                  <th className="px-8 py-4 text-left">สินค้า</th>
                  <th>หมวดหมู่</th>
                  <th>รับเข้า (+)</th>
                  <th>เบิกออก (-)</th>
                  <th className="bg-gray-100 text-gray-800">คงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-gray-300">กำลังโหลด...</td>
                  </tr>
                ) : reportData.map(item => (
                  <tr key={item.prod_id} className="hover:bg-gray-50">
                    <td className="text-left px-8 py-4 font-bold">{item.prod_name}</td>
                    <td>{item.cat_name}</td>
                    <td className="text-green-600 font-bold">+{item.total_in}</td>
                    <td className="text-red-500 font-bold">-{item.total_out}</td>
                    <td className="font-black text-blue-600 text-lg">
                      {item.current_stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}