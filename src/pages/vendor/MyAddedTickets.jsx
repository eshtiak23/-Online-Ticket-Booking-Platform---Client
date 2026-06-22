import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spinner";

export default function MyAddedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [updateForm, setUpdateForm] = useState({});

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/tickets/vendor/all");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await api.delete(`/api/tickets/${id}`);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/api/tickets/${id}`, updateForm);
      setEditing(null);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">My Added Tickets</h2>
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets added yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((t) => (
            <div key={t._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <img src={t.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400"} alt={t.title} className="w-full h-36 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-gray-500">{t.from} → {t.to}</p>
                <p className="text-sm">${t.price} | Qty: {t.quantity}</p>
                <span className={`inline-block px-2 py-0.5 mt-1 text-xs rounded-full capitalize ${
                  t.verificationStatus === "approved" ? "bg-green-100 dark:bg-green-900 text-green-700" :
                  t.verificationStatus === "rejected" ? "bg-red-100 dark:bg-red-900 text-red-700" :
                  "bg-yellow-100 dark:bg-yellow-900 text-yellow-700"
                }`}>{t.verificationStatus}</span>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setEditing(t._id); setUpdateForm(t); }}
                    disabled={t.verificationStatus === "rejected"}
                    className={`flex-1 py-1.5 text-sm rounded-lg border transition ${t.verificationStatus === "rejected" ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900"}`}>Update</button>
                  <button onClick={() => handleDelete(t._id)}
                    disabled={t.verificationStatus === "rejected"}
                    className={`flex-1 py-1.5 text-sm rounded-lg border transition ${t.verificationStatus === "rejected" ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900"}`}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Update Ticket</h3>
            <div className="space-y-3">
              <input type="text" value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Title" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={updateForm.from} onChange={(e) => setUpdateForm({ ...updateForm, from: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="From" />
                <input type="text" value={updateForm.to} onChange={(e) => setUpdateForm({ ...updateForm, to: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="To" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={updateForm.price} onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Price" />
                <input type="number" value={updateForm.quantity} onChange={(e) => setUpdateForm({ ...updateForm, quantity: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Quantity" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={updateForm.departureDate} onChange={(e) => setUpdateForm({ ...updateForm, departureDate: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                <input type="time" value={updateForm.departureTime} onChange={(e) => setUpdateForm({ ...updateForm, departureTime: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditing(null)} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              <button onClick={() => handleUpdate(editing)} className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
