"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { 
  Users, 
  User, 
  ScanLine, 
  Search, 
  Edit3, 
  CheckCircle2, 
  Save, 
  Clock, 
  LogOut,
  StickyNote,
  Plus,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Home,
  BookOpen,
  Image as ImageIcon,
  Menu, 
  X,
  ArrowLeft,
  Camera,
  ChevronRight,
  Bell,
  Trash2, // Restored Trash Icon
  Info,   // Restored Info Icon for Notifs
  AlertCircle, // Restored Alert Icon
  Check // Restored Check Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";

// --- MOCK DATA ---
const INITIAL_STAFF_USER = {
  name: "Ms. Sarah Jenkins",
  role: "Yearbook Coordinator",
  id: "STF-2026-01",
  department: "Student Affairs",
  email: "staff@aurium.edu.ph",
  avatar: "https://github.com/shadcn.png"
};

// RESTORED: Notifications Data
const MOCK_NOTIFICATIONS = [
    { id: 1, title: "New Registration", message: "Student 2020-00999 has registered.", time: "2 mins ago", type: "info", read: false },
    { id: 2, title: "Photo Update", message: "Juan Dela Cruz updated their profile photo.", time: "1 hour ago", type: "success", read: false },
    { id: 3, title: "System Alert", message: "Scheduled maintenance tonight at 11 PM.", time: "5 hours ago", type: "warning", read: false },
    { id: 4, title: "Verification", message: "Maria Clara is requesting verification.", time: "1 day ago", type: "info", read: true },
];

const MOCK_GRADUATES = [
  { 
    id: "2020-00123", 
    // Personal
    lname: "Dela Cruz",
    fname: "Juan",
    mname: "Santos",
    suffix: "",
    nickname: "\"Juanny\"",
    birthdate: "2002-05-15",
    
    // Address
    province: "Davao del Norte",
    city: "Tagum City",
    barangay: "Visayan Village",

    // Academic
    course: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE", 
    major: "Data Science", 
    thesis: "AI-Driven Traffic Management System for Tagum City",
    
    // Contact
    contactNum: "09123456789",
    personalEmail: "juan.delacruz@gmail.com",
    
    // Family
    father: "Pedro Dela Cruz",
    mother: "Maria Dela Cruz",
    guardian: "", 
    
    photo: "https://github.com/shadcn.png",
    
    // System Status
    status: "pending", 
    last_edited_by: null,
    last_edited_at: null
  },
  { 
    id: "2020-00456", 
    lname: "Clara",
    fname: "Maria",
    mname: "Reyes",
    suffix: "",
    nickname: "\"Mar\"",
    birthdate: "2001-11-20",
    province: "Davao de Oro",
    city: "Nabunturan",
    barangay: "Poblacion",
    course: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION", 
    major: "Marketing Management", 
    thesis: "Impact of Social Media Marketing on Local Coffee Shops",
    contactNum: "09987654321",
    personalEmail: "maria.clara@yahoo.com",
    father: "Jose Clara",
    mother: "Teresa Clara",
    guardian: "",
    photo: "https://github.com/shadcn.png",
    status: "verified",
    last_edited_by: "Ms. Sarah Jenkins",
    last_edited_at: "2026-03-15 09:30 AM"
  },
];

