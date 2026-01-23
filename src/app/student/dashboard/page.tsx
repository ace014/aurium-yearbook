"use client";

import { useState, useMemo } from "react";
import Link from "next/link"; 
import { 
  UserCircle, 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  QrCode,
  Info,
  MapPin,
  Users,
  GraduationCap,
  Mail,
  Phone,
  Quote,
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// We keep Image import for the logo
import Image from "next/image"; 
import { Label } from "@/components/ui/label";

// --- TYPES ---
interface Student {
  name: string; 
  idNumber: string;
  photoUrl: string;
  status: string;
  
  details: {
    personal: {
      fname: string;
      mname: string;
      lname: string;
      suffix: string;
      nickname: string;
      birthdate: string;
    };
    address: {
      province: string;
      city: string;
      barangay: string;
    };
    academic: {
      course: string;
      major: string;
      thesisTitle: string; 
      umEmail: string;
      personalEmail: string;
      contactNum: string;
    };
    family: {
      useGuardian: boolean;
      father: string; 
      mother: string; 
      guardian?: string;
      guardianRelation?: string;
    };
  };

  booking: {
    date: string;
    time: string; // 'AM' or 'PM'
  } | null;
}

interface ScheduleSlot {
  date: string;
  label: string;
  amCapacity: number;
  amBooked: number;
  pmCapacity: number;
  pmBooked: number;
}

// --- MOCK DATA ---
const STUDENT_DATA: Student = {
  name: "Juan Dela Cruz",
  idNumber: "2022-00123",
  photoUrl: "https://i.pinimg.com/736x/09/7b/2d/097b2d53634008344447550541004724.jpg", 
  status: "verified",
  
  details: {
    personal: {
      fname: "Juan",
      mname: "Santos",
      lname: "Dela Cruz",
      suffix: "Jr.",
      nickname: "Juanny",
      birthdate: "2000-01-01"
    },
    address: {
      province: "Davao del Norte",
      city: "Tagum City",
      barangay: "Apokon"
    },
    academic: {
      course: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
      major: "Data Science",
      thesisTitle: "Development of an AI-Powered Yearbook Layout System using Genetic Algorithms", 
      umEmail: "202000123.tc@umindanao.edu.ph",
      personalEmail: "juan.delacruz@gmail.com",
      contactNum: "09123456789"
    },
    family: {
      useGuardian: false,
      father: "Mr. Pedro Santos Dela Cruz",
      mother: "Mrs. Maria Santos Dela Cruz",
      guardian: "",
      guardianRelation: ""
    }
  },
  
  booking: null 
};

// Available Slots
const AVAILABLE_SLOTS: ScheduleSlot[] = [
  { date: "2026-03-15", label: "March 15 (Mon)", amCapacity: 50, amBooked: 45, pmCapacity: 50, pmBooked: 10 },
  { date: "2026-03-16", label: "March 16 (Tue)", amCapacity: 50, amBooked: 50, pmCapacity: 50, pmBooked: 2 },
];

export default function StudentDashboard() {
  const [user, setUser] = useState<Student>(STUDENT_DATA);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // Selection State
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSession, setSelectedSession] = useState<"AM" | "PM" | "">("");

  // Handlers
  const handleSelectSlot = (date: string, session: "AM" | "PM", isFull: boolean) => {
    if (isFull) return; 
    setSelectedDate(date);
    setSelectedSession(session);
  };

  const handleFinalizeBooking = () => {
    if (!selectedDate || !selectedSession) return;
    setUser({ ...user, booking: { date: selectedDate, time: selectedSession } });
    setIsConfirmDialogOpen(false);
    setIsBookingModalOpen(false);
  };

  // --- 1. SAFE NAME GENERATOR ---
  const fullName = useMemo(() => {
    const p = user.details?.personal;
    if (!p) return "Loading...";
    return [p.fname, p.mname, p.lname, p.suffix].filter(Boolean).join(" ");
  }, [user]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      
      {/* --- HEADER --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-amber-100/50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden">
                   <Image src="/images/umtc-logo.png" alt="UMTC Logo" fill className="object-contain"/>
                </div>
                <div className="h-6 w-[1px] bg-stone-300"></div>
                <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden">
                   <Image src="/images/aurium-logo.png" alt="Aurium Logo" fill className="object-contain"/>
                </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-serif font-bold text-amber-950 leading-none tracking-tight">AURIUM</span>
              <span className="text-[8px] md:text-[10px] text-amber-700 uppercase tracking-[0.1em] font-bold mt-0.5">Student Portal</span>
            </div>
          </Link>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-stone-700 leading-none">Hi, {user.details.personal.fname}</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider">{user.idNumber}</p>
            </div>
            <Avatar className="h-9 w-9 border border-amber-200">
                <AvatarImage src={user.photoUrl} />
                <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* DASHBOARD TITLE */}
        <header className="md:flex justify-between items-end pb-6 border-b border-stone-200">
            <div>
                <h1 className="text-3xl font-serif font-bold text-stone-800">Student Dashboard</h1>
                <p className="text-stone-500 mt-2">Welcome to the official University of Mindanao Yearbook Portal.</p>
            </div>
            {user.status === 'verified' ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-sm border-green-200 gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified Graduate
                </Badge>
            ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 gap-1">
                    <Clock className="w-3 h-3" /> Verification Pending
                </Badge>
            )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* --- 1. PROFILE CARD --- */}
            <Card className="md:col-span-1 border-t-4 border-t-amber-900 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-stone-700">
                        <UserCircle className="w-5 h-5 text-amber-700" /> Yearbook Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                            <AvatarImage src={user.photoUrl} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-stone-100 text-stone-300">JD</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm border border-stone-100">
                             <CheckCircle className="w-6 h-6 text-blue-500 fill-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-stone-800 font-serif">{fullName}</h3>
                        <p className="text-sm font-medium text-amber-700 mt-1">{user.idNumber}</p>
                        <p className="text-xs text-stone-500 mt-2 leading-relaxed px-4">{user.details.academic.course}</p>
                    </div>

                    {/* --- UPDATED: BUTTON LINKS TO CORRECT NESTED PAGE --- */}
                    <Link href="/student/dashboard/yearbook-preview" className="w-full">
                        <Button variant="outline" className="w-full text-xs border-amber-200 text-amber-900 hover:bg-amber-50 hover:text-amber-900">
                            <Info className="w-3 h-3 mr-2" /> Check Yearbook Entry
                        </Button>
                    </Link>

                </CardContent>
            </Card>

            {/* --- 2. PICTORIAL SCHEDULE CARD --- */}
            <Card className="md:col-span-2 shadow-sm border-stone-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-stone-700">
                        <Calendar className="w-5 h-5 text-amber-700" /> Pictorial Schedule
                    </CardTitle>
                    <CardDescription>Select a date for your official yearbook photoshoot.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[200px] flex items-center justify-center">
                    
                    {user.booking ? (
                        // CONFIRMED TICKET VIEW
                        <div className="w-full bg-stone-50 border border-stone-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-600 hover:bg-green-600">CONFIRMED</Badge>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pictorial Pass</p>
                                </div>
                                <h3 className="text-2xl font-bold text-stone-800 mt-2">
                                    {new Date(user.booking.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', weekday: 'long' })}
                                </h3>
                                <p className="text-stone-600 font-medium">
                                    {user.booking.time === 'AM' ? '☀️ Morning Session (8AM - 12PM)' : '🌙 Afternoon Session (1PM - 5PM)'}
                                </p>
                                <p className="text-xs text-stone-400 italic mt-2">Show the QR code to the staff upon entry.</p>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
                                <QrCode className="w-20 h-20 text-stone-900" />
                                <span className="text-[10px] font-mono text-stone-400">{user.idNumber}</span>
                            </div>
                        </div>
                    ) : (
                        // BOOKING VIEW
                        <div className="text-center space-y-4 py-6">
                             <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-amber-600" />
                             </div>
                             <div>
                                 <h3 className="font-bold text-stone-700">No Schedule Selected</h3>
                                 <p className="text-sm text-stone-500 max-w-xs mx-auto">Slots are filling up fast. Book now to secure your spot.</p>
                             </div>
                             
                             <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-amber-900 hover:bg-amber-800">Book a Slot Now</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Select Pictorial Schedule</DialogTitle>
                                        <DialogDescription>Choose a session. Capacity is limited.</DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                        {AVAILABLE_SLOTS.map((slot, idx) => (
                                            <div key={idx} className="border rounded-lg p-4 space-y-3 bg-stone-50/50">
                                                <h4 className="font-bold text-stone-700">{slot.label}</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* AM Slot */}
                                                    <button 
                                                        onClick={() => handleSelectSlot(slot.date, "AM", slot.amBooked >= slot.amCapacity)}
                                                        disabled={slot.amBooked >= slot.amCapacity}
                                                        className={`relative border rounded-lg p-3 text-left transition-all ${selectedDate === slot.date && selectedSession === "AM" ? 'ring-2 ring-amber-600 border-amber-600 bg-amber-50' : 'hover:border-amber-300 bg-white'} ${slot.amBooked >= slot.amCapacity ? 'opacity-50 cursor-not-allowed bg-stone-100' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-bold text-sm text-stone-700">Morning (AM)</span>
                                                            {selectedDate === slot.date && selectedSession === "AM" && <CheckCircle className="w-4 h-4 text-amber-600"/>}
                                                        </div>
                                                        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                                                            <div className={`h-full ${slot.amBooked >= slot.amCapacity ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${(slot.amBooked / slot.amCapacity) * 100}%` }} />
                                                        </div>
                                                        <span className="text-[10px] text-stone-500 mt-1 block">{slot.amBooked}/{slot.amCapacity} Taken</span>
                                                    </button>
                                                    {/* PM Slot */}
                                                    <button 
                                                        onClick={() => handleSelectSlot(slot.date, "PM", slot.pmBooked >= slot.pmCapacity)}
                                                        disabled={slot.pmBooked >= slot.pmCapacity}
                                                        className={`relative border rounded-lg p-3 text-left transition-all ${selectedDate === slot.date && selectedSession === "PM" ? 'ring-2 ring-amber-600 border-amber-600 bg-amber-50' : 'hover:border-amber-300 bg-white'} ${slot.pmBooked >= slot.pmCapacity ? 'opacity-50 cursor-not-allowed bg-stone-100' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-bold text-sm text-stone-700">Afternoon (PM)</span>
                                                            {selectedDate === slot.date && selectedSession === "PM" && <CheckCircle className="w-4 h-4 text-amber-600"/>}
                                                        </div>
                                                        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                                                            <div className={`h-full ${slot.pmBooked >= slot.pmCapacity ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(slot.pmBooked / slot.pmCapacity) * 100}%` }} />
                                                        </div>
                                                        <span className="text-[10px] text-stone-500 mt-1 block">{slot.pmBooked}/{slot.pmCapacity} Taken</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <DialogFooter className="flex-col sm:justify-between gap-2 border-t pt-4">
                                        <div className="text-xs text-stone-500 text-center sm:text-left">
                                            {selectedDate ? <span>Selected: <strong>{selectedDate} ({selectedSession})</strong></span> : "Please select a slot"}
                                        </div>
                                        <Button onClick={() => setIsConfirmDialogOpen(true)} disabled={!selectedDate || !selectedSession} className="bg-amber-900 w-full sm:w-auto">Submit Schedule</Button>
                                    </DialogFooter>
                                </DialogContent>
                             </Dialog>

                             {/* FINAL CONFIRMATION DIALOG */}
                             <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-5 h-5" /> Final Confirmation</DialogTitle>
                                        <DialogDescription className="pt-2">You are about to book: <br/><span className="font-bold text-stone-800 block mt-1 text-lg">{selectedDate} • {selectedSession === 'AM' ? 'Morning' : 'Afternoon'}</span></DialogDescription>
                                    </DialogHeader>
                                    <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-xs text-amber-800">
                                        <strong>Warning:</strong> Once confirmed, this schedule is <u>locked</u>.
                                    </div>
                                    <DialogFooter className="gap-2">
                                        <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleFinalizeBooking} className="bg-red-600 hover:bg-red-700 text-white">Yes, Finalize Schedule</Button>
                                    </DialogFooter>
                                </DialogContent>
                             </Dialog>

                        </div>
                    )}
                </CardContent>
            </Card>

            {/* DIGITAL YEARBOOK */}
            <Card className="md:col-span-3 bg-gradient-to-r from-stone-900 to-stone-800 text-stone-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3"></div>
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="space-y-4 flex-1 text-center md:text-left">
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30">COMING SOON</Badge>
                        <h2 className="text-3xl font-serif font-bold text-white">The 2026 Digital Yearbook</h2>
                        <p className="text-stone-400 max-w-lg">Experience the memories of your batch in our interactive digital yearbook.</p>
                        <Button variant="outline" className="border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white" disabled>
                            <BookOpen className="mr-2 w-4 h-4" /> View Yearbook (Locked)
                        </Button>
                    </div>
                    <div className="w-40 h-56 bg-amber-900/50 rounded-lg border border-amber-700/50 shadow-2xl flex items-center justify-center backdrop-blur-sm -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-not-allowed">
                        <div className="text-center"><div className="text-amber-500 font-serif font-bold text-xl tracking-widest">AURIUM</div><div className="text-amber-700 text-xs uppercase mt-1">2026 Edition</div></div>
                    </div>
                </CardContent>
            </Card>

        </div>
      </main>
    </div>
  );
}