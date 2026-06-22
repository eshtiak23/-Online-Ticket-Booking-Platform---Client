import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spinner";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleRole = async (id, role) => {
    try {
      const res = await api.put(`/api/users/role/${id}`, { role });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: res.data.role } : u));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  const handleFraud = async (id) => {
    try {
      const res = await api.put(`/api/users/fraud/${id}`);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isFraud: res.data.isFraud } : u));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Fraud</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4 text-xs">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-xs rounded-full capitalize bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">{u.role}</span>
                </td>
                <td className="py-3 px-4">
                  {u.isFraud ? <span className="text-red-600 text-xs font-medium">Fraud</span> : <span className="text-green-600 text-xs">Clean</span>}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {u.role !== "admin" && (
                      <button onClick={() => handleRole(u._id, "admin")} className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">Make Admin</button>
                    )}
                    {u.role !== "vendor" && (
                      <button onClick={() => handleRole(u._id, "vendor")} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Make Vendor</button>
                    )}
                    {u.role === "vendor" && (
                      <button onClick={() => handleFraud(u._id)} className={`px-2 py-1 text-xs rounded ${u.isFraud ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white`}>
                        {u.isFraud ? "Unmark Fraud" : "Mark Fraud"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