const INITIAL_NOTES = [
  { id: 1, content: "Remember to check honor titles for BSCS students.", color: "bg-amber-100" },
  { id: 2, content: "Pictorial break time is at 12:00 PM.", color: "bg-blue-100" },
];

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("verification");
  const [searchTerm, setSearchTerm] = useState("");
  const [graduates, setGraduates] = useState(MOCK_GRADUATES);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [newNote, setNewNote] = useState("");
  
  // Mobile & Profile States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [staffUser, setStaffUser] = useState(INITIAL_STAFF_USER);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const studentPhotoInputRef = useRef<HTMLInputElement>(null);

  // RESTORED: Notification States
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // RESTORED: Note Deletion State
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  // RESTORED: Swipe State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // --- ACTIONS ---

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const timestamp = new Date().toLocaleString();

    const updates = {
        fname: (formData.get("fname") as string) || selectedStudent.fname,
        lname: (formData.get("lname") as string) || selectedStudent.lname,
        mname: (formData.get("mname") as string) || selectedStudent.mname,
        suffix: (formData.get("suffix") as string) || "", 
        nickname: (formData.get("nickname") as string) || "",
        course: (formData.get("course") as string) || selectedStudent.course,
        major: (formData.get("major") as string) || selectedStudent.major,
        thesis: (formData.get("thesis") as string) || selectedStudent.thesis,
        province: (formData.get("province") as string) || selectedStudent.province,
        city: (formData.get("city") as string) || selectedStudent.city,
        barangay: (formData.get("barangay") as string) || selectedStudent.barangay,
        contactNum: (formData.get("contactNum") as string) || selectedStudent.contactNum,
        personalEmail: (formData.get("personalEmail") as string) || selectedStudent.personalEmail,
        father: (formData.get("father") as string) || selectedStudent.father,
        mother: (formData.get("mother") as string) || selectedStudent.mother,
        guardian: (formData.get("guardian") as string) || "",
        status: "verified",
        last_edited_by: staffUser.name,
        last_edited_at: timestamp,
        photo: selectedStudent.photo
    };

    setGraduates(prev => prev.map(g => 
      g.id === selectedStudent.id ? { ...g, ...updates } : g
    ));

    setSelectedStudent((prev: any) => ({ ...prev, ...updates }));
    setIsEditing(false);
  };

  const handleStudentPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedStudent((prev: any) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalize = () => {
    const timestamp = new Date().toLocaleString();
    const update = {
        status: "verified", 
        last_edited_by: staffUser.name,
        last_edited_at: timestamp 
    };

    setGraduates(prev => prev.map(g => 
        g.id === selectedStudent.id ? { ...g, ...update } : g
    ));
      
    setSelectedStudent((prev: any) => ({ ...prev, ...update }));
  };

  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStaffUser(prev => ({
        ...prev,
        name: (formData.get("staffName") as string) || prev.name,
        role: (formData.get("staffRole") as string) || prev.role,
        department: (formData.get("staffDept") as string) || prev.department,
        email: (formData.get("staffEmail") as string) || prev.email,
    }));
    setIsProfileEditing(false);
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStaffUser(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // RESTORED: Notification Logic
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  // RESTORED: Note Logic
  const addNote = () => {
    if(!newNote.trim()) return;
    const colors = ["bg-amber-100", "bg-blue-100", "bg-green-100", "bg-rose-100"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setNotes(prev => [...prev, { id: Date.now(), content: newNote, color: randomColor }]);
    setNewNote("");
  };

  const confirmDeleteNote = () => {
    if (noteToDelete !== null) {
        setNotes(prev => prev.filter(n => n.id !== noteToDelete));
        setNoteToDelete(null);
    }
  };

  // RESTORED: Swipe Handlers for Notes
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (id: number) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    
    if (isLeftSwipe) {
        setNoteToDelete(id);
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const filteredGraduates = graduates.filter(g => 
    g.lname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.id.includes(searchTerm)
  );

  const BrandLogo = ({ dark = false }: { dark?: boolean }) => (
    <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 overflow-hidden hover:scale-105 transition-transform duration-300">
           <Image src="/images/umtc_logo.png" alt="UMTC" fill className="object-contain" />
        </div>
        <div className={`h-8 w-[1px] ${dark ? 'bg-stone-300' : 'bg-stone-700/50'}`}></div>
        <div className="relative w-8 h-8 overflow-hidden hover:scale-105 transition-transform duration-300">
           <Image src="/images/aurium-logo.png" alt="Aurium" fill className="object-contain" />
        </div>
        <div className="flex flex-col justify-center">
           <span className={`text-lg font-serif font-bold ${dark ? 'text-stone-800' : 'text-white'} leading-none tracking-tight`}>AURIUM</span>
           <span className="text-[8px] text-amber-600 uppercase tracking-widest font-bold">Staff Portal</span>
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
                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "verification" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { setActiveTab("verification"); setIsMobileMenuOpen(false); }}
                    >
                        <Users size={18} className={activeTab === "verification" ? "text-amber-400" : "text-stone-500"} /> Graduate Verification
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "notes" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { setActiveTab("notes"); setIsMobileMenuOpen(false); }}
                    >
                        <StickyNote size={18} className={activeTab === "notes" ? "text-amber-400" : "text-stone-500"} /> Staff Notes
                    </Button>

                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "profile" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { setActiveTab("profile"); setIsMobileMenuOpen(false); }}
                    >
                        <User size={18} className={activeTab === "profile" ? "text-amber-400" : "text-stone-500"} /> My Profile
                    </Button>

                    <div className="pt-4 mt-4 border-t border-stone-800/50">
                        <Link href="/admin/scanner" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-stone-400 hover:text-green-400 hover:bg-stone-900 h-12">
                                <ScanLine size={18} /> Attendance Scanner
                            </Button>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-stone-800/50 bg-stone-950">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="border-2 border-stone-700">
                            <AvatarImage src={staffUser.avatar} />
                            <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{staffUser.name}</p>
                            <p className="text-[10px] text-stone-500 truncate uppercase tracking-wider">{staffUser.role}</p>
                        </div>
                    </div>
                    {/* LOGOUT CONFIRMATION (Mobile) */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-center gap-2 text-red-400 border-red-900/30 bg-red-900/10 hover:bg-red-900/20 hover:text-red-300">
                                <LogOut size={16} /> Sign Out
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
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === "verification" ? "bg-amber-900/30 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
            onClick={() => setActiveTab("verification")}
          >
            <Users size={18} className={activeTab === "verification" ? "text-amber-500" : "text-stone-500"} /> Graduate Verification
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === "notes" ? "bg-amber-900/30 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
            onClick={() => setActiveTab("notes")}
          >
            <StickyNote size={18} className={activeTab === "notes" ? "text-amber-500" : "text-stone-500"} /> Staff Notes
          </Button>

          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === "profile" ? "bg-amber-900/30 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} className={activeTab === "profile" ? "text-amber-500" : "text-stone-500"} /> My Profile
          </Button>

          <div className="pt-6 mt-6 border-t border-stone-800/50">
            <Link href="/admin/scanner">
              <Button variant="ghost" className="w-full justify-start gap-4 text-stone-400 hover:text-green-400 hover:bg-stone-900 h-12">
                <ScanLine size={18} /> Attendance Scanner
              </Button>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-stone-800/50 bg-stone-950">
          <div className="flex items-center gap-3 mb-6 bg-stone-900/50 p-3 rounded-xl border border-stone-800">
            <Avatar className="border border-stone-600 h-10 w-10">
              <AvatarImage src={staffUser.avatar} />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{staffUser.name}</p>
              <p className="text-[10px] text-stone-500 truncate uppercase tracking-wider">{staffUser.role}</p>
            </div>
          </div>
          {/* LOGOUT CONFIRMATION (Desktop) */}
          <Dialog>
             <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    <LogOut size={18} /> Sign Out
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

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto h-screen bg-[#FDFBF7]">
        
        {/* --- HEADER (NO STICKY, WITH BACK LOGIC) --- */}
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
                            {activeTab === 'verification' && "Graduate Verification"}
                            {activeTab === 'notes' && "Staff Notes"}
                            {activeTab === 'profile' && "My Profile"}
                        </h1>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full shadow-sm text-xs font-medium text-stone-500">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   System Online
                </div>
                
                {/* --- RESTORED: NOTIFICATION DROPDOWN --- */}
                <div className="relative" ref={notificationRef}>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-stone-400 hover:text-amber-800 relative rounded-full hover:bg-amber-50"
                        onClick={() => {
                             setIsNotificationsOpen(!isNotificationsOpen);
                             if (!isNotificationsOpen) markAllAsRead();
                        }}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                             <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                    </Button>
                    
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 backdrop-blur">
                                <h4 className="font-bold text-stone-800 text-sm">Notifications</h4>
                                <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">{unreadCount} Unread</span>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className={`p-4 border-b border-stone-50 flex gap-3 hover:bg-stone-50 transition-colors ${!notif.read ? 'bg-amber-50/30' : ''}`}>
                                            <div className={`p-2 rounded-full h-fit shrink-0 ${
                                                notif.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                                notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                                {notif.type === 'info' && <Info size={14} />}
                                                {notif.type === 'success' && <Check size={14} />}
                                                {notif.type === 'warning' && <AlertCircle size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-800">{notif.title}</p>
                                                <p className="text-xs text-stone-500 leading-relaxed mb-1">{notif.message}</p>
                                                <p className="text-[10px] text-stone-400 font-medium">{notif.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-stone-400 text-xs">No new notifications.</div>
                                )}
                            </div>
                            <div className="p-2 border-t border-stone-100 bg-stone-50 text-center">
                                <button className="text-xs font-bold text-amber-700 hover:underline" onClick={markAllAsRead}>Mark all as read</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* === VIEW 1: VERIFICATION === */}
        {activeTab === "verification" && (
          <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {!selectedStudent && (
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                 <div>
                   <h2 className="text-lg font-bold text-stone-800">Verification Queue</h2>
                   <p className="text-stone-500 text-sm">Review, edit, and finalize graduate yearbook entries.</p>
                 </div>
                 <div className="relative w-full md:w-96">
                   <Search className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                   <Input 
                     placeholder="Search by Name or ID..." 
                     className="pl-10 bg-stone-50 border-stone-200 h-11 rounded-xl focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                 </div>
               </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
              
              {/* LEFT: LIST (3 Cols) */}
              <Card className={`lg:col-span-3 border-stone-200 shadow-sm flex flex-col overflow-hidden h-full rounded-2xl ${selectedStudent ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">All Students</span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">{filteredGraduates.length}</Badge>
                </div>
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-2">
                    {filteredGraduates.map((grad) => (
                      <button 
                        key={grad.id}
                        onClick={() => { setSelectedStudent(grad); setIsEditing(false); }}
                        className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all border group
                          ${selectedStudent?.id === grad.id 
                            ? "bg-amber-50 border-amber-200 shadow-sm" 
                            : "bg-white hover:bg-stone-50 border-transparent hover:border-stone-200"
                          }`}
                      >
                        <Avatar className="h-10 w-10 border border-stone-200 group-hover:border-amber-300 transition-colors">
                          <AvatarImage src={grad.photo} />
                          <AvatarFallback>{grad.fname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <p className={`font-bold text-sm truncate ${selectedStudent?.id === grad.id ? 'text-amber-900' : 'text-stone-800'}`}>{grad.fname} {grad.lname}</p>
                            {grad.status === "verified" && <CheckCircle2 size={14} className="text-green-600" />}
                          </div>
                          <p className="text-xs text-stone-500 font-mono truncate">{grad.id}</p>
                        </div>
                        <ChevronRight size={16} className={`text-stone-300 ${selectedStudent?.id === grad.id ? 'text-amber-500' : ''}`} />
                      </button>
                    ))}
                    {filteredGraduates.length === 0 && (
                      <div className="text-center py-10 text-stone-400 text-sm flex flex-col items-center">
                          <Search className="h-8 w-8 mb-2 opacity-20" />
                          No graduates found.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>

              {/* RIGHT: DETAILS (9 Cols) */}
              <div className={`lg:col-span-9 h-full ${selectedStudent ? 'block' : 'hidden lg:block'}`}>
                {selectedStudent ? (
                  <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
                    {/* AUDIT TRAIL HEADER */}
                    <div className="bg-white border border-stone-200 rounded-t-2xl p-4 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 shadow-sm z-10">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Badge variant={selectedStudent.status === 'verified' ? 'default' : 'outline'} className={`px-3 py-1 ${selectedStudent.status === 'verified' ? 'bg-green-600 hover:bg-green-600' : 'text-stone-500 border-stone-300'}`}>
                          {selectedStudent.status === 'verified' ? 'VERIFIED FINAL' : 'PENDING REVIEW'}
                        </Badge>
                        <span className="h-4 w-[1px] bg-stone-300 hidden sm:block"></span>
                        <span className="font-mono text-stone-400">{selectedStudent.id}</span>
                      </div>
                      {selectedStudent.last_edited_by && (
                        <div className="flex items-center gap-1.5 mt-2 sm:mt-0 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                          <Clock size={12} className="text-amber-600" />
                          <span>Last verified by <strong>{selectedStudent.last_edited_by}</strong> on {selectedStudent.last_edited_at}</span>
                        </div>
                      )}
                    </div>

                    {/* MAIN CARD */}
                    <Card className="rounded-t-none border-t-0 shadow-lg flex-1 flex flex-col bg-white relative overflow-hidden rounded-b-2xl border-stone-200">
                        
                        {/* EDIT MODE */}
                        {isEditing ? (
                            <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
                                <form id="edit-form" onSubmit={handleSaveEdit}>
                                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-stone-50/95 backdrop-blur z-20 py-2 border-b border-stone-200">
                                        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                            <Edit3 size={20} className="text-amber-600"/> Edit Graduate Information
                                        </h2>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                                            <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20">Save Changes</Button>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="personal" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4 mb-6 p-1 bg-stone-200/50 rounded-xl">
                                            <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Personal</TabsTrigger>
                                            <TabsTrigger value="academic" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Academic</TabsTrigger>
                                            <TabsTrigger value="contact" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Contact</TabsTrigger>
                                            <TabsTrigger value="family" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Family</TabsTrigger>
                                        </TabsList>

                                        {/* TAB 1: PERSONAL */}
                                        <TabsContent value="personal" className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2"><Label>First Name</Label><Input name="fname" defaultValue={selectedStudent.fname} className="bg-stone-50" /></div>
                                                <div className="space-y-2"><Label>Last Name</Label><Input name="lname" defaultValue={selectedStudent.lname} className="bg-stone-50" /></div>
                                                <div className="space-y-2"><Label>Middle Name</Label><Input name="mname" defaultValue={selectedStudent.mname} className="bg-stone-50" /></div>
                                                <div className="space-y-2"><Label>Suffix</Label><Input name="suffix" defaultValue={selectedStudent.suffix} className="bg-stone-50" /></div>
                                            </div>
                                            <div className="space-y-2"><Label>Nickname (with quotes)</Label><Input name="nickname" defaultValue={selectedStudent.nickname} className="bg-stone-50" /></div>
                                        </TabsContent>

                                        {/* TAB 2: ACADEMIC */}
                                        <TabsContent value="academic" className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                                            <div className="space-y-2"><Label>Course</Label><Input name="course" defaultValue={selectedStudent.course} className="bg-stone-50" /></div>
                                            <div className="space-y-2"><Label>Major</Label><Input name="major" defaultValue={selectedStudent.major} className="bg-stone-50" /></div>
                                            <div className="space-y-2"><Label>Thesis Title</Label><Input name="thesis" defaultValue={selectedStudent.thesis} className="bg-stone-50" /></div>
                                        </TabsContent>

                                        {/* TAB 3: CONTACT & ADDRESS */}
                                        <TabsContent value="contact" className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                                            <h4 className="font-bold text-stone-700 text-sm uppercase">Address</h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2"><Label>Province</Label><Input name="province" defaultValue={selectedStudent.province} className="bg-stone-50" /></div>
                                                <div className="space-y-2"><Label>City</Label><Input name="city" defaultValue={selectedStudent.city} className="bg-stone-50" /></div>
                                                <div className="space-y-2"><Label>Barangay</Label><Input name="barangay" defaultValue={selectedStudent.barangay} className="bg-stone-50" /></div>
                                            </div>
                                            <h4 className="font-bold text-stone-700 text-sm uppercase mt-4">Contact Info</h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2"><Label>Mobile No.</Label><Input name="contactNum" defaultValue={selectedStudent.contactNum} className="bg-stone-50" /></div>
                                                <div className="space-y-2"><Label>Personal Email</Label><Input name="personalEmail" defaultValue={selectedStudent.personalEmail} className="bg-stone-50" /></div>
                                            </div>
                                        </TabsContent>

                                        {/* TAB 4: FAMILY */}
                                        <TabsContent value="family" className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                                            <div className="space-y-2"><Label>Father's Name</Label><Input name="father" defaultValue={selectedStudent.father} className="bg-stone-50" /></div>
                                            <div className="space-y-2"><Label>Mother's Name</Label><Input name="mother" defaultValue={selectedStudent.mother} className="bg-stone-50" /></div>
                                            <div className="space-y-2"><Label>Guardian (If applicable)</Label><Input name="guardian" defaultValue={selectedStudent.guardian} className="bg-stone-50" /></div>
                                        </TabsContent>
                                    </Tabs>
                                </form>
                            </div>
                        ) : (
                            /* VIEW MODE (PREVIEW) */
                            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                                
                                {/* LEFT: YEARBOOK VISUAL */}
                                <div className="w-full md:w-5/12 bg-stone-100 p-8 flex flex-col items-center justify-center border-r border-stone-100 relative">
                                     {/* Background Pattern */}
                                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                    
                                    <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500 ease-out group">
                                            {/* Main Photo */}
                                            <div className="w-full max-w-[260px] aspect-[4/5] bg-white p-3 shadow-2xl rotate-1 border-2 border-stone-200 relative z-10 rounded-sm">
                                                <img src={selectedStudent.photo} className="w-full h-full object-cover bg-stone-200 filter contrast-105" alt="Student" />
                                                
                                                {/* Corner Accent */}
                                                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-amber-500 z-20"></div>
                                                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-amber-500 z-20"></div>

                                                {/* PHOTO EDIT BUTTON OVERLAY */}
                                                {isEditing && (
                                                    <div 
                                                        className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                        onClick={() => studentPhotoInputRef.current?.click()}
                                                    >
                                                        <div className="bg-white p-3 rounded-full shadow-lg">
                                                            <Camera className="w-6 h-6 text-stone-800" />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Hidden File Input for Student Photo */}
                                                <input 
                                                    type="file" 
                                                    ref={studentPhotoInputRef} 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={handleStudentPhotoChange}
                                                />
                                            </div>

                                            {/* Theme Photo (Layag) - Small box overlay */}
                                            <div className="absolute -bottom-6 -right-8 w-28 h-36 bg-stone-50 p-1 shadow-lg -rotate-6 border border-stone-200 z-20 hidden lg:block">
                                                <div className="w-full h-full bg-amber-100/50 border border-amber-200 flex flex-col items-center justify-center text-center">
                                                    <ImageIcon className="text-amber-600 w-6 h-6 mb-1" />
                                                    <span className="text-[8px] font-bold text-amber-800 uppercase tracking-widest">Theme</span>
                                                    <span className="text-[10px] font-serif text-amber-900 font-bold">Layag</span>
                                                </div>
                                            </div>
                                    </div>

                                    <div className="text-center space-y-4 max-w-sm relative z-10 mt-4">
                                            <div>
                                                <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight uppercase tracking-wide">
                                                    {selectedStudent.fname} {selectedStudent.mname?.charAt(0)}. {selectedStudent.lname} {selectedStudent.suffix}
                                                </h2>
                                                <p className="text-amber-600 font-serif italic text-lg mt-2 font-medium">{selectedStudent.nickname}</p>
                                            </div>
                                    </div>
                                </div>

                                {/* RIGHT: DETAILED DATA */}
                                <div className="flex-1 p-8 overflow-y-auto bg-white">
                                    <div className="space-y-8">
                                            
                                            {/* SECTION: ACADEMIC */}
                                            <div>
                                                <h3 className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-4">
                                                    <GraduationCap size={14}/> Academic Profile
                                                </h3>
                                                <div className="grid grid-cols-1 gap-6 p-6 bg-stone-50 rounded-2xl border border-stone-100 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full opacity-50"></div>
                                                    
                                                    <div>
                                                        <span className="text-[10px] uppercase text-stone-400 font-bold block mb-1">Course</span>
                                                        <span className="font-bold text-stone-800 text-lg leading-snug">{selectedStudent.course}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-[10px] uppercase text-stone-400 font-bold block mb-1">Major</span>
                                                            <span className="text-sm font-medium text-stone-700">{selectedStudent.major || "N/A"}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] uppercase text-stone-400 font-bold block mb-1">ID Number</span>
                                                            <span className="text-sm font-mono text-stone-700 bg-white px-2 py-1 rounded border border-stone-200 inline-block">{selectedStudent.id}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-stone-400 font-bold block mb-1">Thesis Title</span>
                                                        <span className="text-sm italic text-stone-700 font-medium">"{selectedStudent.thesis}"</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SECTION: PERSONAL & FAMILY */}
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-4">
                                                        <User size={14}/> Personal & Family
                                                    </h3>
                                                    <div className="space-y-3 text-sm text-stone-600 p-5 rounded-2xl border border-stone-100">
                                                        <p className="flex justify-between border-b border-stone-100 pb-2"><span className="font-bold text-stone-400 text-xs">DOB</span> <span>{selectedStudent.birthdate}</span></p>
                                                        <p className="flex justify-between border-b border-stone-100 pb-2"><span className="font-bold text-stone-400 text-xs">Father</span> <span>{selectedStudent.father || "-"}</span></p>
                                                        <p className="flex justify-between border-b border-stone-100 pb-2"><span className="font-bold text-stone-400 text-xs">Mother</span> <span>{selectedStudent.mother || "-"}</span></p>
                                                        <p className="flex justify-between"><span className="font-bold text-stone-400 text-xs">Guardian</span> <span>{selectedStudent.guardian || "-"}</span></p>
                                                    </div>
                                                </div>

                                                {/* SECTION: CONTACT */}
                                                <div>
                                                    <h3 className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-4">
                                                        <MapPin size={14}/> Contact
                                                    </h3>
                                                    <div className="space-y-4 text-sm text-stone-600 p-5 rounded-2xl border border-stone-100">
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Home size={14}/></div>
                                                            <div>
                                                                <span className="text-[10px] text-stone-400 font-bold uppercase block">Address</span>
                                                                {selectedStudent.barangay}, {selectedStudent.city}, {selectedStudent.province}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Phone size={14}/></div>
                                                            <div>
                                                                <span className="text-[10px] text-stone-400 font-bold uppercase block">Phone</span>
                                                                {selectedStudent.contactNum}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Mail size={14}/></div>
                                                            <div>
                                                                <span className="text-[10px] text-stone-400 font-bold uppercase block">Email</span>
                                                                {selectedStudent.personalEmail}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                    </div>
                                </div>
                            </div>
                        )}

                      {/* ACTION FOOTER */}
                      <CardFooter className="border-t border-stone-200 bg-stone-50 p-4 flex justify-between items-center z-20">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(true)} 
                          disabled={isEditing}
                          className="border-stone-300 text-stone-600 hover:bg-white hover:text-amber-700"
                        >
                          <Edit3 size={16} className="mr-2"/> Edit Information
                        </Button>

                        <Button 
                          onClick={handleFinalize} 
                          disabled={isEditing}
                          className={`min-w-[160px] shadow-lg shadow-amber-900/10 ${selectedStudent.status === 'verified' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-900 hover:bg-amber-800'}`}
                        >
                          {selectedStudent.status === 'verified' ? (
                            <><CheckCircle2 size={18} className="mr-2"/> Verified</>
                          ) : (
                            <><Save size={18} className="mr-2"/> Final Submit</>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl bg-white">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                        <User size={40} className="opacity-20" />
                    </div>
                    <p className="font-serif text-lg text-stone-500">Select a graduate to verify details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === VIEW 2: NOTES === */}
        {activeTab === "notes" && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Staff Notes</h1>
            <p className="text-stone-500 mb-8">Private sticky notes for your reminders and tasks.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Add New Note Card */}
              <div className="aspect-square rounded-xl border-2 border-dashed border-stone-300 flex flex-col p-4 bg-stone-50 hover:bg-stone-100 transition-colors">
                <Textarea 
                  placeholder="Type a new note here..." 
                  className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 mb-2 text-lg font-serif"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={addNote} disabled={!newNote.trim()} className="w-full bg-stone-800 text-white shadow-md hover:bg-stone-700">
                  <Plus size={16} className="mr-2"/> Add Note
                </Button>
              </div>

              {/* Note List */}
              {notes.map((note) => (
                <div 
                    key={note.id} 
                    className={`aspect-square rounded-xl p-6 shadow-md relative group flex flex-col ${note.color} rotate-1 hover:rotate-0 transition-transform duration-300`}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => onTouchEnd(note.id)}
                >
                  <button 
                    onClick={() => setNoteToDelete(note.id)}
                    className="absolute top-2 right-2 p-2 bg-black/5 hover:bg-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all text-stone-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-yellow-200/50 blur-sm"></div>
                  <p className="text-stone-800 font-medium font-serif leading-relaxed flex-1 overflow-auto text-lg pt-2">
                    {note.content}
                  </p>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-4 opacity-50 border-t border-stone-400/20 pt-2 flex justify-between">
                      <span>Staff Only</span>
                      <span className="md:hidden text-stone-400 text-[9px] italic">Swipe left to delete</span>
                  </span>
                </div>
              ))}
            </div>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={noteToDelete !== null} onOpenChange={(open) => !open && setNoteToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Note?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. Are you sure you want to delete this sticky note?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setNoteToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDeleteNote}>Delete Note</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        )}

        {/* === VIEW 3: PROFILE (NOW EDITABLE) === */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-10">
            <Card className="shadow-2xl border-t-8 border-amber-600 rounded-3xl overflow-hidden">
              {isProfileEditing ? (
                  <form onSubmit={handleProfileSave}>
                      <CardHeader className="text-center pb-8 border-b border-stone-100 bg-stone-50">
                        <div className="w-32 h-32 mx-auto mb-4 relative group cursor-pointer" onClick={() => profileFileInputRef.current?.click()}>
                          <Avatar className="w-full h-full border-[6px] border-white shadow-xl group-hover:opacity-80 transition-opacity">
                            <AvatarImage src={staffUser.avatar} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-stone-200 text-stone-400">ST</AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-full transition-opacity">
                             <Camera className="text-white w-10 h-10" />
                          </div>
                          <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={handleProfilePhotoChange}/>
                        </div>
                        <div className="space-y-3 max-w-sm mx-auto">
                            <Input name="staffName" defaultValue={staffUser.name} className="text-center font-bold text-2xl font-serif bg-white shadow-sm" placeholder="Name" />
                            <Input name="staffRole" defaultValue={staffUser.role} className="text-center text-sm text-stone-500 bg-white shadow-sm" placeholder="Role" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest text-stone-400 font-bold">Department</Label>
                            <Input name="staffDept" defaultValue={staffUser.department} className="bg-stone-50 h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest text-stone-400 font-bold">Email</Label>
                            <Input name="staffEmail" defaultValue={staffUser.email} className="bg-stone-50 h-12" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-stone-50 p-6 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsProfileEditing(false)}>Cancel</Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8 shadow-lg shadow-green-900/20">Save Profile</Button>
                      </CardFooter>
                  </form>
              ) : (
                  <>
                    <CardHeader className="text-center pb-10 border-b border-stone-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-stone-50">
                        <div className="w-32 h-32 mx-auto mb-6 relative">
                        <Avatar className="w-full h-full border-[6px] border-white shadow-xl">
                            <AvatarImage src={staffUser.avatar} className="object-cover"/>
                            <AvatarFallback className="text-4xl bg-stone-200 text-stone-400">ST</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-1 right-1 bg-green-500 w-8 h-8 rounded-full border-[4px] border-white"></div>
                        </div>
                        <CardTitle className="text-3xl font-serif text-stone-900 mb-1">{staffUser.name}</CardTitle>
                        <CardDescription className="text-stone-500 font-medium uppercase tracking-widest text-xs">{staffUser.role}</CardDescription>
                        <div className="mt-4">
                           <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 px-3 py-1">{staffUser.id}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Department</Label>
                            <p className="font-medium text-stone-800 text-lg">{staffUser.department}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Access Level</Label>
                            <p className="font-medium text-stone-800 text-lg">Editor / Scanner</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <Label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Email</Label>
                            <p className="font-medium text-stone-800 text-lg border-b border-stone-100 pb-2">{staffUser.email}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Joined</Label>
                            <p className="font-medium text-stone-800">September 2024</p>
                        </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-stone-50 p-6 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-stone-400 text-xs">
                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                           Last login: Today at 8:00 AM
                        </div>
                        <Button variant="outline" onClick={() => setIsProfileEditing(true)} className="border-stone-300 hover:bg-white hover:text-amber-900">Edit Profile</Button>
                    </CardFooter>
                  </>
              )}
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}