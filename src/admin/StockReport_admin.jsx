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
      // ✅ ดึงข้อมูลจาก 3 API พร้อมกัน (Products, In, Out)
      const [resProd, resIn, resOut] = await Promise.all([
        axios.get("http://localhost/Web_app/backend/api/product.php"),
        axios.get("http://localhost/Web_app/backend/api/stock_in.php"),
        axios.get("http://localhost/Web_app/backend/api/stock_out.php")
      ]);

      const products = Array.isArray(resProd.data) ? resProd.data : [];
      const stockIn = Array.isArray(resIn.data) ? resIn.data : [];
      const stockOut = Array.isArray(resOut.data) ? resOut.data : [];

      // ✅ ประมวลผลข้อมูล: รวมยอด In/Out ตามรายสินค้า
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
          // คำนวณคงเหลือ: (ค่าตั้งต้นในตาราง product + รับเข้า - เบิกออก)
          current_stock: (Number(prod.prod_capacity) + totalIn - totalOut)
        };
      });

      setReportData(processed);

      // คำนวณยอดรวม Header Cards
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

          {/* สรุปยอดรวม Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500 p-6 rounded-3xl text-white shadow-lg shadow-green-100">
              <p className="opacity-80 text-sm font-bold">รวมการรับเข้าทั้งหมด</p>
              <h3 className="text-4xl font-black">{summary.totalIn.toLocaleString()} <span className="text-lg font-normal">ชิ้น</span></h3>
            </div>
            <div className="bg-red-500 p-6 rounded-3xl text-white shadow-lg shadow-red-100">
              <p className="opacity-80 text-sm font-bold">รวมการเบิกออกทั้งหมด</p>
              <h3 className="text-4xl font-black">{summary.totalOut.toLocaleString()} <span className="text-lg font-normal">ชิ้น</span></h3>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest">
                  <th className="px-8 py-4 text-left">สินค้า</th>
                  <th className="px-6 py-4 text-center">หมวดหมู่</th>
                  <th className="px-6 py-4 text-center">รับเข้า (+)</th>
                  <th className="px-6 py-4 text-center">เบิกออก (-)</th>
                  <th className="px-6 py-4 text-center bg-gray-100 text-gray-800">คงเหลือปัจจุบัน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-20 text-gray-300">กำลังดึงข้อมูล API...</td></tr>
                ) : reportData.map((item) => (
                  <tr key={item.prod_id} className="hover:bg-gray-50 transition-all">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-800">{item.prod_name}</p>
                      <p className="text-[10px] text-gray-400">ID: {item.prod_id}</p>
                    </td>
                    <td className="px-6 py-5 text-center text-sm text-gray-500">{item.cat_name}</td>
                    <td className="px-6 py-5 text-center font-bold text-green-600">+{item.total_in.toLocaleString()}</td>
                    <td className="px-6 py-5 text-center font-bold text-red-500">-{item.total_out.toLocaleString()}</td>
                    <td className="px-6 py-5 text-center font-black bg-gray-50/50 text-blue-600 text-lg">
                      {item.current_stock.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700;900&display=swap');
        .font-kanit { font-family: 'Kanit', sans-serif; }
      `}</style>
    </div>
  );
}