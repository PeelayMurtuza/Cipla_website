import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

// Icons
import {
    StarIcon,
    HeartIcon,
    ShareIcon,
    BookmarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlayIcon,
    PauseIcon,
    ChartBarIcon,
    UserGroupIcon,
    ClockIcon,
    EyeIcon
} from "@heroicons/react/24/solid";

gsap.registerPlugin(ScrollTrigger);

/* ===========================================
   Premium Pharma Home Page
   =========================================== */

const PRODUCTS = [
    {
        id: 1,
        name: "RespiraX Smart Inhaler",
        tag: "Respiratory Care",
        rating: 4.6,
        reviews: 324,
        desc: "Next-generation smart inhaler with real-time dose tracking, adherence analytics, and patient engagement features.",
        img: "https://images.unsplash.com/photo-1585435557343-3b092031d5ad?w=500",
        features: ["Dose Tracking", "Mobile App", "Environmental Sensors", "AI Analytics"],
        price: "$299",
        status: "Clinical Trials",
        efficacy: "94%"
    },
    {
        id: 2,
        name: "ViroClear Antiviral Therapy",
        tag: "Antiviral Treatment",
        rating: 4.2,
        reviews: 210,
        desc: "Advanced antiviral formulation using lipid nanoparticle technology for improved cellular uptake.",
        img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
        features: ["Broad Spectrum", "Fast Acting", "Oral Administration", "Pediatric Safe"],
        price: "$45",
        status: "FDA Approved",
        efficacy: "87%"
    },
    {
        id: 3,
        name: "ChronicCare FDC Pack",
        tag: "Chronic Disease Management",
        rating: 4.8,
        reviews: 120,
        desc: "Comprehensive chronic care solution integrating multiple medications with digital adherence tracking.",
        img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500",
        features: ["Multi-Drug Integration", "Compliance Tracking", "Auto Refill", "Telemedicine Ready"],
        price: "$79/month",
        status: "Market Ready",
        efficacy: "96%"
    },
    {
        id: 4,
        name: "ColdChain Sense Pro",
        tag: "Vaccine Logistics",
        rating: 4.4,
        reviews: 86,
        desc: "Enterprise-grade IoT monitoring system with satellite connectivity and blockchain-based audit trails.",
        img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500",
        features: ["Real-time Monitoring", "Predictive Analytics", "Blockchain Audit", "Multi-Lingual"],
        price: "$1,299",
        status: "Deployed",
        efficacy: "99.8%"
    },
    {
        id: 5,
        name: "NeuroSync Cognitive Aid",
        tag: "Neurological Support",
        rating: 4.7,
        reviews: 156,
        desc: "AI-powered cognitive training system with adaptive difficulty and progress tracking.",
        img: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500",
        features: ["AI Adaptation", "Progress Analytics", "Clinician Portal", "Family Access"],
        price: "$449",
        status: "Clinical Trials",
        efficacy: "91%"
    }
];

// Star Rating Component
const StarRating = ({ rating, size = 16 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="relative">
                    <StarIcon
                        className={`${i < fullStars ? 'text-amber-400' : 'text-gray-300'} 
            ${size === 16 ? 'h-4 w-4' : 'h-5 w-5'}`}
                        fill="currentColor"
                    />
                    {i === fullStars && hasHalfStar && (
                        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                            <StarIcon
                                className={`text-amber-400 ${size === 16 ? 'h-4 w-4' : 'h-5 w-5'}`}
                                fill="currentColor"
                            />
                        </div>
                    )}
                </div>
            ))}
            <span className="ml-2 text-sm font-medium text-gray-600">
                {rating.toFixed(1)}
            </span>
        </div>
    );
};

// Stat Badge Component
const StatBadge = ({ icon: Icon, value, label, color = "blue" }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className={`flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm ${color === 'blue' ? 'bg-blue-500/10 text-blue-600' :
                color === 'green' ? 'bg-green-500/10 text-green-600' :
                    color === 'purple' ? 'bg-purple-500/10 text-purple-600' :
                        'bg-amber-500/10 text-amber-600'
            }`}
    >
        <Icon className="h-6 w-6" />
        <div>
            <div className="text-lg font-bold">{value}</div>
            <div className="text-sm opacity-75">{label}</div>
        </div>
    </motion.div>
);

