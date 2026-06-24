import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";

const perksList = ["AC", "Non-AC", "Breakfast", "Lunch", "WiFi", "Charging Point", "Reading Light", "Snacks"];

export default function AddTicket() {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: "", from: "", to: "", transportType: "Bus",
      price: "", quantity: "", departureDate: "", departureTime: "",
    }
  });
  const [perks, setPerks] = useState([]);
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState("");

  const handlePerk = (perk) => {
    setPerks(prev => prev.includes(perk) ? prev.filter(p => p !== perk) : [...prev, perk]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setImage(data.data.url);
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.post("/api/tickets", {
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
        perks,
        image,
      });
      setSuccess("Ticket added successfully!");
      reset();
      setPerks([]);
      setImage("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add ticket");
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Add Ticket</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ticket Title</label>
            <input {...register("title", { required: "Title is required" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Transport Type</label>
            <select {...register("transportType")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none">
              <option>Bus</option><option>Train</option><option>Launch</option><option>Plane</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">From (Location)</label>
            <input {...register("from", { required: "From location is required" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
            {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To (Location)</label>
            <input {...register("to", { required: "To location is required" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
            {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (per unit)</label>
            <input type="number" {...register("price", { required: "Price is required", min: { value: 0, message: "Price must be positive" } })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ticket Quantity</label>
            <input type="number" {...register("quantity", { required: "Quantity is required", min: { value: 1, message: "At least 1 ticket" } })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departure Date</label>
            <input type="date" {...register("departureDate", { required: "Date is required" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
            {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departure Time</label>
            <input type="time" {...register("departureTime", { required: "Time is required" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none" />
            {errors.departureTime && <p className="text-red-500 text-xs mt-1">{errors.departureTime.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Perks</label>
          <div className="flex flex-wrap gap-2">
            {perksList.map((perk) => (
              <button key={perk} type="button" onClick={() => handlePerk(perk)}
                className={`px-3 py-1 text-sm rounded-full border transition ${perks.includes(perk) ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 dark:border-gray-600 hover:border-purple-500"}`}>{perk}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image Upload</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
          {image && <img src={image} alt="" className="w-32 h-20 object-cover mt-2 rounded" />}
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
