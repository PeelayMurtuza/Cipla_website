import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function About() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const features = [
    {
      icon: "🔬",
      title: "Research & Development",
      description: "Cutting-edge research facilities with 50+ ongoing projects"
    },
    {
      icon: "🌍",
      title: "Global Reach",
      description: "Serving patients in 80+ countries worldwide"
    },
    {
      icon: "❤️",
      title: "Patient First",
      description: "Patient-centric approach in all our innovations"
    },
    {
      icon: "⚡",
      title: "Innovation",
      description: "Continuous innovation in pharmaceutical technology"
    }
  ];

  const milestones = [
    { year: "1935", event: "Company Founded" },
    { year: "1985", event: "Global Expansion" },
    { year: "2005", event: "Research Center Established" },
    { year: "2020", event: "Digital Health Initiatives" }
  ];

  return (
    <div className="min-h-screen py-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
          About Cipla
        </h1>
        <p className={`text-xl max-w-3xl mx-auto ${
          isDark ? "text-white/80" : "text-gray-700"
        }`}>
          For over 85 years, Cipla has been dedicated to our purpose of 'Caring for Life' - 
          ensuring that everyone has access to quality and affordable healthcare.
        </p>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-8 mb-16"
      >
        <div className={`p-8 rounded-2xl backdrop-blur-sm border ${
          isDark 
            ? "bg-white/5 border-white/10" 
            : "bg-white/60 border-gray-200"
        }`}>
          <div className="text-4xl mb-4">🎯</div>
          <h3 className={`text-2xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Our Mission
          </h3>
          <p className={isDark ? "text-white/70" : "text-gray-600"}>
            To be a leading global healthcare company using technology and innovation 
            to meet everyday needs of all patients.
          </p>
        </div>
        
        <div className={`p-8 rounded-2xl backdrop-blur-sm border ${
          isDark 
            ? "bg-white/5 border-white/10" 
            : "bg-white/60 border-gray-200"
        }`}>
          <div className="text-4xl mb-4">👁️</div>
          <h3 className={`text-2xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Our Vision
          </h3>
          <p className={isDark ? "text-white/70" : "text-gray-600"}>
            A world where healthcare is accessible and affordable for all, 
            driven by sustainable and ethical practices.
          </p>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Cipla?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-2xl text-center backdrop-blur-sm border ${
                isDark 
                  ? "bg-white/5 border-white/10" 
                  : "bg-white/60 border-gray-200"
              }`}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className={`text-lg font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${
                isDark ? "text-white/70" : "text-gray-600"
              }`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full ${
            isDark ? "bg-white/20" : "bg-gray-300"
          }`}></div>
          
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`flex items-center mb-8 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className={`w-1/2 p-4 ${
                index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
              }`}>
                <div className={`inline-block p-4 rounded-2xl backdrop-blur-sm border ${
                  isDark 
                    ? "bg-white/5 border-white/10" 
                    : "bg-white/60 border-gray-200"
                }`}>
                  <div className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-yellow-300" : "text-pink-600"
                  }`}>
                    {milestone.year}
                  </div>
                  <div className={isDark ? "text-white/80" : "text-gray-700"}>
                    {milestone.event}
                  </div>
                </div>
              </div>
              
              {/* Timeline dot */}
              <div className={`w-4 h-4 rounded-full z-10 ${
                isDark 
                  ? "bg-gradient-to-r from-orange-500 to-yellow-400" 
                  : "bg-gradient-to-r from-orange-400 to-pink-500"
              }`}></div>
              
              <div className="w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className={`p-8 rounded-2xl backdrop-blur-sm border text-center ${
          isDark 
            ? "bg-white/5 border-white/10" 
            : "bg-white/60 border-gray-200"
        }`}
      >
        <h2 className="text-3xl font-bold mb-4">Leadership & Innovation</h2>
        <p className={`text-lg mb-6 max-w-2xl mx-auto ${
          isDark ? "text-white/80" : "text-gray-700"
        }`}>
          Our team of 10,000+ professionals worldwide is committed to excellence 
          in pharmaceutical research and patient care.
        </p>
        <div className={`inline-flex gap-4 p-2 rounded-xl ${
          isDark ? "bg-white/10" : "bg-gray-100"
        }`}>
          <span className={`px-4 py-2 rounded-lg font-semibold ${
            isDark 
              ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-black" 
              : "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
          }`}>
            10,000+ Employees
          </span>
          <span className={`px-4 py-2 rounded-lg font-semibold ${
            isDark ? "text-white/80" : "text-gray-700"
          }`}>
            25+ Manufacturing Sites
          </span>
        </div>
      </motion.section>
    </div>
  );
}