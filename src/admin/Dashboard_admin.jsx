import Sidebar from "../components/Sidebar_admin";
import Navbar from "../components/Navbar"; // ✅ 1. Import Navbar ที่เราแยกไว้มาใช้

export default function Dashboard_admin() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      
      {/* Sidebar เมนูด้านข้าง */}
      <Sidebar />

      {/* Right Section ส่วนเนื้อหาฝั่งขวา */}
      <div className="flex-1 flex flex-col">

        {/* ✅ 2. เรียกใช้ Navbar ตัวเดียวกับหน้าอื่นๆ */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* Header ส่วนหัวของหน้า Dashboard */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold">แดชบอร์ด</h2>
            <p className="text-gray-500">ภาพรวมข้อมูลคลังสินค้าและการเคลื่อนไหว</p>
          </div>

          {/* สรุปข้อมูล (Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Card 1: จำนวนสินค้า */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md hover:scale-[1.02] transition-all">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">รายการสินค้า</p>
                <h3 className="text-2xl font-black mt-1">24</h3>
                <p className="text-[10px] text-blue-500 mt-1 font-bold">📦 ในคลังทั้งหมด</p>
              </div>
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner">📦</div>
            </div>

            {/* Card 2: มูลค่ารวม */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md hover:scale-[1.02] transition-all">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">มูลค่าคงคลัง</p>
                <h3 className="text-2xl font-black mt-1">฿12,450</h3>
                <p className="text-[10px] text-green-500 mt-1 font-bold">📈 อัปเดตล่าสุด</p>
              </div>
              <div className="bg-green-50 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner">฿</div>
            </div>

            {/* Card 3: สินค้าใกล้หมด */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md hover:scale-[1.02] transition-all">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">สินค้าใกล้หมด</p>
                <h3 className="text-2xl font-black mt-1 text-red-500">3</h3>
                <p className="text-[10px] text-red-400 mt-1 font-bold">⚠️ ควรเติมสินค้า</p>
              </div>
              <div className="bg-red-50 text-red-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner">⚠️</div>
            </div>

            {/* Card 4: ธุรกรรมวันนี้ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md hover:scale-[1.02] transition-all">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">ธุรกรรมวันนี้</p>
                <h3 className="text-2xl font-black mt-1">12</h3>
                <p className="text-[10px] text-purple-500 mt-1 font-bold">🔄 รับเข้า/เบิกออก</p>
              </div>
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner">📋</div>
            </div>

          </div>

          {/* ส่วนล่าง: ตารางย่อและรายการล่าสุด */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* ตารางสินค้าใกล้หมดสต็อก */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  สินค้าใกล้หมดสต็อก
                </h3>
                <button className="text-blue-500 text-xs font-bold hover:underline">ดูทั้งหมด</button>
              </div>

              {/* จำลองข้อมูล (Mockup) */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-sm font-medium">น้ำตาลทราย</span>
                    <span className="text-xs font-bold text-red-500">เหลือ 2 กิโลกรัม</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-sm font-medium">สบู่ก้อน</span>
                    <span className="text-xs font-bold text-red-500">เหลือ 5 ชิ้น</span>
                 </div>
              </div>
            </div>

            {/* รายการเคลื่อนไหวล่าสุด */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-6 text-gray-800 flex items-center gap-2">
                🔄 ความเคลื่อนไหวล่าสุด
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                   <div className="flex gap-3">
                      <div className="bg-green-100 text-green-600 w-8 h-8 rounded-lg flex items-center justify-center text-xs">📥</div>
                      <div>
                        <p className="text-sm font-bold">รับเข้า: ข้าวสาร</p>
                        <p className="text-[10px] text-gray-400 tracking-wider">10 นาทีที่แล้ว</p>
                      </div>
                   </div>
                   <span className="text-sm font-bold text-green-600">+10</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                   <div className="flex gap-3">
                      <div className="bg-red-100 text-red-600 w-8 h-8 rounded-lg flex items-center justify-center text-xs">📤</div>
                      <div>
                        <p className="text-sm font-bold">เบิกออก: น้ำปลา</p>
                        <p className="text-[10px] text-gray-400 tracking-wider">2 ชั่วโมงที่แล้ว</p>
                      </div>
                   </div>
                   <span className="text-sm font-bold text-red-600">-2</span>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}