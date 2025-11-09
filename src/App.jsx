import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
import News from "./components/News";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

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

          {/* Nav Links */}
          <div className="hidden md:flex gap-5">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/login", label: "Login" },
              { to: "/register", label: "Register" },
              { to: "/news", label: "News" },
            ].map((link) => (
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

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 
              ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            {isDark ? "🌙 Dark" : "🌞 Light"}
          </button>
        </nav>

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
