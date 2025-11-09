import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import { motion } from 'framer-motion';

const Home = () => {
  const smoothScrollRef = useRef(null);
  const locoScrollRef = useRef(null);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    console.clear();

    // Initialize Locomotive Scroll
    const locoScroll = new LocomotiveScroll({
      el: smoothScrollRef.current,
      smooth: true,
      multiplier: 1,
      smartphone: { smooth: true },
      tablet: { smooth: true }
    });

    locoScrollRef.current = locoScroll;

    // Sync Locomotive Scroll with ScrollTrigger
    locoScroll.on("scroll", ScrollTrigger.update);

    // ScrollTrigger proxy configuration
    ScrollTrigger.scrollerProxy(smoothScrollRef.current, {
      scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: smoothScrollRef.current.style.transform ? "transform" : "fixed"
    });

    // Section pinning animation
    const sections = gsap.utils.toArray('section');
    sections.forEach((section) => {
      ScrollTrigger.create({
        scroller: '.smooth-scroll',
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false
      });
    });

    // Initialize all custom animations
    initializeAllAnimations();

    // Refresh handlers
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
      locoScroll.update();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (locoScrollRef.current) {
        locoScrollRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const initializeAllAnimations = () => {
    // Molecule animations
    initializeMoleculeAnimation();
    // Card animations
    initializeCardAnimations();
    // Stacked cards
    initializeStackedCards();
    // Lab equipment
    initializeLabEquipmentAnimation();
    // Pill path
    initializePillPathAnimation();
    // Research cards
    initializeResearchCards();
    // Medical stats
    initializeMedicalStats();
    // Clinical progress
    initializeClinicalProgress();
    // Drug interactions
    initializeDrugInteractions();
    // Panel animations
    initializePanelAnimations();
  };

  const initializeMoleculeAnimation = () => {
    const molecules = gsap.utils.toArray('.molecule');
    molecules.forEach((molecule) => {
      const atoms = molecule.querySelectorAll('.atom');
      const bonds = molecule.querySelectorAll('.bond');
      
      gsap.to(atoms, {
        scale: 1.2,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut"
      });
      
      gsap.to(bonds, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });
    });
  };

  const initializeCardAnimations = () => {
    const start = 'top top+=900';
    
    ['card-1', 'card-2', 'card-3'].forEach((cardClass, index) => {
      const yPercent = [311, 208, 105][index];
      const scale = [0.94, 0.96, 0.98][index];
      
      gsap.to(`.${cardClass}`, {
        scrollTrigger: {
          trigger: '.cards',
          scroller: smoothScrollRef.current,
          start: start,
          end: () => `+=${document.querySelector('.cards')?.offsetHeight - 500 || 1000}`,
          scrub: true,
        },
        yPercent: yPercent,
        scale: scale,
      });
    });
  };

  const initializeStackedCards = () => {
    const cardWrappers = gsap.utils.toArray(".card-wrapper");
    if (cardWrappers.length === 0) return;

    const scaleMax = gsap.utils.mapRange(1, cardWrappers.length - 1, 0.8, 1);
    const time = 2;

    gsap.set(cardWrappers, {
      y: (index) => 30 * index,
      transformOrigin: "center top",
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".trigger",
        scroller: smoothScrollRef.current,
        start: "top top",
        end: `${window.innerHeight * 5} top`,
        scrub: true,
      }
    });

    tl.from('.card-container', {
      y: () => window.innerHeight / 2,
      duration: 1,
    });

    tl.from(".card-wrapper:not(:first-child)", {
      y: () => window.innerHeight,
      duration: time / 2,
      stagger: time
    });

    tl.to(
      ".card-wrapper:not(:last-child)",
      {
        rotationX: -20,
        scale: (index) => scaleMax(index),
        stagger: { each: time }
      },
      "<"
    );
  };

  const initializeLabEquipmentAnimation = () => {
    const equipment = gsap.utils.toArray('.lab-equipment');
    equipment.forEach((item, index) => {
      gsap.fromTo(item, 
        {
          y: 100,
          opacity: 0,
          rotation: index % 2 === 0 ? -5 : 5
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: item,
            scroller: smoothScrollRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true
          }
        }
      );
    });
  };

  const initializePillPathAnimation = () => {
    const paths = document.querySelectorAll('.pill-path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
      
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: path,
          scroller: smoothScrollRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true
        }
      });
    });
  };

  const initializeResearchCards = () => {
    const cards = gsap.utils.toArray('.research-card');
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          rotationY: 15
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            scroller: smoothScrollRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  };

  const initializeMedicalStats = () => {
    const counters = gsap.utils.toArray('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      
      ScrollTrigger.create({
        trigger: counter,
        scroller: smoothScrollRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(counter, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: "power2.out",
            onUpdate: function() {
              const value = Math.ceil(this.targets()[0].innerText);
              counter.innerText = value.toLocaleString();
            }
          });
        }
      });
    });
  };

  const initializeClinicalProgress = () => {
    const progressBars = gsap.utils.toArray('.progress-bar');
    progressBars.forEach((bar) => {
      const width = bar.getAttribute('data-width') || '0';
      gsap.to(bar, {
        width: `${width}%`,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: bar,
          scroller: smoothScrollRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    });
  };

  const initializeDrugInteractions = () => {
    const interactions = gsap.utils.toArray('.interaction-item');
    interactions.forEach((item, index) => {
      gsap.fromTo(item,
        {
          scale: 0.8,
          opacity: 0,
          rotationY: 90
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: item,
            scroller: smoothScrollRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  };

  const initializePanelAnimations = () => {
    gsap.to(".medical-panel", {
      yPercent: -100,
      ease: "none",
      stagger: 0.5,
      scrollTrigger: {
        trigger: "#medical-container",
        scroller: smoothScrollRef.current,
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true
      }
    });

    gsap.set(".medical-panel", { 
      zIndex: (i, target, targets) => targets.length - i 
    });

    gsap.to('#text-fade', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.medical-panel.blue',
        scroller: smoothScrollRef.current,
        start: 'bottom -100',
        end: 'bottom -200',
        scrub: true,
      }
    });
  };

  return (
    <div 
      ref={smoothScrollRef} 
      className="smooth-scroll min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden"
      data-scroll-container
    >
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-blue-900 to-teal-800">
        <MoleculeStructure />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-900/20 to-blue-900/40" />
        
        <div className="text-center text-white z-10 px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
              <span className="block">HEALTHCARE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200 mt-4">
                INNOVATION
              </span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 opacity-90 font-light max-w-4xl mx-auto leading-relaxed">
              Advancing medicine through cutting-edge research and pharmaceutical excellence
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 md:px-12 py-3 md:py-4 rounded-full text-lg transition-all duration-300 shadow-2xl"
            >
              Discover Our Research
            </motion.button>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-white/70 text-sm">Scroll to Explore</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { number: 125, suffix: '+', label: 'Research Projects', color: 'from-blue-500 to-cyan-500' },
              { number: 50, suffix: '+', label: 'Clinical Trials', color: 'from-green-500 to-emerald-500' },
              { number: 1000000, suffix: '+', label: 'Patients Helped', color: 'from-purple-500 to-indigo-500' },
              { number: 25, suffix: '+', label: 'Countries Served', color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`bg-gradient-to-r ${stat.color} text-white rounded-2xl p-4 md:p-8 shadow-lg`}>
                  <div className="stat-number text-2xl md:text-4xl lg:text-5xl font-bold" data-target={stat.number}>
                    0
                  </div>
                  <div className="text-lg md:text-2xl font-semibold">{stat.suffix}</div>
                  <div className="text-white/90 text-xs md:text-sm mt-2">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards min-h-screen flex items-center justify-center relative bg-gradient-to-br from-blue-900 to-teal-800">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Solutions</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Innovative pharmaceutical products with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                title: "Advanced Delivery", 
                description: "Innovative systems for maximum efficacy",
                gradient: "from-cyan-500 to-blue-600"
              },
              { 
                title: "Precision Medicine", 
                description: "Tailored treatments based on genetics",
                gradient: "from-purple-500 to-pink-600"
              },
              { 
                title: "Clinical Excellence", 
                description: "Evidence-based medical solutions",
                gradient: "from-orange-500 to-red-600"
              }
            ].map((card, index) => (
              <div 
                key={index}
                className={`card-${index + 1} group relative overflow-hidden rounded-3xl p-6 md:p-8 backdrop-blur-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl md:text-2xl">💊</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{card.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stacked Cards Section */}
        <section className="trigger min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900/30 rounded-4xl">
            <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12 md:mb-20">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 pt-10">
                Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">Pipeline</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Comprehensive drug development from research to market
                </p>
            </div>
            
            <div className="card-container relative h-[400px] md:h-[600px] flex items-center justify-center">
                {[1, 2, 3].map((item) => (
                <div key={item} className="card-wrapper absolute">
                    <div className="card bg-gradient-to-br from-green-500 to-cyan-600 rounded-3xl p-6 md:p-8 shadow-2xl w-72 md:w-80 lg:w-96 transform-gpu">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 md:mb-6">
                        <span className="text-white text-base md:text-lg font-bold">{item}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                        {item === 1 ? 'Research & Discovery' : item === 2 ? 'Clinical Development' : 'Market Access'}
                    </h3>
                    <p className="text-white/90 leading-relaxed text-sm md:text-base">
                        {item === 1 ? 'Advanced research methodologies' : 
                        item === 2 ? 'Rigorous clinical trials' : 
                        'Regulatory approval strategies'}
                    </p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

      {/* Research Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm md:text-lg tracking-wider">RESEARCH & DEVELOPMENT</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6">
                Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Breakthroughs</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                Innovative treatments addressing unmet medical needs worldwide.
              </p>
              
              <div className="space-y-4">
                {[
                  'Advanced Drug Discovery',
                  'Clinical Trial Management',
                  'Regulatory Compliance',
                  'Patient Safety Monitoring'
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-gray-800 font-medium text-sm md:text-base">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="lab-equipment space-y-4 md:space-y-6">
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-blue-100">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <span className="text-xl md:text-2xl">🔬</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Laboratory Research</h3>
                  <p className="text-gray-600 text-sm md:text-base">State-of-the-art molecular research</p>
                </div>
                
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-green-100">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <span className="text-xl md:text-2xl">💊</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Drug Formulation</h3>
                  <p className="text-gray-600 text-sm md:text-base">Advanced development techniques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Portfolio</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Innovative medications for various conditions with maximum efficacy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                category: "Cardiology",
                name: "CardioProtect Plus",
                description: "Advanced cardiovascular protection",
                status: "Phase III",
                color: "from-red-500 to-pink-500"
              },
              {
                category: "Oncology",
                name: "OncoTarget Therapy",
                description: "Precision cancer treatment",
                status: "FDA Approved",
                color: "from-purple-500 to-indigo-500"
              },
              {
                category: "Neurology",
                name: "NeuroEnhance Formula",
                description: "Neurological disorders treatment",
                status: "Phase II",
                color: "from-blue-500 to-cyan-500"
              }
            ].map((product, index) => (
              <div 
                key={index}
                className="research-card group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r ${product.color} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-xl md:text-2xl">💊</span>
                </div>
                <div className="mb-4">
                  <span className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">{product.category}</span>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-2">{product.name}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4 md:mb-6">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${
                    product.status.includes('Approved') ? 'bg-green-100 text-green-800' :
                    product.status.includes('Phase') ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-xs md:text-sm flex items-center space-x-1">
                    <span>Learn More</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-teal-800">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
            Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">Process</span>
          </h2>
          
          <div className="relative">
            <svg className="w-full h-24 md:h-32" viewBox="0 0 800 200">
              <path
                className="pill-path stroke-cyan-400 stroke-2 fill-none"
                d="M 50,100 Q 200,50 350,100 T 650,100"
                strokeWidth="4"
              />
              
              {[
                { x: 50, y: 100, step: "Research", icon: "🔍" },
                { x: 200, y: 50, step: "Discovery", icon: "💡" },
                { x: 350, y: 100, step: "Testing", icon: "🧪" },
                { x: 500, y: 150, step: "Trials", icon: "👥" },
                { x: 650, y: 100, step: "Approval", icon: "✅" }
              ].map((node, index) => (
                <g key={index}>
                  <circle cx={node.x} cy={node.y} r="16" fill="#06b6d4" className="animate-pulse" />
                  <text x={node.x} y={node.y} textAnchor="middle" dy="4" fill="white" fontSize="10">
                    {node.icon}
                  </text>
                  <text x={node.x} y={node.y + 30} textAnchor="middle" fill="#cbd5e1" fontSize="8">
                    {node.step}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Clinical Trials Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm md:text-lg tracking-wider">CLINICAL DEVELOPMENT</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6">
                Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Research</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                Ensuring safety and efficacy through rigorous clinical trials.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: "👥", text: "Patient-Centric Design" },
                  { icon: "📊", text: "Evidence Collection" },
                  { icon: "🛡️", text: "Ethical Practices" },
                  { icon: "🌍", text: "Global Locations" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg md:text-xl">{item.icon}</span>
                    </div>
                    <span className="text-gray-800 font-medium text-sm md:text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <ClinicalTrialsProgress />
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <PharmaSupportCard
            tag="/ MEDICAL SUPPORT"
            text={
              <>
                <strong>Healthcare professionals and patients:</strong> Access comprehensive 
                information about medications and support resources.
              </>
            }
            examples={[
              "What are the side effects?",
              "How should this drug be stored?",
              "Any drug interactions?",
              "Where to find clinical data?",
            ]}
          />
        </div>
      </section>

      {/* Medical Panels Section */}
      <section id="medical-container" className="relative min-h-screen">
        {[
          { 
            bg: "from-blue-600 to-cyan-600", 
            title: "Patient Safety",
            subtitle: "Rigorous testing and quality",
            icon: "🛡️"
          },
          { 
            bg: "from-green-600 to-emerald-600", 
            title: "Research Excellence",
            subtitle: "Innovating for better health",
            icon: "🔬"
          },
          { 
            bg: "from-purple-600 to-indigo-600", 
            title: "Global Impact",
            subtitle: "Accessible healthcare worldwide",
            icon: "🌍"
          },
          { 
            bg: "from-red-600 to-pink-600", 
            title: "Your Partner",
            subtitle: "Committed to improving lives",
            icon: "❤️"
          }
        ].map((panel, index) => (
          <div key={index} className={`medical-panel h-screen flex items-center justify-center bg-gradient-to-br ${panel.bg} relative overflow-hidden`}>
            <div className="text-center text-white px-4 max-w-4xl mx-auto">
              <div className="text-4xl md:text-6xl mb-6 md:mb-8">{panel.icon}</div>
              <motion.h2 
                className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {panel.title}
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl opacity-90"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {panel.subtitle}
              </motion.p>

              {index === 1 && (
                <div id="text-fade" className="absolute bottom-8 md:bottom-20 text-white text-lg md:text-xl font-light">
                  Scroll to discover more
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Final CTA Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10" />
        <div className="text-center text-white px-4 relative z-10 max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            Advancing <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200">Healthcare</span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 opacity-90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Join us in developing life-changing treatments
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 font-semibold px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl"
            >
              Contact Our Team
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white font-semibold px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              View Clinical Trials
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Supporting Components
const MoleculeStructure = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {[1, 2, 3, 4].map((group) => (
        <div key={group} className={`molecule absolute ${getRandomPosition()}`}>
          <div className="atom absolute w-3 h-3 md:w-4 md:h-4 bg-cyan-400 rounded-full animate-pulse" />
          {[0, 120, 240].map((angle, i) => (
            <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2">
              <div 
                className="bond w-12 h-1 md:w-16 md:h-1 bg-cyan-300 rounded-full origin-left"
                style={{ transform: `rotate(${angle}deg)` }}
              />
              <div 
                className="atom w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full absolute top-1/2 left-12 md:left-16 transform -translate-y-1/2"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const getRandomPosition = () => {
  const positions = [
    'top-10 left-10',
    'top-20 right-20',
    'bottom-20 left-1/4',   
    'bottom-10 right-1/3',
  ];
  return positions[Math.floor(Math.random() * positions.length)];
};

const ClinicalTrialsProgress = () => {
  const phases = [
    { phase: "Phase I", progress: 100, status: "Completed", color: "from-green-500 to-emerald-500" },
    { phase: "Phase II", progress: 85, status: "In Progress", color: "from-blue-500 to-cyan-500" },
    { phase: "Phase III", progress: 60, status: "Recruiting", color: "from-purple-500 to-indigo-500" },
    { phase: "Phase IV", progress: 30, status: "Planning", color: "from-orange-500 to-amber-500" }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Clinical Trials Progress</h3>
      <div className="space-y-4 md:space-y-6">
        {phases.map((phase, index) => (
          <motion.div 
            key={phase.phase}
            className="space-y-2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700 text-sm md:text-base">{phase.phase}</span>
              <span className="text-xs md:text-sm text-gray-500">{phase.status}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
              <motion.div 
                className={`h-2 md:h-3 rounded-full bg-gradient-to-r ${phase.color} progress-bar`}
                data-width={phase.progress}
                initial={{ width: 0 }}
                whileInView={{ width: `${phase.progress}%` }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              />
            </div>
            <div className="text-right text-xs md:text-sm text-gray-600">{phase.progress}% Complete</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PharmaSupportCard = ({ tag, text, examples }) => {
  return (
    <div className="w-full max-w-4xl md:max-w-6xl mx-auto space-y-6 md:space-y-8 p-6 md:p-12 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 shadow-2xl">
      <div>
        <p className="mb-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-blue-600">{tag}</p>
        <hr className="border-blue-200" />
      </div>
      <p className="max-w-4xl text-lg md:text-2xl leading-relaxed text-gray-800 font-light">{text}</p>
      <div>
        <PharmaTypewrite examples={examples} />
        <hr className="border-blue-200" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 py-3 md:py-4 px-6 md:px-8 text-base md:text-lg font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 shadow-xl flex items-center justify-center space-x-2"
        >
          <span>Contact Medical Info</span>
          <span>📞</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full border-2 border-blue-600 text-blue-600 py-3 md:py-4 px-6 md:px-8 text-base md:text-lg font-semibold transition-all duration-300 hover:bg-blue-600 hover:text-white flex items-center justify-center space-x-2"
        >
          <span>Download Info</span>
          <span>📄</span>
        </motion.button>
      </div>
    </div>
  );
};

const PharmaTypewrite = ({ examples }) => {
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setExampleIndex((pv) => (pv + 1) % examples.length);
    }, 5500);
    return () => clearInterval(intervalId);
  }, [examples.length]);

  return (
    <p className="mb-4 text-sm md:text-base font-medium uppercase text-blue-600">
      <span className="inline-block size-2 md:size-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-pulse" />
      <span className="ml-3 md:ml-4 tracking-wide text-xs md:text-base">
        FREQUENT QUESTIONS:{" "}
        <span className="text-gray-900 font-semibold">
          {examples[exampleIndex].split("").map((l, i) => (
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{
                delay: 5,
                duration: 0.25,
                ease: "easeInOut",
              }}
              key={`${exampleIndex}-${i}`}
              className="relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: i * 0.025,
                  duration: 0,
                }}
              >
                {l}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  delay: i * 0.025,
                  times: [0, 0.1, 1],
                  duration: 0.125,
                  ease: "easeInOut",
                }}
                className="absolute bottom-[2px] left-[1px] right-0 top-[2px] bg-gradient-to-r from-blue-600 to-cyan-600"
              />
            </motion.span>
          ))}
        </span>
      </span>
    </p>
  );
};

export default Home ;