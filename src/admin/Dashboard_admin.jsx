import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar_admin";
import Navbar from "../components/Navbar";

export default function Dashboard_admin() {
  
  const [data, setData] = useState({
    summary: { total_items: 0, total_value: 0, low_stock_count: 0, daily_trans: 0 },
    low_stock_list: [],
    recent_activity: []
  });
  
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    fetch("http://localhost/Web_app/backend/api/dashboard.php")
      .then(res => res.json())
      .then(json => {
        if(json.success) setData(json);
      })
      .catch(err => console.error("Error fetching dashboard:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">แดชบอร์ด</h2>
            <p className="text-gray-500">ภาพรวมข้อมูลคลังสินค้าและการเคลื่อนไหว</p>
          </div>

          {/* Cards สรุปยอด */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="รายการสินค้า" value={data.summary.total_items} unit="รายการ" icon="📦" color="blue" />
            <StatCard title="มูลค่าคงคลัง" value={`฿${data.summary.total_value.toLocaleString()}`} unit="บาท" icon="📈" color="green" />
            <StatCard title="สินค้าใกล้หมด" value={data.summary.low_stock_count} unit="รายการ" icon="⚠️" color="yellow" />
            <StatCard title="ธุรกรรมวันนี้" value={data.summary.daily_trans} unit="รายการ" icon="📋" color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* กล่องสินค้าใกล้หมด */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  สินค้าใกล้หมดสต็อก
                </h3>
                <button onClick={() => setShowLowStockModal(true)} className="text-blue-500 text-xs font-bold hover:underline">ดูทั้งหมด</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {data.low_stock_list.length > 0 ? data.low_stock_list.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-red-50/50 rounded-2xl border border-red-100">
                    <span className="text-sm font-medium">{item.prod_name}</span>
                    <span className="text-xs font-bold text-red-500">คงเหลือ {item.prod_capacity}</span>
                  </div>
                )) : <EmptyState text="ไม่มีสินค้าใกล้หมด" />}
              </div>
            </div>

            {/* กล่องความเคลื่อนไหวล่าสุด */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">🔄 ความเคลื่อนไหวล่าสุด</h3>
                <button onClick={() => setShowActivityModal(true)} className="text-blue-500 text-xs font-bold hover:underline">ดูทั้งหมด</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                {data.recent_activity.length > 0 ? data.recent_activity.slice(0, 5).map((item, i) => (
                  <ActivityItem key={i} item={item} />
                )) : <EmptyState text="ไม่มีรายการเคลื่อนไหววันนี้" />}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- MODALS --- */}
      {showLowStockModal && (
        <DashboardModal title="รายการสินค้าใกล้หมดทั้งหมด" onClose={() => setShowLowStockModal(false)}>
          <div className="space-y-3">
            {data.low_stock_list.map((item, i) => (
              <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span>{item.prod_name}</span>
                <span className="font-bold text-red-500">{item.prod_capacity} ชิ้น</span>
              </div>
            ))}
          </div>
        </DashboardModal>
      )}

      {showActivityModal && (
        <DashboardModal title="ความเคลื่อนไหวทั้งหมดของวันนี้" onClose={() => setShowActivityModal(false)}>
          <div className="space-y-3">
            {data.recent_activity.map((item, i) => <ActivityItem key={i} item={item} />)}
          </div>
        </DashboardModal>
      )}

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }` }} />
    </div>
  );
}

// --- Sub Components เพื่อความสะอาดของโค้ด ---
const StatCard = ({ title, value, unit, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center hover:scale-[1.02] transition-all">
    <div>
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-black mt-1">{value}</h3>
      <p className={`text-[10px] text-${color}-500 mt-1 font-bold`}>{unit}</p>
    </div>
    <div className={`bg-${color}-50 text-${color}-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl`}>{icon}</div>
  </div>
);

const ActivityItem = ({ item }) => (
  <div className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${item.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {item.type === 'in' ? '📥' : '📤'}
      </div>
      <div>
        <p className="text-sm font-bold">{item.type === 'in' ? 'รับเข้า' : 'เบิกออก'}: {item.prod_name}</p>
        <p className="text-[10px] text-gray-400 tracking-wider">{item.date}</p>
      </div>
    </div>
    <span className={`text-sm font-bold ${item.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
      {item.type === 'in' ? '+' : '-'}{item.quantity}
    </span>
  </div>
);

const EmptyState = ({ text }) => <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">{text}</div>;

const DashboardModal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-pop-in">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl">&times;</button>
      </div>
      <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  </div>
);