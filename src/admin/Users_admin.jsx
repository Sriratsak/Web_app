import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar_admin";
import Navbar from "../components/Navbar";

export default function Users_admin() {
  const API = "http://localhost/Web_app/backend/models/user.php";

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setUsers([]);
    }
    setLoading(false);
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((u) =>
        u.role === "user" && 
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleEdit = (user) => {
    setEditUser({ ...user });
  };

  // ฟังก์ชัน บันทึกข้อมูล (จากการกดปุ่มบันทึกใน Modal)
  const handleSave = async () => {
    if (!editUser.username) return alert("กรุณากรอกชื่อผู้ใช้งาน");
    try {
      const res = await axios.put(API, {
        id: editUser.id,
        username: editUser.username,
        email: editUser.email,
        tel: editUser.tel,
        status: editUser.status, // ส่ง status ไปด้วย
        role: editUser.role
      });

      if (res.data.success) {
        setUsers((prev) => prev.map((u) => (u.id === editUser.id ? editUser : u)));
        setEditUser(null);
        alert("อัปเดตข้อมูลสำเร็จ");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  // ฟังก์ชันสำหรับ "ระงับ/เลิกระงับ" บัญชีแบบรวดเร็วจากหน้าตาราง
  const toggleStatus = async (user) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    const confirmMsg = newStatus === "suspended" ? `ยืนยันการ "ระงับ" บัญชีคุณ ${user.username}?` : `ยืนยันการ "เปิดใช้งาน" บัญชีคุณ ${user.username}?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.put(API, {
        ...user,
        status: newStatus
      });
      if (res.data.success) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
      }
    } catch (err) {
      alert("ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบผู้ใช้งานรายนี้ใช่หรือไม่?")) return;
    try {
      const res = await axios.delete(`${API}?id=${id}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">จัดการรายชื่อพนักงาน</h2>
              <p className="text-gray-500">ควบคุมสถานะและแก้ไขข้อมูลพนักงานทั่วไป</p>
            </div>
            <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border text-sm font-semibold">
              <span className="text-gray-400">Total Users: </span>
              <span className="text-indigo-600">{filteredUsers.length}</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <input
                placeholder="🔍 ค้นหาพนักงานอ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
              />
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-400">กำลังโหลด...</div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-600 text-white text-left">
                      <th className="py-4 px-6 font-semibold">ชื่อผู้ใช้งาน</th>
                      <th className="py-4 px-6 font-semibold">ติดต่อ</th>
                      <th className="py-4 px-6 font-semibold text-center">สถานะ</th>
                      <th className="py-4 px-6 font-semibold text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${u.status === 'suspended' ? 'bg-gray-50/50' : ''}`}>
                        <td className="py-4 px-6">
                          <div className="font-bold">{u.username}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-widest">ID: {u.id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium">{u.email || "-"}</div>
                          <div className="text-xs text-gray-400">{u.tel || "-"}</div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                            u.status === 'suspended' ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'
                          }`}>
                            {u.status === 'suspended' ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(u)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                              แก้ไข
                            </button>
                            <button 
                              onClick={() => toggleStatus(u)} 
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                u.status === 'suspended' 
                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                : 'bg-gray-800 hover:bg-black text-white'
                              }`}
                            >
                              {u.status === 'suspended' ? 'เลิกระงับ' : 'ระงับ'}
                            </button>
                            <button onClick={() => handleDelete(u.id)} className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-xl text-xs transition-all">
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal */}
          {editUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl scale-in-center">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">แก้ไขข้อมูลพนักงาน</h2>
                  <button onClick={() => setEditUser(null)} className="text-gray-300 hover:text-gray-500 text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">ชื่อผู้ใช้งาน</label>
                    <input
                      value={editUser.username || ""}
                      onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">สถานะบัญชี</label>
                    <select
                      value={editUser.status || "active"}
                      onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="active">ปกติ (Active)</option>
                      <option value="suspended">ระงับการใช้งาน (Suspended)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleSave} className="bg-indigo-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all">
                      บันทึก
                    </button>
                    <button onClick={() => setEditUser(null)} className="bg-gray-100 text-gray-500 py-3.5 rounded-2xl font-bold">
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}