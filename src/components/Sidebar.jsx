import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen shadow p-4">
      
      <h2 className="text-lg font-bold mb-6">📦 ระบบคลังสินค้า</h2>

      <ul className="space-y-2">
        
        <li>
          <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100">
            📊 แดชบอร์ด
          </Link>
        </li>

        <li>
          <Link to="/products" className="block p-2 rounded hover:bg-gray-100">
            📝 จัดการสินค้า
          </Link>
        </li>

        <li>
           <Link to="/withdraw" className="block p-2 rounded hover:bg-gray-100">
           📤 รับสินค้าเข้าคลัง
           </Link>

        </li>

        <li>
            <Link to="/receive"  className="block p-2 rounded hover:bg-gray-100">
            📥 เบิกสินค้าออกจากคลัง
            </Link>
        </li>

      </ul>
    </div>
  );
}