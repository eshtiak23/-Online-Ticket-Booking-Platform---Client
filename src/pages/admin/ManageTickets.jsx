import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spinner";

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    api.get("/api/advertise")
      .then(res => setTickets(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/tickets/approve/${id}`);
      setTickets(prev => prev.map(t => t._id === id ? { ...t, verificationStatus: "approved" } : t));
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/tickets/reject/${id}`);
      setTickets(prev => prev.map(t => t._id === id ? { ...t, verificationStatus: "rejected" } : t));
    } catch (err) {
      alert("Failed to reject");
    }
  };

  if (loading) return <Spinner />;

  const filtered = tab === "all" ? tickets : tickets.filter(t => t.verificationStatus === tab);
  const pendingCount = tickets.filter(t => t.verificationStatus === "pending").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Tickets</h2>
        {pendingCount > 0 && (
          <span className="bg-amber-100 text-amber-700 text-sm px-3 py-1 rounded-full">{pendingCount} pending</span>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
              tab === t ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Vendor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">No tickets found</td>
                </tr>
              ) : filtered.map(t => (
                <tr key={t._id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {t.image && <img src={t.image} alt="" className="w-8 h-8 rounded object-cover" />}
                      <div>
                        <p>{t.title}</p>
                        <p className="text-xs text-gray-400">{t.from} → {t.to}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p>{t.vendorName}</p>
                    <p className="text-xs text-gray-400">{t.vendorEmail}</p>
                  </td>
                  <td className="py-3 px-4">${t.price}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                      t.verificationStatus === "approved" ? "bg-green-100 text-green-700" :
                      t.verificationStatus === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{t.verificationStatus}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {t.verificationStatus !== "approved" && (
                        <button onClick={() => handleApprove(t._id)} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                          Approve
                        </button>
                      )}
                      {t.verificationStatus !== "rejected" && (
                        <button onClick={() => handleReject(t._id)} className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                          Reject
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
    </div>
  );
}
