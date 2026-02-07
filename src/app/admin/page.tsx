"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link"; 
import Image from "next/image";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Search, 
  Mail, 
  Plus, 
  Edit3, 
  Bell,
  LogOut,
  BookOpen,      
  GraduationCap, 
  MapPin,        
  Phone,         
  UserCheck,     
  Circle,        
  FileText,      
  ChevronRight,  
  CheckCircle2,  
  Clock,         
  Menu,          
  X,             
  Home,
  ArrowLeft          
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MOCK_SCHEDULES = [
  { date: "2026-03-15", amSlots: 50, amBooked: 48, pmSlots: 50, pmBooked: 12 },
  { date: "2026-03-16", amSlots: 50, amBooked: 50, pmSlots: 50, pmBooked: 50 },
];

// --- NEW: RAC MASTERLIST MOCK DATA ---
const MOCK_MASTER_LIST = [
  {
    id: "rac-1",
    idNumber: "2019-00101",
    lname: "Abad",
    fname: "Anthony",
    mname: "J.",
    department: "College of Computing & Information Sciences",
    program: "BS Computer Science",
    statusStep: 6, // 6 = Completed/Pictorial Done
    details: {
      address: "Prk. 1, Apokon, Tagum City",
      contact: "09123456789",
      email: "anthony@gmail.com",
      thesis: "AI-Driven Crop Yield Prediction",
      guardian: "Mrs. Abad"
    }
  },
  {
    id: "rac-2",
    idNumber: "2019-00105",
    lname: "Corpuz",
    fname: "Bea",
    mname: "L.",
    department: "College of Computing & Information Sciences",
    program: "BS Information Technology",
    statusStep: 3, // 3 = Scheduled
    details: {
      address: "Visayan Village, Tagum City",
      contact: "09987654321",
      email: "bea@yahoo.com",
      thesis: "Automated Library System",
      guardian: "Mr. Corpuz"
    }
  },
  {
    id: "rac-3",
    idNumber: "2019-00201",
    lname: "Santos",
    fname: "Carlos",
    mname: "M.",
    department: "College of Business Administration",
    program: "BS Accountancy",
    statusStep: 2, // 2 = Verified Only
    details: {
      address: "Mankilam, Tagum City",
      contact: "09123456789",
      email: "carlos@gmail.com",
      thesis: "Impact of TRAIN Law on SMEs",
      guardian: "Mrs. Santos"
    }
  },
  {
    id: "rac-4",
    idNumber: "2019-00205",
    lname: "Dizon",
    fname: "Diana",
    mname: "O.",
    department: "College of Business Administration",
    program: "BS Accountancy",
    statusStep: 4, // 4 = Attendance
    details: {
      address: "Magugpo East, Tagum City",
      contact: "09123456789",
      email: "diana@gmail.com",
      thesis: "Audit Quality and Financial Reporting",
      guardian: "Mr. Dizon"
    }
  }
];

const STATUS_STEPS = [
  { id: 1, label: "Pre-Registered", desc: "Student submitted data" },
  { id: 2, label: "Verified", desc: "Cleared by RAC" },
  { id: 3, label: "Pictorial Scheduled", desc: "Slot booked" },
  { id: 4, label: "Attendance", desc: "Arrived at venue" },
  { id: 5, label: "Info Finalized", desc: "Details confirmed" },
  { id: 6, label: "Pictorial", desc: "Photoshoot completed" },
];

