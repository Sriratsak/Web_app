import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar_admin";
import Navbar from "../components/Navbar";

export default function Users_admin() {
  const API = "http://localhost/Web_app/backend/api";

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/user.php`);
    setUsers(res.data);
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleSave = async () => {
    await axios.put(`${API}/user.php/${editUser.id}`, editUser);
    setEditUser(null);
    fetchUsers();
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
              <p className="text-gray-500">จัดการข้อมูลผู้ใช้ในระบบและบทบาท</p>
            </div>
          </div>

          <table className="w-full bg-white rounded">
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อ</th>
                <th>Role</th>
                <th>จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-blue-500"
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal แก้ไข */}
          {editUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-4 rounded w-80">
                <h2 className="mb-2">แก้ไข User</h2>

                <input
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  className="border w-full mb-2 p-1"
                />

                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="border w-full mb-2 p-1"
                >
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>

                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-3 py-1 mr-2"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => setEditUser(null)}
                  className="bg-gray-300 px-3 py-1"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
