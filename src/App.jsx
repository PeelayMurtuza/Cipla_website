import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
import News from "./components/News";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
    { to: "/news", label: "News" },
  ];

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen w-full relative overflow-hidden transition-all duration-700 ${
          isDark ? "bg-black text-white" : "bg-[#d8e9f4] text-gray-900"
        }`}
      >
        {/* 🌤 Light Mode Background (sunrise blur gradient) */}
        {!isDark && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 50% 60%,
                  rgba(255, 204, 112, 0.9) 0%,
                  rgba(255, 163, 30, 0.75) 25%,
                  rgba(255, 94, 98, 0.6) 40%,
                  rgba(255, 182, 120, 0.4) 55%,
                  rgba(216, 233, 244, 1) 80%)
              `,
              filter: "blur(60px)",
            }}
          />
        )}

        {/* 🌙 Dark Mode - Tropical Dusk Glow Background */}
        {isDark && (
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 100%, rgba(255, 99, 71, 0.6) 0%, transparent 60%),
                  radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.4) 0%, transparent 70%),
                  radial-gradient(circle at 50% 100%, rgba(60, 179, 113, 0.3) 0%, transparent 80%)
                `,
              }}
            />
          </div>
        )}

        {/* 🌐 NAVBAR */}
        <nav
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-3/4 md:w-2/3 lg:w-1/2
            flex items-center justify-between px-5 py-2 rounded-2xl
            backdrop-blur-md border transition-all duration-300
            ${
              isDark
                ? "bg-white/5 border-white/10 text-white shadow-lg"
                : "bg-white/60 border-gray-200 text-gray-900 shadow-md"
            }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full grid place-items-center font-bold text-lg
                ${
                  isDark
                    ? "bg-gradient-to-br from-orange-500 to-yellow-400 text-black"
                    : "bg-gradient-to-br from-orange-400 to-pink-500 text-white"
                }`}
            >
              CP
            </div>
            <h1 className="font-semibold tracking-wide text-sm sm:text-base">Cipla Pharma</h1>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-all duration-300 
                   ${
                     isActive
                       ? isDark
                         ? "text-yellow-300"
                         : "text-pink-600"
                       : isDark
                       ? "text-white/80 hover:text-yellow-300"
                       : "text-gray-800 hover:text-pink-500"
                   }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`hidden sm:flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 
                ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              <span className="text-base">{isDark ? "🌙" : "🌞"}</span>
              <span className="hidden lg:inline">{isDark ? "Dark" : "Light"}</span>
            </button>

            {/* Mobile Theme Toggle (Icon only) */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`sm:hidden rounded-full p-2 transition-all duration-300 
                ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              <span className="text-base">{isDark ? "🌙" : "🌞"}</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden rounded-full p-2 transition-all duration-300 
                ${isDark 
                  ? "bg-white/10 hover:bg-white/20 text-white" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            } ${isDark ? "bg-black/80" : "bg-black/50"}`}
            onClick={toggleMobileMenu}
          />

          {/* Mobile Menu Panel */}
          <div
            className={`absolute top-24 right-4 w-64 rounded-2xl p-6 transform transition-all duration-300 backdrop-blur-md border shadow-xl
              ${
                isMobileMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }
              ${
                isDark
                  ? "bg-white/5 border-white/10 text-white"
                  : "bg-white/80 border-gray-200 text-gray-900"
              }`}
          >
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) =>
                    `py-3 px-4 rounded-xl text-base font-medium transition-all duration-300 text-center
                     ${
                       isActive
                         ? isDark
                           ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                           : "bg-pink-500/20 text-pink-600 border border-pink-500/30"
                         : isDark
                         ? "bg-white/5 hover:bg-white/10 border border-transparent"
                         : "bg-gray-100 hover:bg-gray-200 border border-transparent"
                     }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Theme Toggle in Menu */}
            <div className="mt-6 pt-6 border-t border-gray-500/30">
              <button
                onClick={() => {
                  setTheme(isDark ? "light" : "dark");
                  toggleMobileMenu();
                }}
                className={`w-full py-3 px-4 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
              >
                <span className="text-lg">{isDark ? "🌙" : "🌞"}</span>
                <span>Switch to {isDark ? "Light" : "Dark"} Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* 📄 Page Content */}
        <main className="relative z-10 pt-24 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}