"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  User, 
  ScanLine, 
  Search, 
  Edit3, 
  CheckCircle2, 
  Save, 
  Clock, 
  MoreHorizontal,
  LogOut,
  StickyNote,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
    name: "Juan Dela Cruz", 
    course: "BS Computer Science", 
    major: "Data Science", 
    quote: "It always seems impossible until it's done.", 
    photo: "https://github.com/shadcn.png",
    status: "pending", // pending, verified
    last_edited_by: null,
    last_edited_at: null
  },
  { 
    id: "2020-00456", 
    name: "Maria Clara", 
    course: "BS Business Admin", 
    major: "Marketing", 
    quote: "Keep your face always toward the sunshine.", 
    photo: "https://github.com/shadcn.png",
    status: "verified",
    last_edited_by: "Ms. Sarah Jenkins",
    last_edited_at: "2026-03-15 09:30 AM"
  },
  // Add more mock data if needed
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
  const handleSaveEdit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedName = formData.get("name") as string;
    const updatedQuote = formData.get("quote") as string;
    const updatedCourse = formData.get("course") as string;

    const timestamp = new Date().toLocaleString();

    setGraduates(prev => prev.map(g => 
      g.id === selectedStudent.id 
        ? { 
            ...g, 
            name: updatedName, 
            quote: updatedQuote, 
            course: updatedCourse,
            status: "verified", // Auto-verify on edit? Or keep verify separate? Let's verify.
            last_edited_by: STAFF_USER.name,
            last_edited_at: timestamp
          } 
        : g
    ));

    // Update the currently selected view
    setSelectedStudent((prev: any) => ({
      ...prev,
      name: updatedName,
      quote: updatedQuote,
      course: updatedCourse,
      status: "verified",
      last_edited_by: STAFF_USER.name,
      last_edited_at: timestamp
    }));

    setIsEditing(false);
  };

  // Handle "Final Verify" click
  const handleFinalize = () => {
    const timestamp = new Date().toLocaleString();
    setGraduates(prev => prev.map(g => 
        g.id === selectedStudent.id 
          ? { 
              ...g, 
              status: "verified", 
              last_edited_by: STAFF_USER.name,
              last_edited_at: timestamp 
            } 
          : g
      ));
      
      setSelectedStudent((prev: any) => ({
        ...prev,
        status: "verified",
        last_edited_by: STAFF_USER.name,
        last_edited_at: timestamp
      }));
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
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
          <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-stone-900">Graduate Verification</h1>
                <p className="text-stone-500 text-sm">Review, edit, and finalize graduate yearbook entries during pictorial.</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input 
                  placeholder="Search by name or ID..." 
                  className="pl-10 bg-white border-stone-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              
              {/* LIST COLUMN */}
              <Card className="col-span-1 lg:col-span-1 border-stone-200 shadow-sm flex flex-col overflow-hidden h-full">
                <CardHeader className="pb-3 border-b border-stone-100 bg-stone-50/50">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-700">Graduate Queue</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-1">
                    {filteredGraduates.map((grad) => (
                      <button 
                        key={grad.id}
                        onClick={() => setSelectedStudent(grad)}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors border
                          ${selectedStudent?.id === grad.id 
                            ? "bg-amber-50 border-amber-200 ring-1 ring-amber-200" 
                            : "hover:bg-stone-50 border-transparent hover:border-stone-100"
                          }`}
                      >
                        <Avatar className="h-10 w-10 border border-stone-200">
                          <AvatarImage src={grad.photo} />
                          <AvatarFallback>{grad.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <p className="font-bold text-sm text-stone-900 truncate">{grad.name}</p>
                            {grad.status === "verified" && <CheckCircle2 size={14} className="text-green-600" />}
                          </div>
                          <p className="text-xs text-stone-500 truncate">{grad.course}</p>
                        </div>
                      </button>
                    ))}
                    {filteredGraduates.length === 0 && (
                      <div className="text-center py-10 text-stone-400 text-sm">No graduates found.</div>
                    )}
                  </div>
                </ScrollArea>
              </Card>

              {/* PREVIEW/EDIT COLUMN */}
              <div className="col-span-1 lg:col-span-2 h-full">
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

                    {/* YEARBOOK PREVIEW CARD */}
                    <Card className="rounded-t-none border-t-0 shadow-lg flex-1 flex flex-col justify-center bg-white relative overflow-hidden">
                      {/* Background Decoration to mimic Yearbook page */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -z-0"></div>
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-stone-50 rounded-full blur-3xl -z-0"></div>

                      <CardContent className="z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 overflow-y-auto">
                        
                        {/* Student Photo */}
                        <div className="shrink-0 relative">
                          <div className="w-48 h-60 md:w-56 md:h-72 bg-stone-200 rounded-sm shadow-xl overflow-hidden border-4 border-white transform rotate-1">
                            <img src={selectedStudent.photo} alt={selectedStudent.name} className="w-full h-full object-cover" />
                          </div>
                          {/* University Logo Watermark Mockup */}
                          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-amber-900 rounded-full flex items-center justify-center text-white text-xs font-serif shadow-lg border-4 border-white">
                            LOGO
                          </div>
                        </div>

                        {/* Student Details (Yearbook Style) */}
                        <div className="flex-1 text-center md:text-left space-y-6">
                          
                          {isEditing ? (
                            <form id="edit-form" onSubmit={handleSaveEdit} className="space-y-4 bg-stone-50 p-4 rounded-lg border border-stone-200 text-left">
                              <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input name="name" defaultValue={selectedStudent.name} className="bg-white" required />
                              </div>
                              <div className="space-y-2">
                                <Label>Course & Major</Label>
                                <Input name="course" defaultValue={selectedStudent.course} className="bg-white" required />
                              </div>
                              <div className="space-y-2">
                                <Label>Yearbook Quote</Label>
                                <Textarea name="quote" defaultValue={selectedStudent.quote} className="bg-white h-24 italic" required />
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Save Changes</Button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 uppercase tracking-tight leading-none">
                                  {selectedStudent.name}
                                </h2>
                                <div className="h-1 w-20 bg-amber-500 mt-4 mx-auto md:mx-0"></div>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm font-bold tracking-widest uppercase text-amber-700">Program</p>
                                <p className="text-lg font-medium text-stone-700">{selectedStudent.course}</p>
                                {selectedStudent.major && <p className="text-stone-500 text-sm">Major in {selectedStudent.major}</p>}
                              </div>

                              <div className="pt-4">
                                <div className="relative p-6 bg-stone-50 rounded-xl border border-stone-100">
                                  <span className="absolute top-2 left-3 text-4xl text-amber-200 font-serif leading-none">“</span>
                                  <p className="font-serif italic text-stone-600 text-lg relative z-10 leading-relaxed">
                                    {selectedStudent.quote}
                                  </p>
                                  <span className="absolute bottom-[-10px] right-4 text-4xl text-amber-200 font-serif leading-none">”</span>
                                </div>
                              </div>
                            </>
                          )}

                        </div>
                      </CardContent>

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