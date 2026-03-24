export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h1 className="text-lg font-bold mb-6">📦 ระบบคลังสินค้า</h1>

      <nav className="space-y-2">
        <div className="bg-blue-100 text-blue-600 p-2 rounded">📊แดชบอร์ด</div>
        <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">จัดการสินค้า</div>
        <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">รับสินค้าเข้าคลัง</div>
        <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">เบิกสินค้าออกจากคลัง</div>
      </nav>
    </aside>
  );
}