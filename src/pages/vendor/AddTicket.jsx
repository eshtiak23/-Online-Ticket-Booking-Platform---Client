import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";

const perksList = ["AC", "Non-AC", "Breakfast", "Lunch", "WiFi", "Charging Point", "Reading Light", "Snacks"];

export default function AddTicket() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "", from: "", to: "", transportType: "Bus", price: "", quantity: "",
    departureDate: "", departureTime: "", perks: [], image: "",
  });
  const [success, setSuccess] = useState("");

  const handlePerk = (perk) => {
    setForm((prev) => ({
      ...prev,
      perks: prev.perks.includes(perk) ? prev.perks.filter((p) => p !== perk) : [...prev.perks, perk],
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.data.url }));
      }
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/tickets", { ...form, price: Number(form.price), quantity: Number(form.quantity) });
      setSuccess("Ticket added successfully!");
      setForm({ title: "", from: "", to: "", transportType: "Bus", price: "", quantity: "", departureDate: "", departureTime: "", perks: [], image: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add ticket");
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Add Ticket</h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ticket Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Transport Type</label>
            <select value={form.transportType} onChange={(e) => setForm({ ...form, transportType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none">
              <option>Bus</option><option>Train</option><option>Launch</option><option>Plane</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">From (Location)</label>
            <input type="text" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To (Location)</label>
            <input type="text" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (per unit)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ticket Quantity</label>
            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required min="1" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departure Date</label>
            <input type="date" value={form.departureDate} onChange={(e) => setForm({ ...form, departureDate: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departure Time</label>
            <input type="time" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Perks</label>
          <div className="flex flex-wrap gap-2">
            {perksList.map((perk) => (
              <button key={perk} type="button" onClick={() => handlePerk(perk)}
                className={`px-3 py-1 text-sm rounded-full border transition ${form.perks.includes(perk) ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 dark:border-gray-600 hover:border-purple-500"}`}>{perk}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image Upload</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
          {form.image && <img src={form.image} alt="" className="w-32 h-20 object-cover mt-2 rounded" />}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vendor Name</label>
            <input type="text" value={user?.name || ""} readOnly className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vendor Email</label>
            <input type="text" value={user?.email || ""} readOnly className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
          </div>
        </div>

        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition">Add Ticket</button>
      </form>
    </div>
  );
}
