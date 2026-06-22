import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚌</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TicketBari</span>
            </div>
            <p className="text-sm text-gray-400">Book bus, train, launch & flight tickets easily. Your one-stop travel booking platform.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-purple-400 transition">Home</Link>
              <Link to="/all-tickets" className="block hover:text-purple-400 transition">All Tickets</Link>
              <Link to="/contact" className="block hover:text-purple-400 transition">Contact Us</Link>
              <Link to="/about" className="block hover:text-purple-400 transition">About</Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <p>support@ticketbari.com</p>
              <p>+880 1700-000000</p>
              <a href="#" className="block hover:text-purple-400 transition">Facebook Page</a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded text-xs">Visa</span>
              <span className="px-3 py-1 bg-gray-800 rounded text-xs">Mastercard</span>
              <span className="px-3 py-1 bg-gray-800 rounded text-xs">Stripe</span>
              <span className="px-3 py-1 bg-gray-800 rounded text-xs">bKash</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; 2025 TicketBari. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
