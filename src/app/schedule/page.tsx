"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Camera,
  Shirt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// --- MOCK DATA ---
const courses = [
  "ALL COURSES",
  "Bachelor of Science in Accountancy",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Criminology",
  "Bachelor of Elementary Education",
  "Bachelor of Science in Computer Science",
  "Bachelor of Science in Civil Engineering"
];

const schedules = [
  {
    id: 1,
    date: "Oct 25, 2025",
    day: "Saturday",
    time: "8:00 AM - 12:00 PM",
    course: "Bachelor of Science in Accountancy",
    slots: 5,
    status: "Available",
    type: "Toga & Creative"
  },
  {
    id: 2,
    date: "Oct 25, 2025",
    day: "Saturday",
    time: "1:00 PM - 5:00 PM",
    course: "Bachelor of Science in Accountancy",
    slots: 0,
    status: "Full",
    type: "Toga & Creative"
  },
  {
    id: 3,
    date: "Oct 26, 2025",
    day: "Sunday",
    time: "8:00 AM - 5:00 PM",
    course: "Bachelor of Science in Criminology",
    slots: 20,
    status: "Available",
    type: "Toga Only"
  },
  {
    id: 4,
    date: "Oct 27, 2025",
    day: "Monday",
    time: "8:00 AM - 12:00 PM",
    course: "Bachelor of Elementary Education",
    slots: 12,
    status: "Available",
    type: "Creative Only"
  },
  {
    id: 5,
    date: "Oct 28, 2025",
    day: "Tuesday",
    time: "8:00 AM - 5:00 PM",
    course: "Bachelor of Science in Computer Science",
    slots: 8,
    status: "Selling Out",
    type: "Toga & Creative"
  }
];

