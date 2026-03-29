import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar_admin";
import Navbar from "../components/Navbar";

export default function ReceiveReport_admin() {
  const [history, setHistory] = useState([]);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // โหลดประวัติสินค้าเข้าออก
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost/Web_app/backend/api/stock_out.php",
        { withCredentials: true }
      );

      const data = Array.isArray(res.data) ? res.data : [];

      const formatted = data.map((item) => ({
        name: item.prod_name,
        qty: item.quantity,
        type: item.type || "ออก", // ถ้า backend แยกเข้า/ออก
        date: item.date || "",
        note: item.note || "",
      }));

      setHistory(formatted);
    } catch (err) {
      console.error("โหลดประวัติไม่สำเร็จ", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // filter ประวัติตามวันที่
  const filteredHistory = history.filter(
    (item) => item.date === filterDate
  );

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <header className="mb-6">
            <h2 className="text-2xl font-bold mb-1">📦 รายงานสินค้าเข้าออก</h2>
            <p className="text-gray-500">
              ดูรายการสินค้าเข้าออกและหมายเหตุ
            </p>
          </header>

          <div className="mb-6 flex items-center gap-4">
            <label className="text-sm font-medium">เลือกวันที่:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border-0 bg-gray-100 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-24 text-gray-300">
              <p className="text-5xl mb-4">📅</p>
              <p className="text-sm">ไม่มีรายการสินค้าเข้าออกในวันที่เลือก</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      สินค้า
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      จำนวน
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      หมายเหตุ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredHistory.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.qty}</td>
                      <td className="px-6 py-4">{item.type}</td>
                      <td className="px-6 py-4">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}