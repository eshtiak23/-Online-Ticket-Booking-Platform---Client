import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spinner";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRole = async (id, role) => {
    try {
      const res = await api.put(`/api/users/role/${id}`, { role });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: res.data.role } : u));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  const handleFraud = async (id) => {
    try {
      const res = await api.put(`/api/users/fraud/${id}`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isFraud: res.data.isFraud } : u));
    } catch (err) {
      alert("Failed");
    }
  };

  if (loading) return <Spinner />;

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
      />

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No users found</p>
        ) : filtered.map(u => (
          <div key={u._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-sm">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                u.role === "admin" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                u.role === "vendor" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              }`}>{u.role}</span>

              {u.isFraud && <span className="text-xs text-red-600 font-medium">⚠ Fraud</span>}

              <div className="flex gap-1">
                {u.role !== "admin" && (
                  <button onClick={() => handleRole(u._id, "admin")} className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                    Admin
                  </button>
                )}
                {u.role !== "vendor" && (
                  <button onClick={() => handleRole(u._id, "vendor")} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                    Vendor
                  </button>
                )}
                {u.role === "vendor" && (
                  <button
                    onClick={() => handleFraud(u._id)}
                    className={`px-2 py-1 text-xs text-white rounded ${u.isFraud ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    {u.isFraud ? "Clear" : "Fraud"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
