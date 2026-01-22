"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { motion, useScroll, useTransform, easeOut, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  BookOpen, 
  CalendarDays,
  CheckCircle,
  LayoutGrid,
  HelpCircle,
  UserCircle,
  ScrollText,
  Trophy,
  Shield,
  Star,
  Clock,
  Ribbon,
  Users,
  Menu, 
  X,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuriumLandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // --- DATA: GALLERY IMAGES (From your screenshot) ---
  const galleryImages = [
    "/images/gradpics/DSC_0496.jpg",
    "/images/gradpics/DSC_0938.jpg",
    "/images/gradpics/DSC_0954.jpg",
    "/images/gradpics/DSC_0963.jpg",
    "/images/gradpics/DSC_0485.jpg",
    "/images/gradpics/DSC_0486.jpg",
    "/images/gradpics/DSC_0489.jpg",
    "/images/gradpics/DSC_0491.jpg",
  ];

  // --- DATA: EDITIONS ---
  const editions = [
    {
      year: "2025",
      theme: "Timeless White",
      desc: "Embodying purity, elegance, and the enduring nature of memories. Like a blank canvas, it reflects the clarity and simplicity of the moments that define our journey.",
      image: "/images/batch-2025.jpg", 
      overlay: "from-stone-900/10 to-stone-900/60"
    },
    {
      year: "2024",
      theme: "Vintage",
      desc: "Celebrating the enduring nature of memories. Just as vintage items become more meaningful over time, our triumphs and challenges deepen in significance as we look back.",
      image: "/images/batch-2024.jpg",
      overlay: "from-amber-900/20 to-amber-950/80"
    },
    {
      year: "2023",
      theme: "Oscars",
      desc: "Symbolizing enduring excellence. Celebrating stories that connect across generations. Teaching us that true greatness lies not only in the present but in the legacy we create.",
      image: "/images/batch-2023.jpg",
      overlay: "from-blue-900/20 to-blue-950/80"
    },
    {
      year: "2022",
      theme: "Oscars",
      desc: "Embracing the sparkling charm of the Oscars. Beyond the glitz, reflecting hard work and the constant pursuit of excellence—our journey filled with unforgettable cinematic moments.",
      image: "/images/batch-2022.jpg",
      overlay: "from-red-900/20 to-red-950/80"
    },
    {
      year: "2021",
      theme: "Sablay",
      desc: "Honoring the Filipino academic identity. The Sablay represents our nationalism and the triumph of our journey, woven with colors of honor, marking our transition to servant-leaders.",
      image: "/images/batch-2021.jpg", 
      overlay: "from-red-900/20 to-stone-900/80" 
    }
  ];

  // --- DATA: STAFF / EDITORIAL BOARD ---
  const staff = [
    { year: "2025 Board", image: "/images/staff/staff-2025.jpg", quote: "Stewards of Excellence." },
    { year: "2024 Board", image: "/images/staff/staff-2024.jpg", quote: "Capturing the vintage charm of memories." },
    { year: "2023 Board", image: "/images/staff/staff-2023.jpg", quote: "Golden standard of service." },
    { year: "2022 Board", image: "/images/staff/staff-2022.jpg", quote: "Shining light on student achievements." },
    { year: "2021 Board", image: "/images/staff/staff-2021.jpg", quote: "Laying the foundations of digital excellence." },
    { year: "2020 Board", image: "/images/staff/staff-2020.jpg", quote: "Resilience in the face of changing times." },
    { year: "2019 Board", image: "/images/staff/staff-2019.jpg", quote: "The pioneers of the modern era." }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-amber-100/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-2 md:gap-4 group z-50">
            <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 md:w-12 md:h-12 overflow-hidden hover:scale-105 transition-transform duration-300">
                   <Image src="/images/umtc-logo.png" alt="UMTC Logo" fill className="object-contain" />
                </div>
                <div className="h-6 md:h-8 w-[1px] bg-stone-300"></div>
                <div className="relative w-8 h-8 md:w-12 md:h-12 overflow-hidden hover:scale-105 transition-transform duration-300">
                   <Image src="/images/aurium-logo.png" alt="Aurium Logo" fill className="object-contain" />
                </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-serif font-bold text-amber-950 leading-none tracking-tight">AURIUM</span>
              <span className="text-[8px] md:text-[10px] text-amber-700 uppercase tracking-[0.1em] font-bold mt-1">UM Tagum College</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-600">
            <Link href="#services" className="hover:text-amber-800 hover:underline decoration-amber-400 underline-offset-4 transition-all">Services</Link>
            <Link href="#editions" className="hover:text-amber-800 hover:underline decoration-amber-400 underline-offset-4 transition-all">Editions</Link>
            <Link href="#staff" className="hover:text-amber-800 hover:underline decoration-amber-400 underline-offset-4 transition-all">The Team</Link>
            <Link href="#about" className="hover:text-amber-800 hover:underline decoration-amber-400 underline-offset-4 transition-all">About</Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-amber-900 hover:bg-amber-50 gap-2 font-medium">
                <UserCircle size={20} />
                <span className="hidden sm:inline">Portal Login</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-amber-900 hover:bg-amber-800 text-white shadow-lg shadow-amber-900/20 rounded-full px-6 transition-all hover:scale-105">
                Pre-Register
              </Button>
            </Link>
          </div>

          {/* Mobile Burger Button */}
          <div className="lg:hidden flex items-center z-50">
            <Button variant="ghost" onClick={toggleMobileMenu} className="text-amber-950 p-2">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 w-full bg-white border-b border-amber-100 shadow-xl lg:hidden flex flex-col p-6 space-y-6 z-40"
            >
              <nav className="flex flex-col space-y-4 text-center text-lg font-serif font-medium text-stone-700">
                <Link href="#services" onClick={toggleMobileMenu} className="hover:text-amber-800 py-2 border-b border-stone-100">Services</Link>
                <Link href="#editions" onClick={toggleMobileMenu} className="hover:text-amber-800 py-2 border-b border-stone-100">Editions</Link>
                <Link href="#staff" onClick={toggleMobileMenu} className="hover:text-amber-800 py-2 border-b border-stone-100">The Team</Link>
                <Link href="#about" onClick={toggleMobileMenu} className="hover:text-amber-800 py-2 border-b border-stone-100">About</Link>
              </nav>
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/register" onClick={toggleMobileMenu} className="w-full">
                  <Button className="w-full bg-amber-900 hover:bg-amber-800 text-white h-12 text-lg">
                    Pre-Register Now
                  </Button>
                </Link>
                <Link href="/login" onClick={toggleMobileMenu} className="w-full">
                  <Button variant="outline" className="w-full border-amber-200 text-amber-900 h-12 text-lg">
                    <UserCircle className="mr-2" size={20} /> Portal Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           {/* Background Blobs */}
           <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-200/20 rounded-full blur-[100px]" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-yellow-500/10 rounded-full blur-[120px]" />
           
           {/* Texture Background */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply"></div>

           {/* --- SMOOTH GRADIENT FADE --- */}
           <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-10"></div>
        </div>

        <div className="container relative z-20 px-4 md:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6 md:mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 md:gap-3 py-2 px-4 md:px-6 rounded-full bg-white/80 border border-amber-200 shadow-sm backdrop-blur-sm text-amber-900 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                The Official Yearbook of UM Tagum College
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold text-amber-950 mb-6 md:mb-8 leading-[1] tracking-tight drop-shadow-sm">
              A Timeless Work <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 italic">
                Of Art.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-stone-600 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">
              We aim to produce a yearbook edition that serves as a monument to your journey. 
              Honoring and celebrating the graduating class with excellence.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-amber-900 hover:bg-amber-800 text-white px-8 md:px-10 h-14 md:h-16 text-lg rounded-full shadow-xl shadow-amber-900/20 transition-transform hover:-translate-y-1 font-bold">
                  Start Registration
                </Button>
              </Link>
              <Link href="#editions" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-200 bg-white/50 backdrop-blur-sm text-amber-900 hover:bg-white px-8 md:px-10 h-14 md:h-16 text-lg rounded-full font-medium">
                  View Editions
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- MISSION STATEMENT --- */}
      <section id="about" className="py-16 md:py-24 bg-white border-b border-amber-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2"
            >
              <div className="inline-block mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                 <ScrollText size={32} className="text-amber-700"/>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-950 mb-6">
                The AURIUM Vision
              </h2>
              <div className="text-base md:text-lg text-stone-600 leading-relaxed space-y-4 md:space-y-6 text-justify">
                <p>
                  <strong className="text-amber-900">AURIUM</strong> stands for the <em>Ambitious United Responsive Individuals of the University of Mindanao</em>. 
                </p>
                <p>
                  With every edition, we strive to make each year memorable, honoring and celebrating the graduating class of UM Tagum College. 
                  Reflecting this vision, AURIUM consistently upholds its commitment to quality service.
                </p>
                <p>
                  By maintaining the university’s renowned standard of excellence, this dedication acts as a guiding principle for the creation of each yearbook.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2 relative"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-yellow-100 rounded-2xl transform rotate-3 blur-sm opacity-50"></div>
               <div className="relative bg-stone-900 p-8 md:p-12 rounded-2xl text-center text-white shadow-2xl border border-stone-700">
                  <div className="mb-6 flex justify-center"><Trophy size={64} className="text-yellow-400 drop-shadow-glow" /></div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">Standard of Excellence</h3>
                  <p className="text-stone-300 text-base md:text-lg italic leading-relaxed">
                    "Producing a yearbook edition that serves as a timeless work of art."
                  </p>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- EDITIONS GALLERY --- */}
      <section id="editions" className="py-16 md:py-24 bg-stone-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-950 mb-4">Our Heritage Editions</h2>
            <p className="text-stone-500 text-lg">A journey through the themes that defined our history.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {editions.map((edition, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative flex flex-col h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                {/* Image / Cover Area */}
                <div className="relative h-56 md:h-64 w-full overflow-hidden bg-stone-200">
                   <Image 
                     src={edition.image} 
                     alt={`${edition.theme} ${edition.year}`}
                     fill
                     className="object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   {/* Gradient Overlay */}
                   <div className={`absolute inset-0 bg-gradient-to-t ${edition.overlay}`}></div>
                   
                   {/* Text on top of Image */}
                   <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                     <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-widest mb-1 shadow-black/50 drop-shadow-md">{edition.year}</h3>
                     <div className="flex items-center gap-2">
                       {edition.theme.includes("Oscars") && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                       {edition.theme.includes("Vintage") && <Clock size={16} className="text-amber-200" />}
                       {edition.theme.includes("Sablay") && <Ribbon size={16} className="text-red-300" />}
                       <p className="text-xs font-sans uppercase tracking-[0.3em] font-bold opacity-90">{edition.theme}</p>
                     </div>
                   </div>
                </div>
                
                {/* Description */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                   <p className="text-stone-600 text-sm leading-relaxed mb-6">
                     {edition.desc}
                   </p>
                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                     <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Explore Batch</span>
                     <ArrowRight size={16} className="text-amber-800 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW: MOMENTS OF TRIUMPH (INFINITE GALLERY - OPTIMIZED) --- */}
      <section className="py-0 overflow-hidden bg-stone-900 border-t-4 border-b-4 border-amber-900 relative">
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-transparent to-stone-900 z-20 pointer-events-none"></div>

        <div className="py-12 md:py-16">
            <div className="container mx-auto px-6 mb-8 text-center relative z-20">
                <div className="inline-flex items-center justify-center p-3 bg-amber-900/30 rounded-full border border-amber-800/50 backdrop-blur-sm mb-4">
                    <Camera size={24} className="text-amber-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-50 tracking-tight">Moments of Triumph</h2>
                <p className="text-amber-200/60 mt-2">Capturing the joy of achievement.</p>
            </div>

            {/* Infinite Marquee Wrapper */}
            <div className="flex w-full overflow-hidden relative z-0">
                <motion.div 
                    className="flex gap-4 md:gap-6 px-4 will-change-transform"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                        repeat: Infinity, 
                        ease: "linear", 
                        duration: 30 
                    }}
                    style={{ width: "fit-content" }}
                >
                    {/* Render images twice to create seamless loop */}
                    {[...galleryImages, ...galleryImages].map((src, index) => (
                        <div 
                            key={index} 
                            className="relative w-[280px] h-[180px] md:w-[400px] md:h-[260px] shrink-0 rounded-lg overflow-hidden border-2 border-stone-800 shadow-2xl hover:border-amber-700 hover:scale-105 transition-all duration-300"
                        >
                            <Image 
                                src={src} 
                                alt={`Graduation Moment ${index}`} 
                                fill 
                                sizes="(max-width: 768px) 280px, 400px"
                                className="object-cover transition-all duration-500" 
                            />
                            {/* Film Grain/Vignette Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
      </section>

      {/* --- STAFF / EDITORIAL BOARD SECTION (Full 2019-2025) --- */}
      <section id="staff" className="py-16 md:py-24 bg-amber-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex justify-center mb-4">
               <Users size={32} className="text-amber-300" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-50 mb-4">The Team Behind the Legacy</h2>
            <p className="text-amber-200/80 text-lg">The dedicated individuals who craft the AURIUM masterpiece.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {staff.map((team, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="bg-amber-950/50 p-4 rounded-2xl border border-amber-800/50 backdrop-blur-sm hover:border-amber-500/50 transition-colors"
               >
                 <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 shadow-2xl">
                    <Image 
                      src={team.image} 
                      alt={team.year} 
                      fill 
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                 </div>
                 <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-100 mb-2">{team.year}</h3>
                 <p className="text-amber-200/60 text-sm italic">"{team.quote}"</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* --- GRADUATE SERVICES GRID --- */}
      <section id="services" className="py-16 md:py-24 bg-white relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-950 mb-4">Graduate Services</h2>
            <p className="text-stone-500 max-w-lg mx-auto text-lg">Everything you need to prepare for graduation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Card 1: Pre-Registration */}
            <motion.div whileHover={{ y: -5 }} className="p-6 md:p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 mb-6 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                <UserCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Pre-Registration</h3>
              <p className="text-stone-500 mb-6 text-sm leading-relaxed">Create your profile, submit your details, and initialize your yearbook entry.</p>
              <Link href="/register" className="text-amber-700 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Register Now <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 2: Pictorial Schedule */}
            <motion.div id="schedule" whileHover={{ y: -5 }} className="p-6 md:p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 mb-6 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                <CalendarDays size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Pictorial Schedule</h3>
              <p className="text-stone-500 mb-6 text-sm leading-relaxed">Book your slot for the official creative and toga photoshoot.</p>
              <Link href="/schedule" className="text-amber-700 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                View Calendar <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 3: FAQ (Replaced Endorsed Graduates) */}
            <motion.div id="faq" whileHover={{ y: -5 }} className="p-6 md:p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 mb-6 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">FAQ</h3>
              <p className="text-stone-500 mb-6 text-sm leading-relaxed">Got questions? Find answers to common queries about the yearbook process and services.</p>
              <Link href="/faq" className="text-amber-700 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                View FAQs <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 4: Digital Yearbook */}
            <motion.div id="yearbook" whileHover={{ y: -5 }} className="p-6 md:p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 mb-6 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">The Yearbook</h3>
              <p className="text-stone-500 mb-6 text-sm leading-relaxed">Access the digital archives of previous batches and preview the current edition.</p>
              <Link href="#" className="text-amber-700 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Browse Archives <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 5: Other Services */}
            <motion.div whileHover={{ y: -5 }} className="p-6 md:p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 mb-6 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                <LayoutGrid size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Other Services</h3>
              <p className="text-stone-500 mb-6 text-sm leading-relaxed">Hard copy orders, photo retouching requests, and editorial services.</p>
              <Link href="#" className="text-amber-700 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                View All <ArrowRight size={16} />
              </Link>
            </motion.div>

             {/* Card 6: Help & Support */}
             <Link href="/support" className="block h-full"> 
               <motion.div whileHover={{ y: -5 }} className="p-6 md:p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 transition-all group h-full">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 mb-6 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                   <HelpCircle size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-stone-800 mb-3">Help & Support</h3>
                 <p className="text-stone-500 mb-6 text-sm leading-relaxed">Having trouble with your account? Contact our support team for assistance.</p>
                 <div className="text-amber-700 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                   Get Help <ArrowRight size={16} />
                 </div>
               </motion.div>
             </Link>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                {/* Footer Logo Area */}
                <div className="relative w-10 h-10 grayscale opacity-80">
                   {/* Ensure filename is aurium-logo.png */}
                   <Image src="/images/aurium-logo.png" alt="Aurium" fill className="object-contain" />
                </div>
                <span className="text-2xl font-serif font-bold text-stone-200 tracking-wide">AURIUM</span>
              </div>
              <p className="text-stone-500 leading-relaxed max-w-sm text-sm">
                The official yearbook and alumni tracking system of UM Tagum College. <br/>
                Ambitious. United. Responsive.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-stone-200 mb-6 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-4 text-stone-500 text-sm">
                <li><Link href="#yearbook" className="hover:text-amber-500 transition-colors">Browse Yearbook</Link></li>
                <li><Link href="#faq" className="hover:text-amber-500 transition-colors">FAQ</Link></li>
                <li><Link href="/login" className="hover:text-amber-500 transition-colors">Graduate Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-stone-200 mb-6 uppercase tracking-widest text-xs">Legal & Support</h4>
              <ul className="space-y-4 text-stone-500 text-sm">
                <li><Link href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-amber-500 transition-colors">Terms of Service</Link></li>
                <li><Link href="/support" className="hover:text-amber-500 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
            <p>&copy; 2026 AURIUM Yearbook Committee. All rights reserved.</p>
            <p>Designed with <span className="text-amber-900">♥</span> for the students of UMTC.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}