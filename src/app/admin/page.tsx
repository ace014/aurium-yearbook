"use client";

import { useState } from "react";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Search, 
  Mail, 
  Plus, 
  Edit3, 
  ShieldCheck, 
  MoreHorizontal,
  LogOut,
  Bell
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- MOCK DATA (Simulating Database) ---
const MOCK_PENDING_STUDENTS = [
  { id: "101", idNumber: "2020-00123", name: "Juan Dela Cruz", program: "BSCS", personalEmail: "juan@gmail.com", umEmail: "202000123@umindanao.edu.ph", status: "pending" },
  { id: "102", idNumber: "2020-00456", name: "Maria Clara", program: "BSBA", personalEmail: "maria@yahoo.com", umEmail: "202000456@umindanao.edu.ph", status: "pending" },
  { id: "103", idNumber: "2021-00789", name: "Pedro Penduko", program: "BSED", personalEmail: "pedro@gmail.com", umEmail: "202100789@umindanao.edu.ph", status: "pending" },
];

const MOCK_SCHEDULES = [
  { date: "2026-03-15", amSlots: 50, amBooked: 48, pmSlots: 50, pmBooked: 12 },
  { date: "2026-03-16", amSlots: 50, amBooked: 50, pmSlots: 50, pmBooked: 50 }, // Full day
];