export default function SchedulePage() {
  const [selectedCourse, setSelectedCourse] = useState("ALL COURSES");

  // Filter Logic
  const filteredSchedules = schedules.filter(item => 
    selectedCourse === "ALL COURSES" ? true : item.course === selectedCourse
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* --- HEADER --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-amber-100/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden">
                   <Image src="/images/umtc-logo.png" alt="UMTC" fill className="object-contain"/>
                </div>
                <div className="h-6 w-[1px] bg-stone-300"></div>
                <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden">
                   <Image src="/images/aurium-logo.png" alt="Aurium" fill className="object-contain"/>
                </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-serif font-bold text-amber-950 leading-none">AURIUM</span>
              <span className="text-[10px] text-amber-700 uppercase tracking-widest font-bold">Pictorials</span>
            </div>
          </Link>
          
          <div className="flex gap-2">
            <Link href="/">
                <Button variant="ghost" className="hidden md:flex">Home</Button>
            </Link>
            <Link href="/login">
                <Button className="bg-amber-900 hover:bg-amber-800 text-white">Login to Book</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER --- */}
      <header className="bg-amber-900 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Pictorial Schedule</h1>
          <p className="text-amber-100 max-w-xl mx-auto text-lg">
            Find your department's designated schedule and secure your slot for the official AURIUM 2025 photoshoot.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT COLUMN: FILTERS & SCHEDULE --- */}
          <div className="flex-1 space-y-6">
            
            {/* Filter Card */}
            <Card className="border-t-4 border-amber-600 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="text-amber-600" size={20}/> 
                  Filter Schedules
                </CardTitle>
                <CardDescription>Select your course to see assigned dates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course, index) => (
                      <SelectItem key={index} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Results List */}
            <div className="space-y-4">
              <h3 className="font-bold text-amber-950 text-lg flex items-center gap-2">
                <Calendar size={20}/> Available Slots
              </h3>
              
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`overflow-hidden hover:shadow-lg transition-shadow border-l-4 ${item.status === "Full" ? "border-l-stone-400 opacity-80" : "border-l-green-500"}`}>
                      <div className="flex flex-col md:flex-row">
                        {/* Date Box */}
                        <div className="bg-stone-100 p-6 flex flex-col items-center justify-center min-w-[120px] text-center border-b md:border-b-0 md:border-r border-stone-200">
                           <span className="text-xs font-bold uppercase text-stone-500">{item.day}</span>
                           <span className="text-2xl font-serif font-bold text-amber-900 leading-none my-1">{item.date.split(' ')[1].replace(',','')}</span>
                           <span className="text-sm font-medium text-amber-700">{item.date.split(' ')[0]}</span>
                        </div>

                        {/* Details */}
                        <div className="p-6 flex-1">
                           <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                              <Badge variant="outline" className="text-amber-900 border-amber-200 bg-amber-50">
                                {item.type}
                              </Badge>
                              <StatusBadge status={item.status} />
                           </div>
                           <h4 className="font-bold text-lg text-stone-800 mb-1">{item.course}</h4>
                           <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
                              <span className="flex items-center gap-1"><Clock size={14}/> {item.time}</span>
                              <span className="flex items-center gap-1"><MapPin size={14}/> UMTC Auditorium</span>
                           </div>
                           
                           <div className="flex items-center justify-between mt-auto">
                              <span className="text-xs font-medium text-stone-400">
                                {item.status === "Full" ? "No slots left" : `${item.slots} slots remaining`}
                              </span>
                              <Button 
                                disabled={item.status === "Full"}
                                className={`h-9 ${item.status === "Full" ? "bg-stone-200 text-stone-400" : "bg-amber-900 hover:bg-amber-800"}`}
                              >
                                {item.status === "Full" ? "Closed" : "Book Slot"}
                              </Button>
                           </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-stone-300">
                  <p className="text-stone-500">No schedules found for this course yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT COLUMN: GUIDELINES --- */}
          <div className="lg:w-1/3 space-y-6">
            
            {/* Guidelines Card */}
            <Card className="bg-white shadow-md">
              <CardHeader className="bg-amber-50 border-b border-amber-100">
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <AlertCircle size={20} /> Important Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                <div className="space-y-2">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-stone-800">
                    <Shirt size={16} className="text-amber-600"/> Attire Requirements
                  </h4>
                  <ul className="text-sm text-stone-600 space-y-2 list-disc pl-5">
                    <li><strong>Ladies:</strong> Tube or Spaghetti strap inner wear (Skin tone/Black) for Toga.</li>
                    <li><strong>Gentlemen:</strong> White polo shirt or Long sleeves with necktie.</li>
                    <li><strong>Creative:</strong> Follow your department's specific theme.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-stone-800">
                    <Camera size={16} className="text-amber-600"/> Package Inclusions
                  </h4>
                  <ul className="text-sm text-stone-600 space-y-2 list-disc pl-5">
                    <li>1 pc. 8R Portrait (Toga/Filipiniana)</li>
                    <li>2 pcs. 2R Wallet Size</li>
                    <li>Digital Soft Copy (Sent via Portal)</li>
                    <li>Hair and Make-up Retouch</li>
                  </ul>
                </div>

                <div className="bg-stone-100 p-4 rounded-lg text-xs text-stone-500">
                  <strong>Note:</strong> Please arrive 30 minutes before your scheduled time slot. Late comers will be moved to the waiting list.
                </div>

              </CardContent>
            </Card>

            {/* Need Help? */}
            <Card className="bg-stone-900 text-white">
              <CardContent className="p-6 text-center">
                <h4 className="font-serif font-bold text-lg mb-2">Can't find your schedule?</h4>
                <p className="text-stone-400 text-sm mb-4">
                  If your department is not listed or if you missed your slot, please contact the yearbook committee immediately.
                </p>
                <Button variant="outline" className="border-stone-600 text-amber-500 hover:bg-stone-800 w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-stone-200 py-8 text-center text-xs text-stone-400">
        <p>© 2026 AURIUM Yearbook Committee. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Helper component for badges
function StatusBadge({ status }: { status: string }) {
  let styles = "bg-gray-100 text-gray-600";
  if (status === "Available") styles = "bg-green-100 text-green-700 hover:bg-green-100";
  if (status === "Selling Out") styles = "bg-orange-100 text-orange-700 hover:bg-orange-100";
  if (status === "Full") styles = "bg-red-100 text-red-700 hover:bg-red-100";

  return (
    <Badge className={`${styles} border-0`}>
      {status === "Available" && <CheckCircle2 size={12} className="mr-1"/>}
      {status}
    </Badge>
  );
}