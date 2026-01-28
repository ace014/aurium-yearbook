"use client";

import { useState } from "react";
import Link from "next/link";
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
  Image as ImageIcon
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

// --- MOCK DATA ---
const STAFF_USER = {
  name: "Ms. Sarah Jenkins",
  role: "Yearbook Coordinator",
  id: "STF-2026-01",
  avatar: "https://github.com/shadcn.png"
};

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
    umEmail: "202000123.tc@umindanao.edu.ph",

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
    umEmail: "202000456.tc@umindanao.edu.ph",
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
  { id: 1, content: "Remember to check honor titles for BSCS students.", color: "bg-yellow-100" },
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

  // --- ACTIONS ---

  // Handle Edit Save
  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const timestamp = new Date().toLocaleString();

    // LOGIC FIX:
    // We only extract fields that actually exist in the form.
    // If a field is missing from the form (like 'quote' which we removed), 
    // we should NOT try to update it, otherwise it might overwrite existing data with null/undefined.
    
    // However, since we removed 'quote' from the UI completely, we don't need to save it.
    // We explicitly map the form fields to the state keys.
    
    const updates = {
        fname: (formData.get("fname") as string) || selectedStudent.fname,
        lname: (formData.get("lname") as string) || selectedStudent.lname,
        mname: (formData.get("mname") as string) || selectedStudent.mname,
        suffix: (formData.get("suffix") as string) || "", // Suffix can be empty
        nickname: (formData.get("nickname") as string) || "",
        
        course: (formData.get("course") as string) || selectedStudent.course,
        major: (formData.get("major") as string) || selectedStudent.major,
        thesis: (formData.get("thesis") as string) || selectedStudent.thesis,
        
        province: (formData.get("province") as string) || selectedStudent.province,
        city: (formData.get("city") as string) || selectedStudent.city,
        barangay: (formData.get("barangay") as string) || selectedStudent.barangay,
        
        contactNum: (formData.get("contactNum") as string) || selectedStudent.contactNum,
        personalEmail: (formData.get("personalEmail") as string) || selectedStudent.personalEmail,
        umEmail: (formData.get("umEmail") as string) || selectedStudent.umEmail,
        
        father: (formData.get("father") as string) || selectedStudent.father,
        mother: (formData.get("mother") as string) || selectedStudent.mother,
        guardian: (formData.get("guardian") as string) || "",

        status: "verified",
        last_edited_by: STAFF_USER.name,
        last_edited_at: timestamp
    };

    // Update Main State
    setGraduates(prev => prev.map(g => 
      g.id === selectedStudent.id ? { ...g, ...updates } : g
    ));

    // Update Selected View
    setSelectedStudent((prev: any) => ({ ...prev, ...updates }));
    setIsEditing(false);
  };

  // Handle "Final Verify" click
  const handleFinalize = () => {
    const timestamp = new Date().toLocaleString();
    const update = {
        status: "verified", 
        last_edited_by: STAFF_USER.name,
        last_edited_at: timestamp 
    };

    setGraduates(prev => prev.map(g => 
        g.id === selectedStudent.id ? { ...g, ...update } : g
    ));
      
    setSelectedStudent((prev: any) => ({ ...prev, ...update }));
  };

  // Handle Notes
  const addNote = () => {
    if(!newNote.trim()) return;
    setNotes(prev => [...prev, { id: Date.now(), content: newNote, color: "bg-yellow-100" }]);
    setNewNote("");
  };

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Filter List
  const filteredGraduates = graduates.filter(g => 
    g.lname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.id.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-stone-900 text-stone-300 hidden md:flex flex-col h-screen fixed left-0 top-0 z-20">
        <div className="p-6 border-b border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold font-serif">A</div>
          <div>
            <h2 className="text-white font-bold tracking-wide">AURIUM</h2>
            <p className="text-[10px] uppercase text-stone-500 font-medium tracking-widest">Staff Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={activeTab === "verification" ? "secondary" : "ghost"} 
            className={`w-full justify-start gap-3 ${activeTab === "verification" ? "bg-amber-600 text-white hover:bg-amber-700" : "hover:text-white hover:bg-stone-800"}`}
            onClick={() => setActiveTab("verification")}
          >
            <Users size={18} /> Graduate Verification
          </Button>
          
          <Button 
            variant={activeTab === "notes" ? "secondary" : "ghost"} 
            className={`w-full justify-start gap-3 ${activeTab === "notes" ? "bg-amber-600 text-white hover:bg-amber-700" : "hover:text-white hover:bg-stone-800"}`}
            onClick={() => setActiveTab("notes")}
          >
            <StickyNote size={18} /> Staff Notes
          </Button>

          <Button 
            variant={activeTab === "profile" ? "secondary" : "ghost"} 
            className={`w-full justify-start gap-3 ${activeTab === "profile" ? "bg-amber-600 text-white hover:bg-amber-700" : "hover:text-white hover:bg-stone-800"}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} /> My Profile
          </Button>

          <div className="pt-4 mt-4 border-t border-stone-800">
            <Link href="/admin/scanner">
              <Button variant="ghost" className="w-full justify-start gap-3 text-stone-400 hover:text-green-400 hover:bg-stone-800">
                <ScanLine size={18} /> Attendance Scanner
              </Button>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={STAFF_USER.avatar} />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{STAFF_USER.name}</p>
              <p className="text-xs text-stone-500 truncate">{STAFF_USER.role}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
        
        {/* === VIEW 1: VERIFICATION === */}
        {activeTab === "verification" && (
          <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-stone-900">Graduate Verification</h1>
                <p className="text-stone-500 text-sm">Review, edit, and finalize graduate yearbook entries.</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input 
                  placeholder="Search by Name or ID..." 
                  className="pl-10 bg-white border-stone-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
              
              {/* LEFT: LIST (3 Cols) */}
              <Card className="lg:col-span-3 border-stone-200 shadow-sm flex flex-col overflow-hidden h-full">
                <CardHeader className="pb-3 border-b border-stone-100 bg-stone-50/50">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">Graduate Queue</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-1">
                    {filteredGraduates.map((grad) => (
                      <button 
                        key={grad.id}
                        onClick={() => { setSelectedStudent(grad); setIsEditing(false); }}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors border
                          ${selectedStudent?.id === grad.id 
                            ? "bg-amber-50 border-amber-200 ring-1 ring-amber-200" 
                            : "hover:bg-stone-50 border-transparent hover:border-stone-100"
                          }`}
                      >
                        <Avatar className="h-10 w-10 border border-stone-200">
                          <AvatarImage src={grad.photo} />
                          <AvatarFallback>{grad.fname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <p className="font-bold text-sm text-stone-900 truncate">{grad.fname} {grad.lname}</p>
                            {grad.status === "verified" && <CheckCircle2 size={14} className="text-green-600" />}
                          </div>
                          <p className="text-xs text-stone-500 font-mono truncate">{grad.id}</p>
                        </div>
                      </button>
                    ))}
                    {filteredGraduates.length === 0 && (
                      <div className="text-center py-10 text-stone-400 text-sm">No graduates found.</div>
                    )}
                  </div>
                </ScrollArea>
              </Card>

              {/* RIGHT: DETAILS (9 Cols) */}
              <div className="lg:col-span-9 h-full">
                {selectedStudent ? (
                  <div className="h-full flex flex-col">
                    {/* AUDIT TRAIL HEADER */}
                    <div className="bg-stone-100 border border-stone-200 rounded-t-xl p-3 flex justify-between items-center text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedStudent.status === 'verified' ? 'default' : 'outline'} className={selectedStudent.status === 'verified' ? 'bg-green-600 hover:bg-green-600' : 'text-stone-500'}>
                          {selectedStudent.status === 'verified' ? 'VERIFIED FINAL' : 'PENDING REVIEW'}
                        </Badge>
                      </div>
                      {selectedStudent.last_edited_by && (
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span>Last verified by <strong>{selectedStudent.last_edited_by}</strong> on {selectedStudent.last_edited_at}</span>
                        </div>
                      )}
                    </div>

                    {/* MAIN CARD */}
                    <Card className="rounded-t-none border-t-0 shadow-lg flex-1 flex flex-col bg-white relative overflow-hidden">
                        
                        {/* EDIT MODE */}
                        {isEditing ? (
                            <div className="flex-1 overflow-y-auto p-6 bg-stone-50">
                                <form id="edit-form" onSubmit={handleSaveEdit}>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                            <Edit3 size={20} className="text-amber-600"/> Edit Graduate Information
                                        </h2>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                                            <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Save Changes</Button>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="personal" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4 mb-6">
                                            <TabsTrigger value="personal">Personal</TabsTrigger>
                                            <TabsTrigger value="academic">Academic</TabsTrigger>
                                            <TabsTrigger value="contact">Contact & Address</TabsTrigger>
                                            <TabsTrigger value="family">Family</TabsTrigger>
                                        </TabsList>

                                        {/* TAB 1: PERSONAL */}
                                        <TabsContent value="personal" className="space-y-4 bg-white p-6 rounded-lg border border-stone-200">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2"><Label>First Name</Label><Input name="fname" defaultValue={selectedStudent.fname} /></div>
                                                <div className="space-y-2"><Label>Last Name</Label><Input name="lname" defaultValue={selectedStudent.lname} /></div>
                                                <div className="space-y-2"><Label>Middle Name</Label><Input name="mname" defaultValue={selectedStudent.mname} /></div>
                                                <div className="space-y-2"><Label>Suffix</Label><Input name="suffix" defaultValue={selectedStudent.suffix} /></div>
                                            </div>
                                            <div className="space-y-2"><Label>Nickname (with quotes)</Label><Input name="nickname" defaultValue={selectedStudent.nickname} /></div>
                                        </TabsContent>

                                        {/* TAB 2: ACADEMIC */}
                                        <TabsContent value="academic" className="space-y-4 bg-white p-6 rounded-lg border border-stone-200">
                                            <div className="space-y-2"><Label>Course</Label><Input name="course" defaultValue={selectedStudent.course} /></div>
                                            <div className="space-y-2"><Label>Major</Label><Input name="major" defaultValue={selectedStudent.major} /></div>
                                            <div className="space-y-2"><Label>Thesis Title</Label><Input name="thesis" defaultValue={selectedStudent.thesis} /></div>
                                        </TabsContent>

                                        {/* TAB 3: CONTACT & ADDRESS */}
                                        <TabsContent value="contact" className="space-y-4 bg-white p-6 rounded-lg border border-stone-200">
                                            <h4 className="font-bold text-stone-700 text-sm uppercase">Address</h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2"><Label>Province</Label><Input name="province" defaultValue={selectedStudent.province} /></div>
                                                <div className="space-y-2"><Label>City</Label><Input name="city" defaultValue={selectedStudent.city} /></div>
                                                <div className="space-y-2"><Label>Barangay</Label><Input name="barangay" defaultValue={selectedStudent.barangay} /></div>
                                            </div>
                                            <h4 className="font-bold text-stone-700 text-sm uppercase mt-4">Contact Info</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2"><Label>Mobile No.</Label><Input name="contactNum" defaultValue={selectedStudent.contactNum} /></div>
                                                <div className="space-y-2"><Label>Personal Email</Label><Input name="personalEmail" defaultValue={selectedStudent.personalEmail} /></div>
                                                <div className="space-y-2 col-span-2"><Label>UM Email</Label><Input name="umEmail" defaultValue={selectedStudent.umEmail} /></div>
                                            </div>
                                        </TabsContent>

                                        {/* TAB 4: FAMILY */}
                                        <TabsContent value="family" className="space-y-4 bg-white p-6 rounded-lg border border-stone-200">
                                            <div className="space-y-2"><Label>Father's Name</Label><Input name="father" defaultValue={selectedStudent.father} /></div>
                                            <div className="space-y-2"><Label>Mother's Name</Label><Input name="mother" defaultValue={selectedStudent.mother} /></div>
                                            <div className="space-y-2"><Label>Guardian (If applicable)</Label><Input name="guardian" defaultValue={selectedStudent.guardian} /></div>
                                        </TabsContent>
                                    </Tabs>
                                </form>
                            </div>
                        ) : (
                            /* VIEW MODE (PREVIEW) */
                            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                                
                                {/* LEFT: YEARBOOK VISUAL */}
                                <div className="w-full md:w-2/5 bg-stone-100 p-8 flex flex-col items-center justify-center border-r border-stone-100 relative">
                                    <div className="relative mb-8">
                                        {/* Main Photo */}
                                        <div className="w-full max-w-[240px] aspect-[4/5] bg-white p-2 shadow-xl rotate-1 border-4 border-white relative z-10">
                                            <img src={selectedStudent.photo} className="w-full h-full object-cover bg-stone-200" alt="Student" />
                                        </div>

                                        {/* Theme Photo (Layag) - Small box overlay */}
                                        <div className="absolute -bottom-4 -right-6 w-24 h-32 bg-white p-1 shadow-lg -rotate-3 border-4 border-white z-20">
                                            <div className="w-full h-full bg-amber-50 border border-amber-100 flex flex-col items-center justify-center text-center">
                                                <ImageIcon className="text-amber-300 w-6 h-6 mb-1" />
                                                <span className="text-[8px] font-bold text-amber-800 uppercase tracking-widest">Theme</span>
                                                <span className="text-[10px] font-serif text-amber-900 font-bold">Layag</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center space-y-4 max-w-xs relative z-10 mt-2">
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-stone-900 leading-tight uppercase">
                                                {selectedStudent.fname} {selectedStudent.mname?.charAt(0)}. {selectedStudent.lname} {selectedStudent.suffix}
                                            </h2>
                                            <p className="text-amber-600 font-serif italic mt-1">{selectedStudent.nickname}</p>
                                        </div>
                                    </div>
                                    {/* Decor */}
                                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-amber-600 to-amber-800"></div>
                                </div>

                                {/* RIGHT: DETAILED DATA */}
                                <div className="flex-1 p-8 overflow-y-auto bg-white">
                                    <div className="space-y-8">
                                        
                                        {/* SECTION: ACADEMIC */}
                                        <div>
                                            <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-wider mb-3">
                                                <GraduationCap size={16}/> Academic Information
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
                                                <div>
                                                    <span className="text-[10px] uppercase text-stone-400 font-bold block">Course</span>
                                                    <span className="font-bold text-stone-800">{selectedStudent.course}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-[10px] uppercase text-stone-400 font-bold block">Major</span>
                                                        <span className="text-sm text-stone-700">{selectedStudent.major || "N/A"}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-stone-400 font-bold block">ID Number</span>
                                                        <span className="text-sm font-mono text-stone-700">{selectedStudent.id}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase text-stone-400 font-bold block">Thesis Title</span>
                                                    <span className="text-sm italic text-stone-700">"{selectedStudent.thesis}"</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION: PERSONAL & FAMILY */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-wider mb-3">
                                                    <User size={16}/> Personal & Family
                                                </h3>
                                                <div className="space-y-2 text-sm text-stone-600">
                                                    <p><span className="font-bold text-stone-400 text-xs w-20 inline-block">DOB:</span> {selectedStudent.birthdate}</p>
                                                    <div className="h-px bg-stone-100 my-2"></div>
                                                    <p><span className="font-bold text-stone-400 text-xs w-20 inline-block">Father:</span> {selectedStudent.father || "-"}</p>
                                                    <p><span className="font-bold text-stone-400 text-xs w-20 inline-block">Mother:</span> {selectedStudent.mother || "-"}</p>
                                                    <p><span className="font-bold text-stone-400 text-xs w-20 inline-block">Guardian:</span> {selectedStudent.guardian || "-"}</p>
                                                </div>
                                            </div>

                                            {/* SECTION: CONTACT */}
                                            <div>
                                                <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-wider mb-3">
                                                    <MapPin size={16}/> Contact & Address
                                                </h3>
                                                <div className="space-y-2 text-sm text-stone-600">
                                                    <p className="flex items-start gap-2">
                                                        <Home size={14} className="mt-0.5 text-stone-400 shrink-0"/>
                                                        {selectedStudent.barangay}, {selectedStudent.city}, {selectedStudent.province}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <Phone size={14} className="text-stone-400 shrink-0"/>
                                                        {selectedStudent.contactNum}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <Mail size={14} className="text-stone-400 shrink-0"/>
                                                        {selectedStudent.personalEmail}
                                                    </p>
                                                    <p className="flex items-center gap-2 text-blue-600">
                                                        <BookOpen size={14} className="text-blue-400 shrink-0"/>
                                                        {selectedStudent.umEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}

                      {/* ACTION FOOTER */}
                      <CardFooter className="border-t border-stone-100 bg-stone-50 p-4 flex justify-between items-center z-20">
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
                          className={`min-w-[160px] shadow-lg ${selectedStudent.status === 'verified' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-900 hover:bg-amber-800'}`}
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
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                    <User size={64} className="mb-4 opacity-20" />
                    <p>Select a graduate to verify details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === VIEW 2: NOTES === */}
        {activeTab === "notes" && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Staff Notes</h1>
            <p className="text-stone-500 mb-8">Private sticky notes for your reminders and tasks.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Add New Note Card */}
              <div className="aspect-square rounded-xl border-2 border-dashed border-stone-300 flex flex-col p-4 bg-stone-50 hover:bg-stone-100 transition-colors">
                <Textarea 
                  placeholder="Type a new note here..." 
                  className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 mb-2"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={addNote} disabled={!newNote.trim()} className="w-full bg-stone-800 text-white">
                  <Plus size={16} className="mr-2"/> Add Note
                </Button>
              </div>

              {/* Note List */}
              {notes.map((note) => (
                <div key={note.id} className={`aspect-square rounded-xl p-5 shadow-sm relative group flex flex-col ${note.color}`}>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/5 hover:bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-stone-700"
                  >
                    <XCircle size={16} />
                  </button>
                  <p className="text-stone-800 font-medium font-serif leading-relaxed flex-1 overflow-auto">
                    {note.content}
                  </p>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-2 opacity-50">Staff Only</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === VIEW 3: PROFILE === */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-500 mt-10">
            <Card className="shadow-lg border-t-4 border-amber-600">
              <CardHeader className="text-center pb-8 border-b border-stone-100">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <Avatar className="w-full h-full border-4 border-white shadow-lg">
                    <AvatarImage src={STAFF_USER.avatar} />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>
                <CardTitle className="text-2xl font-serif text-stone-900">{STAFF_USER.name}</CardTitle>
                <CardDescription className="text-stone-500 font-medium">{STAFF_USER.role}</CardDescription>
                <Badge variant="secondary" className="mt-2">{STAFF_USER.id}</Badge>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-stone-400 font-bold">Department</Label>
                    <p className="font-medium text-stone-800">Student Affairs</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-stone-400 font-bold">Access Level</Label>
                    <p className="font-medium text-stone-800">Editor / Scanner</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-stone-400 font-bold">Email</Label>
                    <p className="font-medium text-stone-800">staff@aurium.edu.ph</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-stone-400 font-bold">Joined</Label>
                    <p className="font-medium text-stone-800">September 2024</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-stone-50 p-6 flex justify-between items-center">
                <span className="text-xs text-stone-400">Last login: Today at 8:00 AM</span>
                <Button variant="outline">Edit Profile</Button>
              </CardFooter>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}

// Helper component for Note deletion icon if not imported
function XCircle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}