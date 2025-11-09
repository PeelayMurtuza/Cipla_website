import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`w-full max-w-md p-8 rounded-3xl backdrop-blur-sm border ${
          isDark 
            ? "bg-white/5 border-white/10" 
            : "bg-white/60 border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl ${
              isDark
                ? "bg-gradient-to-br from-orange-500 to-yellow-400 text-black"
                : "bg-gradient-to-br from-orange-400 to-pink-500 text-white"
            }`}>
              CP
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Welcome Back
          </h1>
          <p className={isDark ? "text-white/70" : "text-gray-600"}>
            Sign in to your Cipla account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-white/80" : "text-gray-700"
            }`}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                isDark 
                  ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-yellow-300" 
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500"
              } focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-yellow-300/20" : "focus:ring-pink-500/20"
              }`}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-white/80" : "text-gray-700"
            }`}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                isDark 
                  ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-yellow-300" 
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500"
              } focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-yellow-300/20" : "focus:ring-pink-500/20"
              }`}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className={`w-4 h-4 rounded border transition-all duration-300 ${
                  isDark 
                    ? "bg-white/10 border-white/20 text-yellow-300 focus:ring-yellow-300/20" 
                    : "bg-white border-gray-300 text-pink-500 focus:ring-pink-500/20"
                } focus:ring-2 focus:outline-none`}
              />
              <span className={`ml-2 text-sm ${
                isDark ? "text-white/80" : "text-gray-700"
              }`}>
                Remember me
              </span>
            </label>
            
            <a href="#" className={`text-sm font-medium transition-all duration-300 ${
              isDark 
                ? "text-yellow-300 hover:text-yellow-200" 
                : "text-pink-600 hover:text-pink-500"
            }`}>
              Forgot password?
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isDark 
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-black hover:shadow-lg hover:shadow-orange-500/25" 
                : "bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:shadow-lg hover:shadow-pink-500/25"
            }`}
          >
            Sign In
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className={`flex-1 h-px ${
            isDark ? "bg-white/20" : "bg-gray-300"
          }`}></div>
          <span className={`px-3 text-sm ${
            isDark ? "text-white/60" : "text-gray-500"
          }`}>
            Or continue with
          </span>
          <div className={`flex-1 h-px ${
            isDark ? "bg-white/20" : "bg-gray-300"
          }`}></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-300 ${
            isDark 
              ? "border-white/20 text-white/80 hover:bg-white/10" 
              : "border-gray-300 text-gray-700 hover:bg-white"
          }`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          
          <button className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-300 ${
            isDark 
              ? "border-white/20 text-white/80 hover:bg-white/10" 
              : "border-gray-300 text-gray-700 hover:bg-white"
          }`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
            Twitter
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className={isDark ? "text-white/70" : "text-gray-600"}>
            Don't have an account?{" "}
          </span>
          <Link 
            to="/register" 
            className={`font-semibold transition-all duration-300 ${
              isDark 
                ? "text-yellow-300 hover:text-yellow-200" 
                : "text-pink-600 hover:text-pink-500"
            }`}
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}