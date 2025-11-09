import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
    const [isDark, setIsDark] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const scrollContainerRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const teamCardsRef = useRef([]);
    const locomotiveScrollRef = useRef(null);

    // Touch/swipe state
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Team cards data for swipe section
    const teamCards = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            role: "Chief Research Officer",
            description: "Leading innovation in pharmaceutical research with 15+ years of experience",
            achievement: "50+ Patents",
            color: "from-blue-500 to-cyan-400"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Global Operations Director",
            description: "Managing worldwide distribution and supply chain operations",
            achievement: "80+ Countries",
            color: "from-green-500 to-emerald-400"
        },
        {
            id: 3,
            name: "Dr. Elena Rodriguez",
            role: "Head of Clinical Trials",
            description: "Overseeing patient-centric clinical research and development",
            achievement: "200+ Trials",
            color: "from-purple-500 to-pink-400"
        },
        {
            id: 4,
            name: "James Wilson",
            role: "Digital Health Lead",
            description: "Pioneering digital solutions for healthcare accessibility",
            achievement: "10M+ Users",
            color: "from-orange-500 to-red-400"
        },
        {
            id: 5,
            name: "Dr. Aisha Patel",
            role: "Quality Assurance Director",
            description: "Ensuring highest standards in pharmaceutical manufacturing",
            achievement: "99.9% Quality",
            color: "from-indigo-500 to-purple-400"
        },
        {
            id: 6,
            name: "Robert Kim",
            role: "Sustainability Officer",
            description: "Driving eco-friendly initiatives across all operations",
            achievement: "Carbon Neutral",
            color: "from-teal-500 to-green-400"
        },
        {
            id: 7,
            name: "Dr. Maria Schmidt",
            role: "Medical Affairs Director",
            description: "Bridging research with practical healthcare solutions",
            achievement: "1000+ Partnerships",
            color: "from-rose-500 to-orange-400"
        },
        {
            id: 8,
            name: "David Zhang",
            role: "Technology Innovation Head",
            description: "Implementing cutting-edge tech in pharmaceutical processes",
            achievement: "AI Integration",
            color: "from-amber-500 to-yellow-400"
        },
        {
            id: 9,
            name: "Dr. Lisa Thompson",
            role: "Patient Advocacy Lead",
            description: "Ensuring patient voices shape our innovations",
            achievement: "1M+ Feedback",
            color: "from-sky-500 to-blue-400"
        },
        {
            id: 10,
            name: "Alexandre Dubois",
            role: "International Relations",
            description: "Building global healthcare partnerships and collaborations",
            achievement: "150+ Partners",
            color: "from-violet-500 to-purple-400"
        }
    ];

    // Check for mobile device and dark mode
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        checkMobile();
        checkDarkMode();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initialize Locomotive Scroll and GSAP animations
    useEffect(() => {
        if (!scrollContainerRef.current) return;

        // Dynamically import Locomotive Scroll to avoid SSR issues
        import('locomotive-scroll').then((LocomotiveScroll) => {
            // Initialize Locomotive Scroll
            locomotiveScrollRef.current = new LocomotiveScroll.default({
                el: scrollContainerRef.current,
                smooth: true,
                multiplier: isMobile ? 1.2 : 1,
                class: 'is-revealed',
                smartphone: {
                    smooth: !isMobile
                },
                tablet: {
                    smooth: true
                }
            });

            // Update ScrollTrigger when Locomotive Scroll updates
            locomotiveScrollRef.current.on('scroll', ScrollTrigger.update);

            // Connect GSAP ScrollTrigger with Locomotive Scroll
            ScrollTrigger.scrollerProxy(scrollContainerRef.current, {
                scrollTop(value) {
                    if (locomotiveScrollRef.current) {
                        return arguments.length ?
                            locomotiveScrollRef.current.scrollTo(value, { duration: 0, disableLerp: true }) :
                            locomotiveScrollRef.current.scroll.instance.scroll.y;
                    }
                    return 0;
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                },
                pinType: scrollContainerRef.current.style.transform ? "transform" : "fixed"
            });

            ScrollTrigger.addEventListener('refresh', () => {
                if (locomotiveScrollRef.current) {
                    locomotiveScrollRef.current.update();
                }
            });
            ScrollTrigger.refresh();
        });

        // GSAP animations
        const ctx = gsap.context(() => {
            // Hero section animation
            gsap.from(".hero-title", {
                scrollTrigger: {
                    trigger: ".hero-title",
                    scroller: scrollContainerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 1.2,
                y: 100,
                opacity: 0,
                ease: "power3.out"
            });

            gsap.from(".hero-text", {
                scrollTrigger: {
                    trigger: ".hero-text",
                    scroller: scrollContainerRef.current,
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 1,
                y: 50,
                opacity: 0,
                delay: 0.3,
                ease: "power2.out"
            });

            // Mission & Vision cards animation
            gsap.from(".mission-card", {
                scrollTrigger: {
                    trigger: ".mission-card",
                    scroller: scrollContainerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 1,
                y: 60,
                opacity: 0,
                stagger: 0.2,
                ease: "back.out(1.2)"
            });

            // Features animation
            gsap.from(".feature-card", {
                scrollTrigger: {
                    trigger: ".feature-cards-container",
                    scroller: scrollContainerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 0.8,
                scale: 0.8,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out"
            });

            // Timeline animation - different for mobile
            gsap.from(".timeline-item", {
                scrollTrigger: {
                    trigger: ".timeline-container",
                    scroller: scrollContainerRef.current,
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 1,
                x: isMobile ? 0 : (index) => (index % 2 === 0 ? -100 : 100),
                y: isMobile ? 50 : 0,
                opacity: 0,
                stagger: 0.2,
                ease: "power2.out"
            });

            // Team stats animation
            gsap.from(".team-stats", {
                scrollTrigger: {
                    trigger: ".team-stats",
                    scroller: scrollContainerRef.current,
                    start: "top 90%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 1,
                y: 50,
                opacity: 0,
                ease: "bounce.out"
            });

        }, scrollContainerRef);

        // Cleanup
        return () => {
            if (locomotiveScrollRef.current) {
                locomotiveScrollRef.current.destroy();
            }
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            ctx.revert();
        };
    }, [isMobile]);

    // Tinder-style swipe animations setup
    useEffect(() => {
        if (teamCardsRef.current.length === 0) return;

        // Initial card stack setup
        teamCardsRef.current.forEach((card, index) => {
            if (card) {
                const scale = isMobile ?
                    (1 - (index * 0.03)) :
                    (1 - (index * 0.05));
                const yOffset = isMobile ?
                    (index * -2) :
                    (index * -4);

                gsap.set(card, {
                    x: 0,
                    y: yOffset,
                    scale: scale,
                    rotation: index % 2 === 0 ? index * 0.3 : index * -0.3,
                    zIndex: teamCards.length - index,
                    opacity: index === 0 ? 1 : 0.9 - (index * 0.1)
                });
            }
        });
    }, [isMobile]);

    // Mouse event handlers for desktop drag
    const handleMouseDown = (e) => {
        if (isAnimating || currentCardIndex >= teamCards.length) return;
        setIsDragging(true);
        setDragOffset({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || isAnimating || currentCardIndex >= teamCards.length) return;

        const currentCard = teamCardsRef.current[currentCardIndex];
        if (currentCard) {
            const deltaX = e.clientX - dragOffset.x;
            const rotation = deltaX * 0.1;

            gsap.to(currentCard, {
                x: deltaX,
                rotation: rotation,
                duration: 0.1,
                ease: "power1.out"
            });
        }
    };

    const handleMouseUp = (e) => {
        if (!isDragging || isAnimating || currentCardIndex >= teamCards.length) return;

        const currentCard = teamCardsRef.current[currentCardIndex];
        if (currentCard) {
            const deltaX = e.clientX - dragOffset.x;
            const isLeftSwipe = deltaX < -50;
            const isRightSwipe = deltaX > 50;

            if (isLeftSwipe || isRightSwipe) {
                swipeCard(isRightSwipe ? 'right' : 'left');
            } else {
                // Reset card position if drag wasn't significant
                gsap.to(currentCard, {
                    x: 0,
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }

        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        if (isAnimating || currentCardIndex >= teamCards.length) return;
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (isAnimating || currentCardIndex >= teamCards.length || !touchStart) return;
        setTouchEnd(e.targetTouches[0].clientX);

        // Real-time card movement during swipe
        const currentCard = teamCardsRef.current[currentCardIndex];
        if (currentCard) {
            const deltaX = e.targetTouches[0].clientX - touchStart;
            const rotation = deltaX * 0.1;

            gsap.to(currentCard, {
                x: deltaX,
                rotation: rotation,
                duration: 0.1,
                ease: "power1.out"
            });
        }
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd || isAnimating || currentCardIndex >= teamCards.length) return;

        const distance = touchEnd - touchStart;
        const isLeftSwipe = distance < -50;
        const isRightSwipe = distance > 50;

        if (isLeftSwipe || isRightSwipe) {
            swipeCard(isRightSwipe ? 'right' : 'left');
        } else {
            // Reset card position if swipe wasn't significant
            const currentCard = teamCardsRef.current[currentCardIndex];
            if (currentCard) {
                gsap.to(currentCard, {
                    x: 0,
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    const swipeCard = (direction) => {
        if (isAnimating || currentCardIndex >= teamCards.length) return;

        setIsAnimating(true);
        const currentCard = teamCardsRef.current[currentCardIndex];

        if (currentCard) {
            const swipeDistance = isMobile ?
                (direction === 'right' ? 300 : -300) :
                (direction === 'right' ? 500 : -500);

            // Add a little vertical movement for more natural feel
            const swipeY = Math.random() * 20 - 10;

            gsap.to(currentCard, {
                x: swipeDistance,
                y: swipeY,
                rotation: direction === 'right' ? 15 : -15,
                opacity: 0,
                scale: 0.8,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    setCurrentCardIndex(prev => prev + 1);
                    setIsAnimating(false);
                }
            });

            // Animate next card to top position
            if (currentCardIndex + 1 < teamCards.length) {
                const nextCard = teamCardsRef.current[currentCardIndex + 1];
                gsap.to(nextCard, {
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 0.3,
                    delay: 0.1,
                    ease: "power2.out"
                });
            }
        }
    };

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
        <div
            ref={scrollContainerRef}
            className="min-h-screen py-4 md:py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
            data-scroll-container
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Reset if mouse leaves container
        >
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12 md:mb-16 hero-section"
            >
                <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r -orange-400 to-pink-500 bg-clip-text text-transparent">
                    About Cipla
                </h1>
                <p className={`hero-text text-lg sm:text-xl max-w-3xl mx-auto ${isDark ? "text-white/80" : "text-gray-700"
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
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16"
            >
                <div className={`mission-card p-6 md:p-8 rounded-xl md:rounded-2xl backdrop-blur-sm border ${isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white/60 border-gray-200"
                    }`}>
                    <div className="text-3xl md:text-4xl mb-3 md:mb-4">🎯</div>
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 ${isDark ? "text-white" : "text-gray-900"
                        }`}>
                        Our Mission
                    </h3>
                    <p className={`text-sm md:text-base ${isDark ? "text-white/70" : "text-gray-600"}`}>
                        To be a leading global healthcare company using technology and innovation
                        to meet everyday needs of all patients.
                    </p>
                </div>

                <div className={`mission-card p-6 md:p-8 rounded-xl md:rounded-2xl backdrop-blur-sm border ${isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white/60 border-gray-200"
                    }`}>
                    <div className="text-3xl md:text-4xl mb-3 md:mb-4">👁️</div>
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 ${isDark ? "text-white" : "text-gray-900"
                        }`}>
                        Our Vision
                    </h3>
                    <p className={`text-sm md:text-base ${isDark ? "text-white/70" : "text-gray-600"}`}>
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
                className="mb-12 md:mb-16"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose Cipla?</h2>
                <div className="feature-cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="feature-card"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`p-4 md:p-6 rounded-xl md:rounded-2xl text-center backdrop-blur-sm border ${isDark
                                        ? "bg-white/5 border-white/10"
                                        : "bg-white/60 border-gray-200"
                                    }`}
                            >
                                <div className="text-2xl md:text-3xl mb-3 md:mb-4">{feature.icon}</div>
                                <h3 className={`text-base md:text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"
                                    }`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-xs md:text-sm ${isDark ? "text-white/70" : "text-gray-600"
                                    }`}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Timeline */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-12 md:mb-16 timeline-container"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Journey</h2>
                <div className="relative">
                    {/* Timeline line */}
                    <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full ${isDark ? "bg-white/20" : "bg-gray-300"
                        }`}></div>

                    {milestones.map((milestone, index) => (
                        <div key={milestone.year} className="timeline-item">
                            <motion.div
                                initial={{ opacity: 0, x: isMobile ? 50 : (index % 2 === 0 ? -50 : 50) }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className={`flex items-center mb-8 ${isMobile ? "flex-row" : (index % 2 === 0 ? "flex-row" : "flex-row-reverse")
                                    }`}
                            >
                                <div className={`${isMobile ? "w-full pl-12" : "w-1/2 p-4"} ${!isMobile && (index % 2 === 0 ? "text-right pr-8" : "text-left pl-8")
                                    }`}>
                                    <div className={`inline-block p-4 rounded-xl md:rounded-2xl backdrop-blur-sm border ${isDark
                                            ? "bg-white/5 border-white/10"
                                            : "bg-white/60 border-gray-200"
                                        }`}>
                                        <div className={`text-xl md:text-2xl font-bold mb-2 ${isDark ? "text-yellow-300" : "text-pink-600"
                                            }`}>
                                            {milestone.year}
                                        </div>
                                        <div className={`text-sm md:text-base ${isDark ? "text-white/80" : "text-gray-700"}`}>
                                            {milestone.event}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline dot */}
                                <div className={`absolute left-4 md:left-1/2 transform -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full z-10 ${isDark
                                        ? "bg-gradient-to-r from-orange-500 to-yellow-400"
                                        : "bg-gradient-to-r from-orange-400 to-pink-500"
                                    }`}></div>

                                {!isMobile && <div className="w-1/2"></div>}
                            </motion.div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Tinder-style Team Cards Section */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Meet Our Leadership</h2>
                <p className={`text-center mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base ${isDark ? "text-white/70" : "text-gray-600"
                    }`}>
                    {isMobile ? "Swipe cards left or right to explore" : "Click and drag cards to explore our team"}
                </p>

                <div className="relative h-80 sm:h-96 md:h-[500px] max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                    {/* Cards Container with visual swipe cues */}
                    <div ref={cardsContainerRef} className="relative w-full h-full">
                        {/* Swipe direction indicators */}
                        {currentCardIndex < teamCards.length && (
                            <>
                                <div className={`absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 flex items-center space-x-1 ${isDark ? 'text-red-400' : 'text-red-500'
                                    }`}>
                                    <span className="text-lg">←</span>
                                    <span className="text-xs font-semibold">SKIP</span>
                                </div>
                                <div className={`absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 flex items-center space-x-1 ${isDark ? 'text-green-400' : 'text-green-500'
                                    }`}>
                                    <span className="text-xs font-semibold">LEARN</span>
                                    <span className="text-lg">→</span>
                                </div>
                            </>
                        )}

                        {teamCards.map((card, index) => (
                            <div
                                key={card.id}
                                ref={el => teamCardsRef.current[index] = el}
                                className={`absolute top-0 left-0 w-full h-full rounded-xl md:rounded-2xl p-4 md:p-6 cursor-grab active:cursor-grabbing select-none ${isDark ? 'bg-gray-800' : 'bg-white'
                                    } shadow-2xl md:shadow-3xl border-2 ${isDark ? 'border-white/20' : 'border-gray-300'
                                    } transition-all duration-200 ${isDragging && index === currentCardIndex ? 'cursor-grabbing shadow-3xl' : ''
                                    }`}
                                style={{
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    MozUserSelect: 'none',
                                    msUserSelect: 'none',
                                    // Perfect stacking - all cards in same position
                                    transform: 'translateX(0) translateY(0)'
                                }}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={handleMouseDown}
                            >
                                {/* Card number indicator */}
                                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'
                                    } shadow-lg`}>
                                    {index + 1}
                                </div>

                                <div className={`w-full h-20 md:h-32 rounded-lg md:rounded-xl mb-4 md:mb-6 bg-gradient-to-r ${card.color} relative overflow-hidden`}>
                                    {/* Subtle pattern to make it look like a card */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10"></div>
                                </div>

                                <h3 className={`text-lg md:text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"
                                    }`}>
                                    {card.name}
                                </h3>
                                <p className={`text-base md:text-lg font-semibold mb-2 md:mb-3 ${isDark ? "text-yellow-300" : "text-pink-600"
                                    }`}>
                                    {card.role}
                                </p>
                                <p className={`text-sm md:text-base mb-3 md:mb-4 ${isDark ? "text-white/80" : "text-gray-600"
                                    }`}>
                                    {card.description}
                                </p>
                                <div className={`inline-flex items-center px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium ${isDark ? "bg-white/10 text-white/90" : "bg-gray-100 text-gray-700"
                                    }`}>
                                    {card.achievement}
                                </div>

                                {/* Swipe hint on current card */}
                                {index === currentCardIndex && currentCardIndex < teamCards.length && (
                                    <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 ${isDark ? 'text-white/60' : 'text-gray-500'
                                        } text-xs`}>
                                        <span className="flex items-center space-x-1">
                                            <span className="text-red-400">←</span>
                                            <span>Swipe left</span>
                                        </span>
                                        <span className="text-white/40">|</span>
                                        <span className="flex items-center space-x-1">
                                            <span>Swipe right</span>
                                            <span className="text-green-400">→</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Swipe Buttons */}
                    {currentCardIndex < teamCards.length && (
                        <div className="absolute -bottom-4 md:bottom-4 left-0 right-0 flex justify-center gap-4 md:gap-8">
                            <motion.button
                                onClick={() => swipeCard('left')}
                                disabled={isAnimating}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-4 md:p-5 rounded-full shadow-xl text-sm md:text-base flex items-center space-x-2 ${isDark
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-red-500 hover:bg-red-600'
                                    } text-white transition-all duration-200 disabled:opacity-50`}
                            >
                                <span className="text-lg">←</span>
                                <span className="font-semibold">Skip</span>
                            </motion.button>

                            <motion.button
                                onClick={() => swipeCard('right')}
                                disabled={isAnimating}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-4 md:p-5 rounded-full shadow-xl text-sm md:text-base flex items-center space-x-2 ${isDark
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                    } text-white transition-all duration-200 disabled:opacity-50`}
                            >
                                <span className="font-semibold">Learn More</span>
                                <span className="text-lg">→</span>
                            </motion.button>
                        </div>
                    )}

                    {/* Enhanced Completion Message */}
                    {currentCardIndex >= teamCards.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`text-center p-8 md:p-10 rounded-2xl md:rounded-3xl backdrop-blur-sm ${isDark ? 'bg-white/10 border border-white/20' : 'bg-white/80 border border-gray-200'
                                } shadow-2xl`}
                        >
                            <div className="text-4xl mb-4">🎉</div>
                            <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"
                                }`}>
                                Exploration Complete!
                            </h3>
                            <p className={`text-base md:text-lg mb-6 ${isDark ? "text-white/70" : "text-gray-600"}`}>
                                You've discovered all our leadership team members.
                            </p>
                            <motion.button
                                onClick={() => {
                                    setCurrentCardIndex(0);
                                    teamCardsRef.current.forEach((card, index) => {
                                        if (card) {
                                            const scale = 1 - (index * 0.05);
                                            gsap.set(card, {
                                                x: 0,
                                                y: 0,
                                                scale: scale,
                                                rotation: 0,
                                                zIndex: teamCards.length - index,
                                                opacity: index === 0 ? 1 : 0.8 - (index * 0.1)
                                            });
                                        }
                                    });
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg ${isDark
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                    } shadow-lg hover:shadow-xl transition-all duration-300`}
                            >
                                Explore Again
                            </motion.button>
                        </motion.div>
                    )}
                </div>

                {/* Enhanced Progress Indicator */}
                <div className="flex justify-center mt-8 md:mt-12">
                    <div className={`flex items-center space-x-4 p-3 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-gray-100'
                        }`}>
                        <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                            {currentCardIndex} of {teamCards.length}
                        </span>
                        <div className="flex gap-1">
                            {teamCards.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index < currentCardIndex
                                            ? (isDark ? 'bg-green-400' : 'bg-green-500')
                                            : (isDark ? 'bg-white/30' : 'bg-gray-300')
                                        } ${index === currentCardIndex ? 'scale-125' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* Team Stats Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className={`team-stats p-6 md:p-8 rounded-xl md:rounded-2xl backdrop-blur-sm border text-center ${isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white/60 border-gray-200"
                    }`}
            >
                <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Leadership & Innovation</h2>
                <p className={`text-base md:text-lg mb-4 md:mb-6 max-w-2xl mx-auto ${isDark ? "text-white/80" : "text-gray-700"
                    }`}>
                    Our team of 10,000+ professionals worldwide is committed to excellence
                    in pharmaceutical research and patient care.
                </p>
                <div className={`inline-flex flex-col sm:flex-row gap-3 md:gap-4 p-2 rounded-xl ${isDark ? "bg-white/10" : "bg-gray-100"
                    }`}>
                    <span className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-sm md:text-base ${isDark
                            ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-black"
                            : "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                        }`}>
                        10,000+ Employees
                    </span>
                    <span className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-sm md:text-base ${isDark ? "text-white/80" : "text-gray-700"
                        }`}>
                        25+ Manufacturing Sites
                    </span>
                </div>
            </motion.section>
        </div>
    );
}