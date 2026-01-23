"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Quote, 
  GraduationCap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- MOCK DATA (Ideally, this comes from your database) ---
const STUDENT_DATA = {
  name: "Juan Dela Cruz",
  idNumber: "2022-00123",
  // Using standard Pinterest image
  photoUrl: "https://i.pinimg.com/736x/09/7b/2d/097b2d53634008344447550541004724.jpg", 
  
  details: {
    personal: {
      fname: "Juan",
      mname: "Santos",
      lname: "Dela Cruz",
      suffix: "Jr.",
      nickname: "Juanny",
      birthdate: "January 1, 2000",
    },
    address: {
      full: "Apokon, Tagum City, Davao del Norte"
    },
    academic: {
      course: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
      major: "Data Science",
      thesis: "Development of an AI-Powered Yearbook Layout System using Genetic Algorithms",
      email: "juan.delacruz@gmail.com",
      contact: "09123456789"
    },
    family: {
      father: "Mr. Pedro Santos Dela Cruz",
      mother: "Mrs. Maria Santos Dela Cruz",
    }
  }
};

export default function YearbookPreviewPage() {
  const { details } = STUDENT_DATA;

  return (
    <div className="min-h-screen bg-[#2a1a10] text-amber-50 font-sans selection:bg-amber-500/30">
      
      {/* FLOATING BACK BUTTON */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/student/dashboard">
          <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* FLOATING BADGE */}
      <div className="fixed top-4 right-4 z-50">
         <Badge className="bg-amber-600 hover:bg-amber-600 text-white border-none shadow-lg">DRAFT PREVIEW</Badge>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      {/* Desktop: Grid with 2 Columns (40% / 60%). Mobile: Flex Column */}
      <div className="w-full min-h-screen lg:h-screen flex flex-col lg:flex-row">
        
        {/* --- LEFT: PHOTO SECTION (40% width on Desktop) --- */}
        <div className="w-full lg:w-[40%] bg-stone-100 relative flex items-center justify-center p-8 lg:p-12 order-1">
            {/* White Frame Effect */}
            <div className="bg-white p-4 shadow-2xl rotate-1 w-full max-w-md mx-auto relative">
                {/* Image Container with fixed aspect ratio */}
                <div className="aspect-[3/4] w-full bg-stone-200 relative overflow-hidden">
                   <img 
                     src={STUDENT_DATA.photoUrl} 
                     alt="Graduation Portrait" 
                     className="w-full h-full object-cover" 
                   />
                </div>
                {/* Name Tag on Photo */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#2a1a10] text-white px-6 py-2 shadow-lg">
                   <span className="text-xl font-serif font-bold tracking-widest">{details.personal.lname}</span>
                </div>
            </div>

            {/* Pattern Overlay on Left Side */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-multiply"></div>
        </div>

        {/* --- RIGHT: DETAILS SECTION (60% width on Desktop) --- */}
        <div className="w-full lg:w-[60%] bg-[#3f2e22] relative flex flex-col justify-center p-8 md:p-16 lg:p-20 order-2 overflow-y-auto">
            {/* Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leather.png')" }}></div>

            <div className="relative z-10 max-w-3xl mx-auto w-full">
                
                {/* HEADER */}
                <div className="border-b border-amber-500/30 pb-8 mb-8">
                   <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-2 tracking-tight">
                     {details.personal.lname},
                   </h1>
                   <div className="flex flex-wrap items-baseline gap-3 text-2xl md:text-4xl text-amber-100/80 font-serif">
                      <span>{details.personal.fname}</span>
                      <span>{details.personal.mname.charAt(0)}.</span>
                      <span className="italic text-amber-500">"{details.personal.nickname}"</span>
                   </div>
                   <div className="mt-6 flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-amber-500" />
                      <p className="text-sm font-bold tracking-[0.2em] uppercase text-amber-200">
                        {details.academic.course}
                      </p>
                   </div>
                   {details.academic.major !== "N/A" && (
                       <p className="text-xs tracking-widest uppercase text-amber-500/60 mt-1 pl-8">{details.academic.major}</p>
                   )}
                </div>

                {/* CONTENT GRID */}
                <div className="flex flex-col md:flex-row gap-10">
                   
                   {/* THEME PHOTO BOX (Placeholder) */}
                   <div className="hidden md:block w-48 shrink-0">
                      <div className="aspect-[3/4] bg-white/5 border border-white/10 p-2 relative group cursor-not-allowed">
                         <div className="w-full h-full bg-[#2a1a10] flex flex-col items-center justify-center text-center p-4">
                            <span className="text-[10px] uppercase tracking-widest text-amber-500/50">Theme Photo Slot</span>
                         </div>
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                      </div>
                   </div>

                   {/* DETAILS TEXT */}
                   <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 text-sm font-light text-amber-100/80">
                      
                      <div className="space-y-6">
                         <div>
                            <h4 className="font-bold text-amber-500 text-[10px] uppercase tracking-widest mb-1">Birthdate</h4>
                            <p className="text-base text-white">{details.personal.birthdate}</p>
                         </div>
                         <div>
                            <h4 className="font-bold text-amber-500 text-[10px] uppercase tracking-widest mb-1">Hometown</h4>
                            <div className="flex items-start gap-2">
                               <MapPin className="w-3 h-3 mt-1 shrink-0 text-amber-500" />
                               <p>{details.address.full}</p>
                            </div>
                         </div>
                         <div>
                            <h4 className="font-bold text-amber-500 text-[10px] uppercase tracking-widest mb-1">Contact</h4>
                            <div className="space-y-1">
                               <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {details.academic.contact}</p>
                               <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {details.academic.email}</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div>
                            <h4 className="font-bold text-amber-500 text-[10px] uppercase tracking-widest mb-1">Parents</h4>
                            <div className="space-y-1">
                               <p>{details.family.father}</p>
                               <p>{details.family.mother}</p>
                            </div>
                         </div>
                         <div>
                            <h4 className="font-bold text-amber-500 text-[10px] uppercase tracking-widest mb-2">Thesis Title</h4>
                            <div className="relative pl-4 border-l-2 border-amber-500">
                               <Quote className="w-3 h-3 text-amber-500 absolute -top-2 -left-[5px] bg-[#3f2e22]" />
                               <p className="italic text-white leading-relaxed">
                                  "{details.academic.thesis}"
                               </p>
                            </div>
                         </div>
                      </div>

                   </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}