import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import TicketCard from "../components/TicketCard";
import Spinner from "../components/Spinner";
import api from "../utils/api";

export default function Home() {
  const [advertised, setAdvertised] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [advRes, latRes] = await Promise.all([
          api.get("/api/tickets/advertised"),
          api.get("/api/tickets/latest"),
        ]);
        setAdvertised(advRes.data);
        setLatest(latRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  const slides = [
    {
      title: "Your Journey Starts Here",
      subtitle: "Book bus, train, launch & flight tickets with ease. Safe, fast, and reliable.",
      bg: "from-purple-900 via-purple-800 to-pink-800",
      img: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920",
    },
    {
      title: "Travel Anywhere, Anytime",
      subtitle: "Explore thousands of routes across the country at the best prices.",
      bg: "from-blue-900 via-indigo-800 to-purple-800",
      img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920",
    },
    {
      title: "Safe & Secure Booking",
      subtitle: "Pay securely with Stripe and get instant confirmation.",
      bg: "from-green-900 via-teal-800 to-blue-800",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920",
    },
  ];

  return (
    <div>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation
        className="h-[500px]"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <section className={`relative h-full flex items-center justify-center overflow-hidden bg-gradient-to-br ${slide.bg}`}>
              <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${slide.img}')` }}></div>
              <div className="relative text-center px-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">{slide.title}</h1>
                <p className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto">{slide.subtitle}</p>
                <div className="flex gap-4 justify-center">
                  <Link to="/all-tickets" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-medium hover:opacity-90 transition shadow-lg">Browse Tickets</Link>
                  <Link to="/register" className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium border border-white/20 hover:bg-white/20 transition">Get Started</Link>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>

      {advertised.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Featured Tickets</h2>
          <p className="text-center text-gray-500 mb-8">Hand-picked tickets by our team</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertised.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Latest Tickets</h2>
        <p className="text-center text-gray-500 mb-8">Recently added trips</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {latest.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Popular Routes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Dhaka → Chittagong", "Dhaka → Sylhet", "Dhaka → Cox's Bazar", "Dhaka → Khulna"].map((route) => (
              <Link key={route} to={`/all-tickets?search=${route.replace(" → ", "-")}`} className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition text-center">
                <p className="text-3xl mb-2">🚍</p>
                <p className="font-semibold">{route}</p>
                <p className="text-sm text-gray-500">Starting from $15</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🔒", title: "Secure Payments", desc: "Protected by Stripe" },
            { icon: "⚡", title: "Instant Booking", desc: "Confirm in seconds" },
            { icon: "🎫", title: "Easy Cancellation", desc: "Flexible options" },
            { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
          ].map((item) => (
            <div key={item.title} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700">
              <p className="text-4xl mb-3">{item.icon}</p>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
