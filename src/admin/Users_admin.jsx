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
      // console.log("🚀 Users fetched from PHP:", res.data);

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error("❌ Data is not an array:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("โหลดข้อมูลไม่สำเร็จ");
      setUsers([]);
    }
    setLoading(false);
  };

  // filter
  const filteredUsers = Array.isArray(users)
    ? users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // edit
  const handleEdit = (user) => {
    setEditUser({ ...user });
  };

  const handleSave = async () => {
    if (!editUser.username) return alert("ห้ามชื่อว่าง");

    try {
      console.log("✏️ PUT data:", editUser);
      // ส่ง PUT แบบ body ไม่ต้อง append id ใน URL
      const res = await axios({
        method: "put",
        url: API,
        data: editUser,
      });

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editUser.id ? editUser : u))
        );
        setEditUser(null);
      } else {
        alert("แก้ไขไม่สำเร็จ: " + (res.data.error || res.data.message));
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("ลบ user นี้จริงไหม?")) return;

    try {
      console.log("🗑️ DELETE id:", id);
      // DELETE ใช้ query string ?id=
      const res = await axios.delete(`${API}?id=${id}`);

      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert("ลบไม่สำเร็จ: " + (res.data.error || res.data.message));
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">จัดการผู้ใช้</h2>
              <p className="text-gray-500">
                จัดการข้อมูลผู้ใช้ในระบบและบทบาท
              </p>
            </div>
          </div>

          <input
            placeholder="ค้นหา ชื่อผู้ใช้งาน..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
          />

          {loading ? (
            <p>กำลังโหลด...</p>
          ) : (
            <table className="w-full bg-white rounded shadow">
              <thead className="bg-gray-200">
                <tr>
                  <th>ID</th>
                  <th>ชื่อ</th>
                  <th>Role</th>
                  <th>จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="text-center border-t">
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>
                      <span
                        className={
                          u.role === "admin"
                            ? "text-red-500 font-semibold"
                            : "text-gray-600"
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-500 mr-2"
                      >
                        แก้ไข
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {editUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-5 rounded w-80 shadow">
                <h2 className="mb-3 font-bold">แก้ไข User</h2>

                <input
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  className="border w-full mb-2 p-2 rounded"
                  placeholder="username"
                />

                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="border w-full mb-3 p-2 rounded"
                >
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
                  >
                    บันทึก
                  </button>

                  <button
                    onClick={() => setEditUser(null)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}