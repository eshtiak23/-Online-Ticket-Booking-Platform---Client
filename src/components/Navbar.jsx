import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "All Tickets", path: "/all-tickets" },
  { label: "Dashboard", path: "/dashboard", requiresAuth: true },
];

const LINK_CLASSES =
  "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300";
const LINK_INACTIVE =
  "text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blossom-500 hover:to-primary-500 hover:shadow-lg hover:shadow-blossom-500/20";
const LINK_ACTIVE =
  "bg-gradient-to-r from-blossom-500 to-primary-500 text-white shadow-lg shadow-blossom-500/25";

function useNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleProfile = useCallback(() => setProfileOpen((p) => !p), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  useEffect(() => {
    function handleClick(e) {
      if (
        profileOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        closeProfile();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen, closeProfile]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return {
    mobileOpen,
    profileOpen,
    menuRef,
    btnRef,
    toggleMobile,
    closeMobile,
    toggleProfile,
    closeProfile,
  };
}

function BrandLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 group"
      aria-label="TicketBari Home"
    >
      <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blossom-500 to-primary-600 text-white text-lg font-bold shadow-lg shadow-blossom-500/30 group-hover:scale-110 transition-transform duration-300">
        T
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-blossom-400/40 to-primary-500/40 animate-glow-pulse" />
      </span>
      <span className="text-xl font-extrabold bg-gradient-to-r from-blossom-500 via-primary-500 to-blossom-400 bg-[length:200%_200%] animate-shimmer bg-clip-text text-transparent tracking-tight">
        TicketBari
      </span>
    </Link>
  );
}

function NavLinks({ location, onNavigate, user, className = "" }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {NAV_ITEMS.map((item) => {
        if (item.requiresAuth && !user) return null;
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={`${LINK_CLASSES} ${
              isActive ? LINK_ACTIVE : LINK_INACTIVE
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function useProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (
        open &&
        ref.current &&
        !ref.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return { open, setOpen, ref, btnRef };
}

function UserDropdown({ user, onLogout, onNavigate }) {
  const { open, setOpen, ref, btnRef } = useProfileDropdown();

  const dashboardLink = "/dashboard";

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/80 dark:bg-ocean-800/80 border border-gray-200 dark:border-ocean-700 hover:border-blossom-400 dark:hover:border-blossom-500 shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        <div className="relative">
          <img
            src={
              user.image ||
              `https://ui-avatars.com/api/?name=${user.name}&background=ec4899&color=fff&bold=true`
            }
            alt=""
            className="w-7 h-7 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blossom-400 transition-all duration-300"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-ocean-800 rounded-full" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
          {user.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          ref={ref}
          className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-ocean-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-ocean-700 py-2 overflow-hidden"
        >
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-ocean-700 mb-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>

          <Link
            to={dashboardLink}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-blossom-50 dark:hover:bg-ocean-700 hover:text-blossom-600 dark:hover:text-blossom-400 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            to={dashboardLink}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-blossom-50 dark:hover:bg-ocean-700 hover:text-blossom-600 dark:hover:text-blossom-400 transition-colors"
          >
            <User className="w-4 h-4" />
            My Profile
          </Link>

          <div className="border-t border-gray-100 dark:border-ocean-700 mt-1 pt-1">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNav({ open, onClose, location, user }) {
  return (
    <div
      className={`md:hidden fixed inset-x-0 top-16 bottom-0 z-40 transition-all duration-500 ease-in-out ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-ocean-950/60 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <nav
        className={`relative mx-4 mt-2 bg-white/95 dark:bg-ocean-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-ocean-700 p-5 transition-all duration-500 ease-out ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-6 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.filter(item => !item.requiresAuth || user).map((item, i) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? LINK_ACTIVE
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-ocean-700"
                }`}
                style={{
                  transitionDelay: `${i * 60}ms`,
                  transform: open ? "translateX(0)" : "translateX(-12px)",
                  opacity: open ? 1 : 0,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mobileOpen,
    toggleMobile,
    closeMobile,
  } = useNavbar();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-16">
        <div className="h-full bg-white/70 dark:bg-ocean-900/70 backdrop-blur-xl border-b border-white/20 dark:border-ocean-800/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <BrandLogo />

            <div className="hidden md:flex items-center gap-6">
              <NavLinks location={location} user={user} />
            </div>

            <div className="hidden md:flex items-center gap-2.5">
              <ThemeToggle />
              {user ? (
                <UserDropdown
                  user={user}
                  onLogout={handleLogout}
                  onNavigate={closeMobile}
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blossom-500 hover:to-primary-500 hover:shadow-lg hover:shadow-blossom-500/20 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blossom-500 to-primary-500 text-white shadow-md shadow-blossom-500/25 hover:shadow-lg hover:shadow-blossom-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button
                onClick={toggleMobile}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-ocean-800/80 border border-gray-200 dark:border-ocean-700 hover:bg-gray-100 dark:hover:bg-ocean-700 transition-all duration-300"
                aria-label="Toggle menu"
              >
                <Menu
                  className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 absolute ${
                    mobileOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                  }`}
                />
                <X
                  className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 absolute ${
                    mobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={closeMobile}
        location={location}
        user={user}
      />
    </>
  );
}