// --- MAIN COMPONENT ---
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("verification"); // 'verification', 'slots', 'masterlist'
  const [verifiedStudents, setVerifiedStudents] = useState<any[]>([]);
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  
  // States for Inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [newDateInput, setNewDateInput] = useState("");
  const [manualStudentName, setManualStudentName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States for Masterlist Modal
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  //fetching actual data from database, veri simple implementation 
  //PS: Do not modify, it's a pain to track and iterate :D
  // FIX 1: Initialize as empty array to be safe
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);

  useEffect(() => {
  //asynchronous.. so you can add loading states or whatevs while fetching
    const fetchStudents = async () => {
      try {
        //local testing for now but db is live in cloud..
        const res = await fetch('http://localhost:4000/fetch/verify'); 

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        const data = await res.json();
        console.log(data);

        // FIX 2: Ensure data is an array before setting
        if (Array.isArray(data)) {
          setPendingStudents(data);
        } else {
          setPendingStudents([]); // Default to empty if API returns weird object
        }
      } catch (err) {
        console.error("Something went wrong: ", err);
        setPendingStudents([]); // Default to empty on error
      }
    }
    fetchStudents(); 
  }, []);

  // --- ACTIONS: VERIFICATION --- 
  //now asynchronous.. so you can add loading states or whatevs when posting
  const handleVerify = async (studentId: number) => {
    // FIX 3: Optional chaining in case pendingStudents is empty
    const student = pendingStudents?.find(s => s.studentNumber?.student_number === studentId);
    if (!student) return;
    
    const body = {
      id: studentId
    };
    
    //PS: Do not modify, it's a pain to track and iterate :D
    try {
      const res = await fetch("http://localhost:4000/post/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const response = await res.json();
      console.log(response);

      setPendingStudents(prev => prev.filter(s => s.studentNumber.student_number !== studentId));
      setVerifiedStudents(prev => [...prev, { ...student, status: "verified" }]);
    } catch (err) {
      console.error("Something went wrong..", err);
    }
    
    // FIX 4: Ensure student.name exists (API usually returns first_name/last_name)
    const name = student.name || `${student.first_name} ${student.last_name}`;
    alert(`Succesfully verified ${name}! Credentials has been sent to the respective email.`);
  };

  const handleBulkVerify = () => {
    const match = pendingStudents.find(s => s.idNumber.includes(searchQuery));
    if (match) {
        handleVerify(match.id);
        setSearchQuery(""); 
    } else {
        alert("No pending student found with that ID number.");
    }
  };

  // --- ACTIONS: SCHEDULING ---
  const handleUpdateCapacity = (date: string, session: 'am' | 'pm', newCapacity: number) => {
    setSchedules(prev => prev.map(sched => {
        if (sched.date === date) {
            return session === 'am' 
                ? { ...sched, amSlots: newCapacity } 
                : { ...sched, pmSlots: newCapacity };
        }
        return sched;
    }));
  };

  const handleAddNewDate = () => {
    if (!newDateInput) return;
    const exists = schedules.some(s => s.date === newDateInput);
    if (exists) { alert("This date already exists!"); return; }

    const newSchedule = {
        date: newDateInput,
        amSlots: 50, amBooked: 0,
        pmSlots: 50, pmBooked: 0
    };
    setSchedules(prev => [...prev, newSchedule].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewDateInput(""); 
  };

  const handleManualAdd = (date: string, session: 'am' | 'pm') => {
    if (!manualStudentName) return;
    setSchedules(prev => prev.map(sched => {
        if (sched.date === date) {
            const currentBooked = session === 'am' ? sched.amBooked : sched.pmBooked;
            const limit = session === 'am' ? sched.amSlots : sched.pmSlots;
            if (currentBooked >= limit) { alert("Slot is full! Increase capacity first."); return sched; }
            return session === 'am' ? { ...sched, amBooked: sched.amBooked + 1 } : { ...sched, pmBooked: sched.pmBooked + 1 };
        }
        return sched;
    }));
    setManualStudentName(""); 
  };

  // --- ACTIONS: MASTERLIST GROUPING ---
  const groupedMasterlist = useMemo(() => {
    // 1. Filter by Search
    const filtered = MOCK_MASTER_LIST.filter(s => 
      s.lname.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.fname.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.idNumber.includes(searchQuery)
    );

    // 2. Group by Dept -> Program
    const groups: Record<string, Record<string, typeof MOCK_MASTER_LIST>> = {};
    
    filtered.forEach(student => {
      if (!groups[student.department]) groups[student.department] = {};
      if (!groups[student.department][student.program]) groups[student.department][student.program] = [];
      groups[student.department][student.program].push(student);
    });

    // 3. Sort Students Alphabetically by Last Name within groups
    Object.keys(groups).forEach(dept => {
      Object.keys(groups[dept]).forEach(prog => {
        groups[dept][prog].sort((a, b) => a.lname.localeCompare(b.lname));
      });
    });

    return groups;
  }, [searchQuery]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery("");
  }

  // LOGO COMPONENT REUSABLE
  const BrandLogo = ({ dark = false }: { dark?: boolean }) => (
    <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 overflow-hidden hover:scale-105 transition-transform duration-300">
           <Image src="/images/umtc-logo.png" alt="UMTC" fill className="object-contain" />
        </div>
        <div className={`h-8 w-[1px] ${dark ? 'bg-stone-300' : 'bg-stone-700/50'}`}></div>
        <div className="relative w-8 h-8 overflow-hidden hover:scale-105 transition-transform duration-300">
           <Image src="/images/aurium-logo.png" alt="Aurium" fill className="object-contain" />
        </div>
        <div className="flex flex-col justify-center">
           <span className={`text-lg font-serif font-bold ${dark ? 'text-stone-800' : 'text-white'} leading-none tracking-tight`}>AURIUM</span>
           <span className="text-[8px] text-amber-600 uppercase tracking-widest font-bold">Admin Portal</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans relative selection:bg-amber-100 selection:text-amber-900">
      
      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            
            <aside className="relative w-72 bg-stone-950 text-stone-300 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 h-full border-r border-stone-800">
                <div className="p-6 border-b border-stone-800/50 flex items-center justify-between">
                    <BrandLogo />
                    <Button variant="ghost" size="icon" className="text-stone-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-2 px-3">Menu</p>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-stone-400 hover:text-white hover:bg-stone-900">
                            <Home size={18} /> Return to Website
                        </Button>
                    </Link>

                    <div className="my-2 border-t border-stone-800/50"></div>

                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "verification" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { handleTabChange("verification"); setIsMobileMenuOpen(false); }}
                    >
                        <Users size={18} className={activeTab === "verification" ? "text-amber-400" : "text-stone-500"} /> Student Verification
                    </Button>
                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "masterlist" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { handleTabChange("masterlist"); setIsMobileMenuOpen(false); }}
                    >
                        <BookOpen size={18} className={activeTab === "masterlist" ? "text-amber-400" : "text-stone-500"} /> RAC Masterlist
                    </Button>
                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "slots" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { handleTabChange("slots"); setIsMobileMenuOpen(false); }}
                    >
                        <Calendar size={18} className={activeTab === "slots" ? "text-amber-400" : "text-stone-500"} /> Pictorial Schedules
                    </Button>
                </nav>

                <div className="p-4 border-t border-stone-800/50 bg-stone-950">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="border-2 border-stone-700">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Admin User</p>
                            <p className="text-[10px] text-stone-500 truncate uppercase tracking-wider">Head Moderator</p>
                        </div>
                    </div>
                    {/* Logout Confirmation Dialog for Mobile */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-center gap-2 text-red-400 border-red-900/30 bg-red-900/10 hover:bg-red-900/20 hover:text-red-300">
                                <LogOut size={16} /> Log Out
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[90%] rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Confirm Logout</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to end your session? You will be redirected to the landing page.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Link href="/" className="w-full">
                                    <Button variant="destructive" className="w-full">Yes, Log Out</Button>
                                </Link>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </aside>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-72 bg-stone-950 text-stone-300 hidden md:flex flex-col h-screen fixed left-0 top-0 z-20 border-r border-stone-800 shadow-2xl">
        <div className="p-8 border-b border-stone-800/50 flex items-center justify-center">
             <BrandLogo />
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-2 px-3">Menu</p>
            {/* Added Home Button */}
            <Link href="/">
                <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-medium hover:text-white hover:bg-stone-900 text-stone-500">
                    <Home size={18} /> Return to Website
                </Button>
            </Link>

            <div className="my-2 border-t border-stone-800/50"></div>

            <Button variant="ghost" className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === 'verification' ? 'bg-amber-900/30 text-amber-100 border-r-2 border-amber-500' : 'hover:text-white hover:bg-stone-900'}`} onClick={() => handleTabChange("verification")}>
                <Users size={18} className={activeTab === "verification" ? "text-amber-500" : "text-stone-500"} /> Student Verification
            </Button>
            <Button variant="ghost" className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === 'masterlist' ? 'bg-amber-900/30 text-amber-100 border-r-2 border-amber-500' : 'hover:text-white hover:bg-stone-900'}`} onClick={() => handleTabChange("masterlist")}>
                <BookOpen size={18} className={activeTab === "masterlist" ? "text-amber-500" : "text-stone-500"} /> RAC Masterlist
            </Button>
            <Button variant="ghost" className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === 'slots' ? 'bg-amber-900/30 text-amber-100 border-r-2 border-amber-500' : 'hover:text-white hover:bg-stone-900'}`} onClick={() => handleTabChange("slots")}>
                <Calendar size={18} className={activeTab === "slots" ? "text-amber-500" : "text-stone-500"} /> Pictorial Schedules
            </Button>
        </nav>

        <div className="p-6 border-t border-stone-800/50 bg-stone-950">
            <div className="flex items-center gap-3 mb-6 bg-stone-900/50 p-3 rounded-xl border border-stone-800">
                <Avatar className="border-2 border-stone-600 h-10 w-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">Admin User</p>
                    <p className="text-[10px] text-stone-500 truncate uppercase tracking-wider">Head Moderator</p>
                </div>
            </div>
            {/* Logout Confirmation Dialog for Desktop */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <LogOut size={18} /> Log Out
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl text-stone-800">Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to end your session? You will be redirected to the landing page.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button variant="destructive" className="w-full">Yes, Log Out</Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto h-screen bg-[#FDFBF7]">
        {/* Updated Header with Burger Button */}
        <header className="flex items-center justify-between mb-8 py-4 border-b border-stone-200/50">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Button variant="ghost" size="icon" className="md:hidden text-stone-500 hover:text-amber-900" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu className="h-6 w-6" />
                </Button>

                {/* LOGIC FIX: Back Button only appears when a student is selected */}
                {selectedStudent ? (
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="rounded-full hover:bg-stone-200 text-stone-600"
                       onClick={() => setSelectedStudent(null)} // Go back to list
                     >
                        <ArrowLeft className="h-5 w-5" />
                     </Button>
                ) : null}

                {/* HEADER TITLE / LOGO */}
                <div className="flex items-center gap-3">
                    {/* On Mobile: Show Logo. On Desktop: Show Title */}
                    <div className="md:hidden">
                        <BrandLogo dark />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-2xl font-serif font-bold text-stone-800">
                            {activeTab === 'verification' && "Verification Queue"}
                            {activeTab === 'slots' && "Schedule Manager"}
                            {activeTab === 'masterlist' && "Verified Masterlist"}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full shadow-sm text-xs font-medium text-stone-500">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   System Online
                </div>
                <Button variant="ghost" size="icon" className="text-stone-400 hover:text-amber-800 relative rounded-full hover:bg-amber-50">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Button>
            </div>
        </header>

        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* --- TAB 1: STUDENT VERIFICATION --- */}
            {activeTab === 'verification' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white border-amber-200 border-l-4 border-l-amber-600 shadow-sm">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-amber-900 uppercase tracking-wide">Pending Approval</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-bold text-amber-700">{pendingStudents.length}</div></CardContent>
                        </Card>
                        <Card className="bg-white border-stone-200 shadow-sm">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wide">Recently Verified</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-bold text-stone-700">{verifiedStudents.length}</div></CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                        <div className="flex-1 space-y-2 w-full">
                            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Quick Verify by ID Number</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                                <Input 
                                    placeholder="Enter Student ID (e.g. 2020-00123)..." 
                                    className="pl-10 h-11 bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-200" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button className="h-11 px-6 bg-amber-900 hover:bg-amber-800 text-white shadow-md shadow-amber-900/10 w-full md:w-auto" onClick={handleBulkVerify}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Verify Student
                        </Button>
                    </div>

                    <Card className="border-stone-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-stone-50/50 border-b border-stone-100">
                            <CardTitle className="text-lg font-serif text-stone-800">Pre-Registered Students</CardTitle>
                            <CardDescription>Verify these students against the RAC Graduation List.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-0 divide-y divide-stone-100">
                                {/* FIX 5: Safer mapping logic */}
                                {pendingStudents.length === 0 ? (
                                    <div className="text-center py-16 bg-white">
                                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="h-8 w-8 text-stone-300"/>
                                        </div>
                                        <p className="text-stone-500 font-medium">All caught up! No pending students.</p>
                                    </div>
                                ) : (
                                    Array.isArray(pendingStudents) && pendingStudents.map((student) => (
                                        <div key={student.id || Math.random()} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors">
                                            <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                                                <div className="h-10 w-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-bold text-xs">
                                                    {student.course ? student.course.substring(0,2) : "UN"}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-stone-800 text-sm">{`${student.first_name} ${student.last_name}`}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                                                        <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                                                            {student.studentNumber ? student.studentNumber.student_number : "No ID"}
                                                        </span>
                                                        <span className="text-stone-300">•</span>
                                                        <span>{student.course}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto shadow-sm" onClick={() => handleVerify(student.studentNumber?.student_number)}>
                                                    <Mail className="mr-2 h-3 w-3" /> Approve & Send
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* --- TAB 2: MASTERLIST (NEW FEATURE) --- */}
            {activeTab === 'masterlist' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Search / Filter Header */}
                    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-stone-800">RAC Verified Masterlist</h2>
                                <p className="text-sm text-stone-500">Official list of candidates for graduation.</p>
                            </div>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                                {MOCK_MASTER_LIST.length} Records
                            </Badge>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                            <Input 
                                placeholder="Search by Name or ID Number..." 
                                className="pl-10 h-11 bg-stone-50 border-stone-200 focus:border-amber-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Grouped List */}
                    <div className="space-y-8">
                        {Object.keys(groupedMasterlist).length === 0 && (
                            <div className="text-center py-12 text-stone-400">No students found matching your search.</div>
                        )}

                        {Object.keys(groupedMasterlist).sort().map((dept) => (
                            <div key={dept} className="space-y-4">
                                {/* Department Header */}
                                <div className="sticky top-0 z-10 bg-[#FDFBF7]/95 backdrop-blur py-2 border-b border-amber-200/50">
                                    <h3 className="text-lg font-serif font-bold text-amber-900 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" /> {dept}
                                    </h3>
                                </div>

                                {Object.keys(groupedMasterlist[dept]).sort().map((program) => (
                                    <div key={program} className="pl-4 border-l-2 border-stone-200 space-y-3">
                                        {/* Course Header */}
                                        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2 mt-4 mb-2">
                                            <GraduationCap className="h-4 w-4" /> {program}
                                        </h4>

                                        {/* Student Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {groupedMasterlist[dept][program].map((student) => (
                                                <div 
                                                    key={student.id} 
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="group bg-white p-4 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
                                                >
                                                    <div>
                                                        <p className="font-bold text-stone-800 group-hover:text-amber-800 transition-colors text-sm">
                                                            {student.lname}, {student.fname} {student.mname}
                                                        </p>
                                                        <p className="text-xs font-mono text-stone-500 mt-1 bg-stone-50 inline-block px-1 rounded">{student.idNumber}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`text-[10px] ${student.statusStep >= 6 ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : 'bg-stone-100 text-stone-600 hover:bg-stone-100 border-stone-200'}`}>
                                                            {student.statusStep >= 6 ? 'Done' : 'Active'}
                                                        </Badge>
                                                        <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-amber-500" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- TAB 3: SLOT MANAGEMENT --- */}
            {activeTab === 'slots' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-stone-800">Pictorial Availability</h2>
                            <p className="text-stone-500 text-sm">Manage capacity for morning and afternoon sessions.</p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-amber-900 hover:bg-amber-800 shadow-lg shadow-amber-900/20">
                                    <Plus className="mr-2 h-4 w-4" /> Add New Date
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Open New Schedule</DialogTitle>
                                    <DialogDescription>Add a new date for pictorials. Default capacity is 50/50.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Select Date</Label>
                                        <Input type="date" value={newDateInput} onChange={(e) => setNewDateInput(e.target.value)} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddNewDate}>Create Schedule</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-6">
                        {schedules.map((day, idx) => (
                            <Card key={idx} className="overflow-hidden border-t-4 border-t-amber-600 shadow-md rounded-2xl border-stone-200">
                                <CardHeader className="bg-stone-50/80 pb-4 border-b border-stone-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2 font-serif text-stone-800">
                                                <Calendar className="text-amber-600 h-5 w-5" /> 
                                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </CardTitle>
                                        </div>
                                        <Badge variant="outline" className={day.amBooked + day.pmBooked >= day.amSlots + day.pmSlots ? "text-red-600 border-red-200 bg-red-50" : "text-green-600 border-green-200 bg-green-50"}>
                                            {day.amBooked + day.pmBooked >= day.amSlots + day.pmSlots ? "FULLY BOOKED" : "AVAILABLE"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* MORNING */}
                                            <div className="space-y-4 p-4 rounded-xl border border-stone-100 bg-amber-50/30">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-stone-700 flex items-center gap-2 text-sm">
                                                        🌤️ Morning <span className="text-[10px] font-normal text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">8AM - 12PM</span>
                                                    </h4>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-stone-400 hover:text-amber-700 hover:bg-amber-100 rounded-full"><Edit3 className="h-3.5 w-3.5" /></Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader><DialogTitle>Modify Morning Capacity</DialogTitle></DialogHeader>
                                                            <Input type="number" defaultValue={day.amSlots} onChange={(e) => handleUpdateCapacity(day.date, 'am', parseInt(e.target.value))} />
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <span className={day.amBooked >= day.amSlots ? "text-red-600 font-bold" : "text-amber-700"}>{day.amBooked} Booked</span>
                                                        <span className="text-stone-400">Limit: {day.amSlots}</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-100">
                                                        <div className={`h-full rounded-full transition-all duration-500 shadow-sm ${day.amBooked >= day.amSlots ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${(day.amBooked / day.amSlots) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="w-full text-xs border-dashed border-stone-300 text-stone-500 hover:text-amber-800 hover:border-amber-300 hover:bg-amber-50"><Plus className="mr-1 h-3 w-3" /> Manually Add Student</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Add to Morning Slot</DialogTitle></DialogHeader>
                                                        <Input placeholder="e.g., Juan Dela Cruz" value={manualStudentName} onChange={(e) => setManualStudentName(e.target.value)} />
                                                        <DialogFooter><Button onClick={() => handleManualAdd(day.date, 'am')}>Confirm Add (+1)</Button></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            {/* AFTERNOON */}
                                            <div className="space-y-4 p-4 rounded-xl border border-stone-100 bg-blue-50/30">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-stone-700 flex items-center gap-2 text-sm">
                                                        ☀️ Afternoon <span className="text-[10px] font-normal text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">1PM - 5PM</span>
                                                    </h4>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-stone-400 hover:text-amber-700 hover:bg-amber-100 rounded-full"><Edit3 className="h-3.5 w-3.5" /></Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader><DialogTitle>Modify Afternoon Capacity</DialogTitle></DialogHeader>
                                                            <Input type="number" defaultValue={day.pmSlots} onChange={(e) => handleUpdateCapacity(day.date, 'pm', parseInt(e.target.value))} />
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <span className={day.pmBooked >= day.pmSlots ? "text-red-600 font-bold" : "text-blue-700"}>{day.pmBooked} Booked</span>
                                                        <span className="text-stone-400">Limit: {day.pmSlots}</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-100">
                                                        <div className={`h-full rounded-full transition-all duration-500 shadow-sm ${day.pmBooked >= day.pmSlots ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${(day.pmBooked / day.pmSlots) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="w-full text-xs border-dashed border-stone-300 text-stone-500 hover:text-blue-800 hover:border-blue-300 hover:bg-blue-50"><Plus className="mr-1 h-3 w-3" /> Manually Add Student</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Add to Afternoon Slot</DialogTitle></DialogHeader>
                                                        <Input placeholder="e.g., Maria Clara" value={manualStudentName} onChange={(e) => setManualStudentName(e.target.value)} />
                                                        <DialogFooter><Button onClick={() => handleManualAdd(day.date, 'pm')}>Confirm Add (+1)</Button></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </main>

      {/* --- STUDENT DETAILS STATUS MODAL --- */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedStudent && (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* LEFT: Student Profile */}
                    <div className="flex-1 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-amber-950 flex items-center gap-2">
                                {selectedStudent.lname}, {selectedStudent.fname} {selectedStudent.mname}
                                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                            </DialogTitle>
                            <DialogDescription className="text-base font-mono bg-stone-100 inline-block px-2 py-1 rounded text-stone-600">
                                ID: {selectedStudent.idNumber}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 text-sm text-stone-600">
                            <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 space-y-3">
                                <h4 className="font-bold text-stone-800 uppercase text-xs tracking-wider mb-2">Academic Profile</h4>
                                <div className="flex items-start gap-3"><GraduationCap className="h-4 w-4 mt-0.5 text-amber-600"/> <span>{selectedStudent.program}</span></div>
                                <div className="flex items-start gap-3"><BookOpen className="h-4 w-4 mt-0.5 text-amber-600"/> <span>{selectedStudent.department}</span></div>
                                <div className="flex items-start gap-3"><FileText className="h-4 w-4 mt-0.5 text-amber-600"/> <span className="italic">Thesis: "{selectedStudent.details.thesis}"</span></div>
                            </div>

                            <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 space-y-3">
                                <h4 className="font-bold text-stone-800 uppercase text-xs tracking-wider mb-2">Personal Details</h4>
                                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-stone-400"/> {selectedStudent.details.address}</div>
                                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-stone-400"/> {selectedStudent.details.contact}</div>
                                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-stone-400"/> {selectedStudent.details.email}</div>
                                <div className="flex items-center gap-3"><UserCheck className="h-4 w-4 text-stone-400"/> Guardian: {selectedStudent.details.guardian}</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Status Timeline */}
                    <div className="w-full md:w-80 bg-stone-50 p-6 rounded-xl border border-stone-200">
                        <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-600" /> Status Tracker
                        </h3>
                        <div className="space-y-0">
                            {STATUS_STEPS.map((step, index) => {
                                const isCompleted = step.id <= selectedStudent.statusStep;
                                const isCurrent = step.id === selectedStudent.statusStep;
                                return (
                                    <div key={step.id} className="flex gap-4 relative pb-8 last:pb-0">
                                        {/* Connecting Line */}
                                        {index < STATUS_STEPS.length - 1 && (
                                            <div className={`absolute left-[11px] top-7 bottom-0 w-0.5 ${isCompleted && !isCurrent ? 'bg-green-300' : 'bg-stone-200'}`}></div>
                                        )}
                                        
                                        {/* Icon */}
                                        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${
                                            isCompleted 
                                            ? 'bg-green-100 border-green-500 text-green-600' 
                                            : 'bg-white border-stone-300 text-stone-300'
                                        }`}>
                                            {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                        </div>
                                        
                                        {/* Text */}
                                        <div className={`${isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                                            <p className={`text-sm font-bold leading-none ${isCurrent ? 'text-green-700' : 'text-stone-700'}`}>{step.label}</p>
                                            <p className="text-xs text-stone-500 mt-1">{step.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}