// Reviews data moved outside component
const REVIEWS_DATA = [
    {
        id: 1,
        author: "Dr. A. Desai",
        role: "Pulmonology Specialist",
        hospital: "Apollo Hospitals, Mumbai",
        text: "RespiraX has transformed how we manage asthma patients. The adherence tracking alone improved compliance by 62% in our clinic.",
        rating: 5,
        avatar: "D"
    },
    {
        id: 2,
        author: "Nurse R. Kumar",
        role: "ICU Head Nurse",
        hospital: "AIIMS Delhi",
        text: "ColdChain Sense prevented three potential vaccine spoilage incidents last month. The real-time alerts are life-saving.",
        rating: 4,
        avatar: "R"
    },
    {
        id: 3,
        author: "Dr. S. Rao",
        role: "Infectious Disease Specialist",
        hospital: "Fortis Bangalore",
        text: "ViroClear's bioavailability is remarkable. We're seeing faster recovery times with minimal side effects in our patients.",
        rating: 4,
        avatar: "S"
    }
];

// Reviews Section Component
const ReviewsSection = () => {
    const [autoPlay, setAutoPlay] = useState(false);
    const [currentReview, setCurrentReview] = useState(0);
    const carouselRef = useRef(null);
    const autoPlayIntervalRef = useRef(null);

    const scrollToReview = (index) => {
        const el = carouselRef.current;
        if (!el) return;
        
        const reviewWidth = 320;
        const gap = 32;
        const scrollPosition = index * (reviewWidth + gap);
        
        el.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        setCurrentReview(index);
    };

    const handleScroll = () => {
        const el = carouselRef.current;
        if (!el) return;
        
        const scrollLeft = el.scrollLeft;
        const reviewWidth = 320;
        const gap = 32;
        const newIndex = Math.round(scrollLeft / (reviewWidth + gap));
        
        setCurrentReview(newIndex);
    };

    const scrollCarousel = (dir = 1) => {
        const el = carouselRef.current;
        if (!el) return;
        
        const step = el.clientWidth * 0.8;
        const targetScroll = el.scrollLeft + (dir * step);
        
        gsap.to(el, {
            scrollLeft: targetScroll,
            duration: 0.8,
            ease: "power2.inOut"
        });
    };

    // Auto-play effect
    useEffect(() => {
        if (!autoPlay) {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
            return;
        }

        autoPlayIntervalRef.current = setInterval(() => {
            const nextIndex = (currentReview + 1) % REVIEWS_DATA.length;
            scrollToReview(nextIndex);
        }, 4000);

        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
        };
    }, [autoPlay, currentReview]);

    return (
        <section data-scroll-section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    className="text-center mb-16 reveal"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                        Trusted by Practitioners
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Carousel Controls */}
                    <div className="flex justify-between items-center mb-8">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scrollCarousel(-1)}
                            className="p-4 rounded-2xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all group"
                        >
                            <ChevronLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                        </motion.button>

                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setAutoPlay(!autoPlay)}
                                className={`p-4 rounded-2xl shadow-2xl border transition-all ${autoPlay
                                        ? 'bg-green-500 text-white border-green-500'
                                        : 'bg-white text-gray-600 border-gray-200 hover:text-indigo-600'
                                    }`}
                            >
                                {autoPlay ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                            </motion.button>
                            <span className="text-sm text-gray-500 font-medium">
                                {autoPlay ? 'Auto-playing' : 'Click to auto-play'}
                            </span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scrollCarousel(1)}
                            className="p-4 rounded-2xl bg-white shadow-2xl border border-gray-200 hover:shadow-3xl transition-all group"
                        >
                            <ChevronRightIcon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                        </motion.button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex justify-center mb-6">
                        <div className="flex gap-2">
                            {REVIEWS_DATA.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToReview(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${currentReview === index
                                            ? 'bg-indigo-600 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Carousel Container */}
                    <div
                        ref={carouselRef}
                        className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-8 px-4"
                        style={{ scrollBehavior: 'smooth' }}
                        onScroll={handleScroll}
                    >
                        {REVIEWS_DATA.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                viewport={{ once: true, margin: "-50px" }}
                                whileHover={{ y: -10 }}
                                className="flex-none w-80 md:w-96 snap-start cursor-grab active:cursor-grabbing"
                            >
                                <div className=" rounded-3xl p-8 shadow-2xl border border-gray-200 h-full relative overflow-hidden group hover:shadow-3xl transition-all duration-500">

                                    {/* Background Gradient Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Verified Badge with Animation */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        whileInView={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                                        className="absolute top-6 right-6 z-10"
                                    >
                                        <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            Verified
                                        </div>
                                    </motion.div>

                                    {/* Review Header */}
                                    <div className="flex items-start justify-between mb-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="relative"
                                            >
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                    {review.avatar}
                                                </div>
                                                {/* Online Indicator */}
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                            </motion.div>

                                            <div>
                                                <motion.h3
                                                    className="font-bold text-gray-900 text-lg"
                                                    whileHover={{ color: "#4f46e5" }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {review.author}
                                                </motion.h3>
                                                <div className="text-sm text-gray-600 font-medium">{review.role}</div>
                                                <div className="text-xs text-gray-500 mt-1">{review.hospital}</div>

                                                {/* Experience Badge */}
                                                <div className="flex items-center gap-1 mt-2">
                                                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                                    <span className="text-xs text-amber-600 font-medium">10+ years experience</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating with Animation */}
                                    <motion.div
                                        className="mb-6 relative z-10"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: index * 0.2 + 0.4 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <StarRating rating={review.rating} size={20} />
                                            <span className="text-sm font-medium text-gray-600">
                                                {review.rating}/5
                                            </span>
                                        </div>

                                        {/* Rating Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${(review.rating / 5) * 100}%` }}
                                                transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                                                className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Review Text */}
                                    <motion.blockquote
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: index * 0.2 + 0.6 }}
                                        className="text-gray-700 leading-relaxed mb-8 relative z-10 text-lg italic"
                                    >
                                        <div className="text-4xl text-gray-300 absolute -top-4 -left-2">"</div>
                                        {review.text}
                                        <div className="text-4xl text-gray-300 absolute -bottom-8 -right-2">"</div>
                                    </motion.blockquote>

                                    {/* Review Metrics */}
                                    <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                                            <div className="text-lg font-bold text-blue-600">24</div>
                                            <div className="text-xs text-blue-500">Likes</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-xl">
                                            <div className="text-lg font-bold text-green-600">8</div>
                                            <div className="text-xs text-green-500">Shares</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded-xl">
                                            <div className="text-lg font-bold text-purple-600">156</div>
                                            <div className="text-xs text-purple-500">Views</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 + 0.7 }}
                                        className="flex items-center justify-between relative z-10 pt-4 border-t border-gray-100"
                                    >
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>2 days ago</span>
                                        </div>

                                        <div className="flex gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                                            >
                                                <HeartIcon className="w-4 h-4" />
                                                Like
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl font-medium hover:bg-green-100 transition-colors"
                                            >
                                                <ShareIcon className="w-4 h-4" />
                                                Share
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {/* Hover Effect Border */}
                                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-200 transition-all duration-500 pointer-events-none" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Carousel Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex justify-center items-center gap-6 mt-8 text-sm text-gray-600"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span>Live Reviews</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4" />
                            <span>{REVIEWS_DATA.length} Verified Practitioners</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <StarIcon className="w-4 h-4 text-amber-400" />
                            <span>4.7 Average Rating</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// Additional Sections
const FeaturesSection = () => (
    <section data-scroll-section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
            <motion.div
                className="text-center mb-16 reveal"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
                    Why Choose Cipla?
                </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: ChartBarIcon, title: "Clinical Excellence", desc: "94% success rate in clinical trials", color: "blue" },
                    { icon: UserGroupIcon, title: "Global Reach", desc: "Serving patients in 80+ countries", color: "green" },
                    { icon: ClockIcon, title: "Fast Innovation", desc: "50+ active R&D projects", color: "purple" },
                    { icon: EyeIcon, title: "Transparent", desc: "Verified practitioner reviews", color: "amber" },
                ].map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                        className="text-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                    >
                        <StatBadge
                            icon={feature.icon}
                            value=""
                            label={feature.title}
                            color={feature.color}
                        />
                        <p className="text-gray-600 mt-4">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const StatsSection = () => (
    <section data-scroll-section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2
                        }
                    }
                }}
            >
                {[
                    { value: "50+", label: "Active R&D Projects", description: "Innovations in pipeline", color: "from-blue-500 to-cyan-500", icon: "🔬" },
                    { value: "80+", label: "Countries Reached", description: "Global presence", color: "from-green-500 to-emerald-500", icon: "🌍" },
                    { value: "1M+", label: "Lives Impacted", description: "Positive outcomes", color: "from-purple-500 to-pink-500", icon: "❤️" },
                    { value: "94%", label: "Success Rate", description: "Clinical trials", color: "from-amber-500 to-orange-500", icon: "📊" }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ y: -10 }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200 text-center group"
                    >
                        <div className={`text-4xl mb-4 w-20 h-20 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mx-auto group-hover:scale-110 transition-transform duration-300`}>
                            {stat.icon}
                        </div>
                        <div className="text-4xl font-black text-gray-900 mb-2 countup" data-to={stat.value.replace('+', '').replace('%', '')}>
                            0
                        </div>
                        <div className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</div>
                        <div className="text-sm text-gray-500">{stat.description}</div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

const CTASection = () => (
    <section data-scroll-section className="py-20 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
                <h2 className="text-4xl md:text-5xl font-black mb-6">
                    Ready to Transform Healthcare?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join thousands of healthcare professionals already using Cipla innovations to deliver better patient outcomes.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all"
                    >
                        Request Full Report
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all"
                    >
                        Schedule Demo
                    </motion.button>
                </div>
            </motion.div>
        </div>
    </section>
);

/* ============================================
   Advanced Card Component with Stacking
   ============================================ */
const Card = ({ card, position, isTop, onSwipe, onBookmark, isBookmarked }) => {
    const x = useMotionValue(0);
    const rotateRaw = useTransform(x, [-200, 200], [-20, 20]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.7, 1, 0.7, 0]);

    const isFront = isTop;
    const rotate = useTransform(() => {
        const offset = isFront ? 0 : position % 2 ? 4 : -4;
        return `${rotateRaw.get() + offset}deg`;
    });

    const scale = useTransform(() => {
        return 1 - position * 0.05;
    });

    const y = useTransform(() => {
        return position * 15;
    });

    const handleDragEnd = (event, info) => {
        const threshold = 100;
        const velocity = info.velocity.x;

        if (Math.abs(x.get()) > threshold || Math.abs(velocity) > 500) {
            const direction = x.get() > 0 ? 1 : -1;
            onSwipe(direction);
        } else {
            // Return to center
            gsap.to(x, { value: 0, duration: 0.5, ease: "elastic.out(1,0.6)" });
        }
    };

    const statusColors = {
        'Clinical Trials': 'bg-purple-500/20 text-purple-600',
        'FDA Approved': 'bg-green-500/20 text-green-600',
        'Market Ready': 'bg-blue-500/20 text-blue-600',
        'Deployed': 'bg-amber-500/20 text-amber-600'
    };

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity,
                scale,
                y,
                zIndex: 100 - position,
            }}
            className="absolute top-0 left-0 right-0 mx-auto w-[90%] max-w-sm cursor-grab active:cursor-grabbing"
            drag={isFront ? "y" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={{
                transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
        >
            <motion.div
                className={`bg-white rounded-3xl overflow-hidden shadow-2xl border-2 ${isFront
                        ? 'border-gray-200 hover:shadow-3xl'
                        : 'border-gray-100'
                    } transition-all duration-300`}
                whileHover={isFront ? { y: -8 } : {}}
            >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                    <motion.img
                        src={card.img}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${statusColors[card.status] || 'bg-gray-500/20 text-gray-600'}`}>
                        {card.status}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onBookmark(card.id)}
                            className={`p-2 rounded-xl backdrop-blur-sm ${isBookmarked
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-white/20 text-white hover:bg-rose-500'
                                }`}
                        >
                            <BookmarkIcon className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                            {card.tag}
                        </span>
                        <h3 className="text-xl font-bold mt-2">{card.name}</h3>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {card.desc}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                        <StarRating rating={card.rating} />
                        <span className="text-sm text-gray-500">{card.reviews} reviews</span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {card.features.map((feature, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* Price & Efficacy */}
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                            {card.price}
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Efficacy</div>
                            <div className="text-lg font-bold text-green-600">{card.efficacy}</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isFront && (
                        <div className="flex gap-3 mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSwipe(-1)}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-red-500/25"
                            >
                                Not Interested
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSwipe(1)}
                                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-green-500/25"
                            >
                                Interested
                            </motion.button>
                        </div>
                    )}
                </div>

                {/* Swipe Hint */}
                {isFront && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-8">
                        <motion.div
                            animate={{ x: [-5, 0, -5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-red-500 text-sm font-semibold"
                        >
                            ← Skip
                        </motion.div>
                        <motion.div
                            animate={{ x: [5, 0, 5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-green-500 text-sm font-semibold"
                        >
                            Interested →
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

/* =========================
   Main Home Component
   ========================= */
export default function Home() {
    const [cards, setCards] = useState(PRODUCTS);
    const [history, setHistory] = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(new Set());
    const [autoPlay, setAutoPlay] = useState(false);
    const containerRef = useRef(null);
    const locoRef = useRef(null);
    const carouselRef = useRef(null);
    const autoPlayRef = useRef(null);

    // Initialize Locomotive Scroll + GSAP
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const loco = new LocomotiveScroll({
            el: container,
            smooth: true,
            lerp: 0.08,
            multiplier: 1,
            smartphone: { smooth: true },
            tablet: { smooth: true }
        });
        locoRef.current = loco;

        // GSAP ScrollTrigger integration
        ScrollTrigger.scrollerProxy(container, {
            scrollTop(value) {
                return arguments.length ? loco.scrollTo(value, { duration: 0, disableLerp: true }) : loco.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            pinType: container.style.transform ? "transform" : "fixed",
        });

        loco.on("scroll", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", () => loco.update());
        ScrollTrigger.refresh();

        // Advanced animations
        gsap.utils.toArray(".reveal").forEach((el) => {
            gsap.fromTo(el,
                { autoAlpha: 0, y: 60 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: el,
                        scroller: container,
                        start: "top 85%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Parallax elements
        gsap.utils.toArray(".parallax").forEach((el) => {
            gsap.to(el, {
                yPercent: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    scroller: container
                }
            });
        });

        // Stats count-up
        gsap.utils.toArray(".countup").forEach((el) => {
            const to = parseInt(el.dataset.to || "0", 10);
            gsap.fromTo(
                el,
                { innerText: 0 },
                {
                    innerText: to,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    onUpdate() {
                        el.innerText = Math.floor(this.targets()[0].innerText).toLocaleString();
                    },
                    scrollTrigger: {
                        trigger: el,
                        scroller: container,
                        start: "top 90%",
                        once: true
                    },
                }
            );
        });

        return () => {
            try {
                loco.destroy();
            } catch (e) { }
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    // Auto-play carousel
    useEffect(() => {
        if (!autoPlay) {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
            return;
        }

        autoPlayRef.current = setInterval(() => {
            scrollCarousel(1);
        }, 4000);

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [autoPlay]);

    // Card swipe functions
    const swipe = useCallback((dir = 1) => {
        if (cards.length === 0) return;

        const currentCard = cards[0];
        setHistory(prev => [currentCard, ...prev]);
        setCards(prev => prev.slice(1));
    }, [cards]);

    const undo = () => {
        if (history.length === 0) return;
        const [last, ...rest] = history;
        setCards(prev => [last, ...prev]);
        setHistory(rest);
    };

    const reset = () => {
        setCards(PRODUCTS);
        setHistory([]);
        setIsBookmarked(new Set());
    };

    const toggleBookmark = (id) => {
        const newBookmarked = new Set(isBookmarked);
        if (newBookmarked.has(id)) {
            newBookmarked.delete(id);
        } else {
            newBookmarked.add(id);
        }
        setIsBookmarked(newBookmarked);
    };

    const scrollCarousel = (dir = 1) => {
        const el = carouselRef.current;
        if (!el) return;

        const step = el.clientWidth * 0.8;
        const targetScroll = el.scrollLeft + (dir * step);

        gsap.to(el, {
            scrollLeft: targetScroll,
            duration: 0.8,
            ease: "power2.inOut"
        });
    };

    // Enhanced Card Component with Stacking Effect
    const CardStack = () => {
        return (
            <div className="relative h-[600px] w-full max-w-md mx-auto">
                <AnimatePresence>
                    {cards.map((card, index) => {
                        const position = index;
                        const isTop = position === 0;

                        return (
                            <Card
                                key={card.id}
                                card={card}
                                position={position}
                                isTop={isTop}
                                onSwipe={swipe}
                                onBookmark={toggleBookmark}
                                isBookmarked={isBookmarked.has(card.id)}
                            />
                        );
                    })}
                </AnimatePresence>

                {/* Empty State */}
                {cards.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-2xl font-bold mb-2">All Caught Up!</h3>
                            <p className="text-gray-600 mb-6">
                                You've reviewed all available innovations
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={reset}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-xl font-semibold"
                            >
                                Reset & Explore Again
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    };

    // Enhanced Hero Section
    const HeroSection = () => (
        <section data-scroll-section className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50" />
                <motion.div
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        className="space-y-8 reveal"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div>
                            <motion.span
                                className="inline-block px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold shadow-sm mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                🚀 Featured Innovation
                            </motion.span>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                                Transforming
                                <span className="block bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-400 bg-clip-text text-transparent">
                                    Healthcare
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 mt-6 max-w-xl leading-relaxed">
                                Discover groundbreaking pharmaceutical innovations with AI-powered insights,
                                verified practitioner reviews, and comprehensive clinical data.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-500/25 hover:shadow-3xl transition-all"
                            >
                                Explore Innovations
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-bold border border-gray-200 hover:bg-white transition-all"
                            >
                                View Clinical Data
                            </motion.button>
                        </div>

                        {/* Quick Stats */}
                        <motion.div
                            className="grid grid-cols-3 gap-6 pt-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            {[
                                { value: "50+", label: "R&D Projects" },
                                { value: "80+", label: "Countries" },
                                { value: "94%", label: "Success Rate" }
                            ].map((stat, index) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right - Card Preview */}
                    <motion.div
                        className="reveal"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="relative">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                    {PRODUCTS.slice(0, 4).map((product) => (
                                        <motion.div
                                            key={product.id}
                                            whileHover={{ y: -5 }}
                                            className="flex gap-3 items-start p-3 rounded-2xl bg-white/50 hover:bg-white transition-all"
                                        >
                                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.img}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <StarRating rating={product.rating} size={12} />
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {product.reviews} reviews
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                className="absolute -right-4 -top-4"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold">
                                    Live • Verified
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                    />
                </div>
            </motion.div>
        </section>
    );

    return (
        <div data-scroll-container ref={containerRef} className="min-h-screen bg-white text-gray-900">
            {/* Hero Section */}
            <HeroSection />

            {/* Card Stack Section */}
            <section data-scroll-section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-6 lg:px-12">
                    <motion.div
                        className="text-center mb-16 reveal"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                            Discover Innovations
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Swipe through our latest pharmaceutical innovations. Right for interested, left to skip.
                        </p>
                    </motion.div>

                    <div className="flex justify-center">
                        <CardStack />
                    </div>

                    {/* Quick Actions */}
                    {cards.length > 0 && (
                        <motion.div
                            className="flex flex-wrap gap-4 justify-center mt-12 reveal"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => swipe(-1)}
                                className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25"
                            >
                                Discard Current
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => swipe(1)}
                                className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25"
                            >
                                Shortlist Current
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={undo}
                                className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold shadow-lg shadow-gray-500/25"
                            >
                                Undo Last Action
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Reviews Section */}
            <ReviewsSection />

            {/* Stats Section */}
            <StatsSection />

            {/* CTA Section */}
            <CTASection />

            <footer className="py-12 text-center text-gray-500">
                <div className="container mx-auto px-6">
                    <p>© {new Date().getFullYear()} Cipla Pharmaceuticals — Innovating for Better Healthcare</p>
                </div>
            </footer>
        </div>
    );
}