// --- MAIN COMPONENT ---
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("verification");
  const [pendingStudents, setPendingStudents] = useState(MOCK_PENDING_STUDENTS);
  const [verifiedStudents, setVerifiedStudents] = useState<any[]>([]);
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  
  // Quick Search State
  const [searchQuery, setSearchQuery] = useState("");

  // --- ACTIONS: VERIFICATION ---
  const handleVerify = (studentId: string) => {
    const student = pendingStudents.find(s => s.id === studentId);
    if (!student) return;

    // 1. Move to verified list
    setPendingStudents(prev => prev.filter(s => s.id !== studentId));
    setVerifiedStudents(prev => [...prev, { ...student, status: "verified" }]);

    // 2. Simulate Sending Emails
    console.log(`📧 SENDING CREDENTIALS TO:`);
    console.log(`   - Personal: ${student.personalEmail}`);
    console.log(`   - UM Email: ${student.umEmail}`);
    
    alert(`Verified ${student.name}! Credentials sent to emails.`);
  };

  const handleBulkVerify = () => {
    // Logic for verifying matching IDs from the search bar
    const match = pendingStudents.find(s => s.idNumber.includes(searchQuery));
    if (match) {
        handleVerify(match.id);
        setSearchQuery(""); // Clear search
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

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-amber-950 text-amber-50 hidden md:flex flex-col shadow-xl">
        <div className="p-6 border-b border-amber-900/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center font-serif font-bold text-xl text-white shadow-inner">A</div>
            <div>
                <h2 className="font-bold tracking-wider text-amber-50">AURIUM</h2>
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">Moderator Panel</p>
            </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <Button variant="ghost" className={`w-full justify-start transition-all duration-200 ${activeTab === 'verification' ? 'bg-amber-900/50 text-white shadow-sm' : 'text-amber-200 hover:text-white hover:bg-amber-900/30'}`} onClick={() => setActiveTab("verification")}>
                <Users className="mr-3 h-5 w-5" /> Student Verification
            </Button>
            <Button variant="ghost" className={`w-full justify-start transition-all duration-200 ${activeTab === 'slots' ? 'bg-amber-900/50 text-white shadow-sm' : 'text-amber-200 hover:text-white hover:bg-amber-900/30'}`} onClick={() => setActiveTab("slots")}>
                <Calendar className="mr-3 h-5 w-5" /> Pictorial Schedules
            </Button>
        </nav>

        <div className="p-4 border-t border-amber-900/50 bg-amber-950">
            <div className="flex items-center gap-3 mb-4 px-2">
                <Avatar className="h-9 w-9 border border-amber-700">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-[10px] text-amber-400">Head Moderator</p>
                </div>
            </div>
            <Button variant="outline" className="w-full border-amber-800 bg-transparent hover:bg-amber-900 text-amber-100 text-xs">
                <LogOut className="mr-2 h-3 w-3" /> Log Out
            </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto bg-stone-50/50">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 h-16 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm/50">
            <h1 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                {activeTab === 'verification' ? <Users className="h-5 w-5 text-amber-700"/> : <Calendar className="h-5 w-5 text-amber-700"/>}
                {activeTab === 'verification' ? 'Verification Queue' : 'Schedule Manager'}
            </h1>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-stone-400 hover:text-amber-800 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </Button>
            </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
            
            {/* --- TAB 1: STUDENT VERIFICATION --- */}
            {activeTab === 'verification' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white border-amber-200 border-l-4 border-l-amber-600 shadow-sm">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-amber-900 uppercase tracking-wide">Pending Approval</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-bold text-amber-700">{pendingStudents.length}</div></CardContent>
                        </Card>
                        <Card className="bg-white border-stone-200 shadow-sm">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wide">Total Verified</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-bold text-stone-700">{verifiedStudents.length}</div></CardContent>
                        </Card>
                    </div>

                    {/* Quick Verify Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                        <div className="flex-1 space-y-2 w-full">
                            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Quick Verify by ID Number (RAC List)</Label>
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
                        <Button className="h-11 px-6 bg-amber-900 hover:bg-amber-800 text-white shadow-md shadow-amber-900/10" onClick={handleBulkVerify}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Verify Student
                        </Button>
                    </div>

                    {/* Pending List */}
                    <Card className="border-stone-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif text-stone-800">Pre-Registered Students</CardTitle>
                            <CardDescription>Verify these students against the RAC Graduation List.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingStudents.length === 0 ? (
                                    <div className="text-center py-12 bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <CheckCircle className="mx-auto h-10 w-10 text-stone-300 mb-3"/>
                                        <p className="text-stone-400 font-medium">All caught up! No pending students.</p>
                                    </div>
                                ) : (
                                    pendingStudents.map((student) => (
                                        <div key={student.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-stone-100 rounded-lg bg-white hover:border-amber-200 transition-all shadow-sm">
                                            <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                                                <div className="h-10 w-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-bold text-xs">
                                                    {student.program.substring(0,2)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-stone-800">{student.name}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                                                        <span className="bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded text-stone-700 font-mono font-medium">{student.idNumber}</span>
                                                        <span>•</span>
                                                        <span>{student.program}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <div className="hidden md:block text-right mr-4">
                                                    <p className="text-[10px] uppercase tracking-wide text-stone-400 font-bold">Send credentials to:</p>
                                                    <p className="text-xs font-medium text-stone-600">{student.personalEmail}</p>
                                                </div>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto shadow-sm" onClick={() => handleVerify(student.id)}>
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

            {/* --- TAB 2: SLOT MANAGEMENT --- */}
            {activeTab === 'slots' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-stone-800">Pictorial Availability</h2>
                            <p className="text-stone-500 text-sm">Manage capacity for morning and afternoon sessions.</p>
                        </div>
                        <Button className="bg-amber-900 hover:bg-amber-800 shadow-lg shadow-amber-900/20">
                            <Plus className="mr-2 h-4 w-4" /> Add New Date
                        </Button>
                    </div>

                    <div className="grid gap-6">
                        {schedules.map((day, idx) => (
                            <Card key={idx} className="overflow-hidden border-t-4 border-t-amber-600 shadow-md">
                                <CardHeader className="bg-stone-50/80 pb-4 border-b border-stone-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2 font-serif">
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
                                        
                                        {/* MORNING SLOT */}
                                        <div className="space-y-4 p-4 rounded-lg border border-stone-100 bg-amber-50/30">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-stone-700 flex items-center gap-2">
                                                    🌤️ Morning Session <span className="text-xs font-normal text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200">8:00 AM - 12:00 PM</span>
                                                </h4>
                                                
                                                {/* MODERATOR OVERRIDE MODAL */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-stone-400 hover:text-amber-700 hover:bg-amber-100 rounded-full transition-colors"><Edit3 className="h-3.5 w-3.5" /></Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Modify Morning Capacity</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="py-4 space-y-4">
                                                            <div className="space-y-2">
                                                                <Label>Total Slots Available</Label>
                                                                <Input type="number" defaultValue={day.amSlots} onChange={(e) => handleUpdateCapacity(day.date, 'am', parseInt(e.target.value))} />
                                                                <p className="text-xs text-stone-500">Increasing this will allow more students to book immediately.</p>
                                                            </div>
                                                        </div>
                                                        <DialogFooter><Button className="bg-amber-900">Save Changes</Button></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className={day.amBooked >= day.amSlots ? "text-red-600 font-bold" : "text-amber-700"}>{day.amBooked} Booked</span>
                                                    <span className="text-stone-400">Limit: {day.amSlots}</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-100">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 shadow-sm ${day.amBooked >= day.amSlots ? "bg-red-500" : "bg-amber-500"}`} 
                                                        style={{ width: `${(day.amBooked / day.amSlots) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Action: Manual Add */}
                                            <Button variant="outline" size="sm" className="w-full text-xs border-dashed border-stone-300 text-stone-500 hover:text-amber-800 hover:border-amber-300 hover:bg-amber-50">
                                                <Plus className="mr-1 h-3 w-3" /> Manually Add Student to AM
                                            </Button>
                                        </div>

                                        {/* AFTERNOON SLOT */}
                                        <div className="space-y-4 p-4 rounded-lg border border-stone-100 bg-blue-50/30">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-stone-700 flex items-center gap-2">
                                                    ☀️ Afternoon Session <span className="text-xs font-normal text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200">1:00 PM - 5:00 PM</span>
                                                </h4>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-stone-400 hover:text-amber-700 hover:bg-amber-100 rounded-full transition-colors"><Edit3 className="h-3.5 w-3.5" /></Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Modify Afternoon Capacity</DialogTitle></DialogHeader>
                                                        <div className="py-4 space-y-4">
                                                            <div className="space-y-2">
                                                                <Label>Total Slots Available</Label>
                                                                <Input type="number" defaultValue={day.pmSlots} onChange={(e) => handleUpdateCapacity(day.date, 'pm', parseInt(e.target.value))} />
                                                            </div>
                                                        </div>
                                                        <DialogFooter><Button className="bg-amber-900">Save Changes</Button></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className={day.pmBooked >= day.pmSlots ? "text-red-600 font-bold" : "text-blue-700"}>{day.pmBooked} Booked</span>
                                                    <span className="text-stone-400">Limit: {day.pmSlots}</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-100">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 shadow-sm ${day.pmBooked >= day.pmSlots ? "bg-red-500" : "bg-blue-500"}`} 
                                                        style={{ width: `${(day.pmBooked / day.pmSlots) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <Button variant="outline" size="sm" className="w-full text-xs border-dashed border-stone-300 text-stone-500 hover:text-blue-800 hover:border-blue-300 hover:bg-blue-50">
                                                <Plus className="mr-1 h-3 w-3" /> Manually Add Student to PM
                                            </Button>
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
    </div>
  );
}