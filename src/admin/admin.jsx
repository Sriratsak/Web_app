import Sidebar from "../components/Sidebar";

export default function Admin() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold"></h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-lg">🔔</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-8">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold">แดชบอร์ด</h2>
            <p className="text-gray-500">ภาพรวมข้อมูลคลังสินค้า</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center hover:shadow-lg hover:scale-105 transition">
              <div>
                <p className="text-gray-500 text-sm">จำนวนข้อมูลคลังสินค้า</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
                <p className="text-xs text-gray-400 mt-1">รายการสินค้า</p>
              </div>
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg text-lg">📦</div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center hover:shadow-lg hover:scale-105 transition">
              <div>
                <p className="text-gray-500 text-sm">มูลค่าสินค้าคงคลัง</p>
                <h3 className="text-2xl font-bold mt-1">฿0.00</h3>
                <p className="text-xs text-gray-400 mt-1">บาท</p>
              </div>
              <div className="bg-green-100 text-green-600 p-2 rounded-lg text-lg">📈</div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center hover:shadow-lg hover:scale-105 transition">
              <div>
                <p className="text-gray-500 text-sm">สินค้าใกล้หมด</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
                <p className="text-xs text-gray-400 mt-1">รายการ</p>
              </div>
              <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-lg">⚠️</div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center hover:shadow-lg hover:scale-105 transition">
              <div>
                <p className="text-gray-500 text-sm">ธุรกรรมทั้งหมด</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
                <p className="text-xs text-gray-400 mt-1">รายการ</p>
              </div>
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg text-lg">📉</div>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Low Stock */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold text-lg mb-1"> สินค้าใกล้หมดสต็อก</h3>
              <p className="text-sm text-gray-400 mb-4">
                รายการสินค้าที่มีจำนวนต่ำกว่าหรือเท่ากับจุดสั่งซื้อ
              </p>

              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                <p>ไม่มีสินค้าใกล้หมด</p>
              </div>
            </div>

            {/* Recent */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold text-lg mb-1"> รายการเคลื่อนไหวล่าสุด</h3>
              <p className="text-sm text-gray-400 mb-4">
                10 รายการล่าสุดของการรับและเบิกสินค้า
              </p>

              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                <p>ไม่มีรายการเคลื่อนไหว</p>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}