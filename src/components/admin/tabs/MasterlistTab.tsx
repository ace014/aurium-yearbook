"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, GraduationCap, FileText, MapPin, Phone, Mail, UserCheck, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- MOCK DATA ---
const MOCK_MASTER_LIST = [
  {
    id: "rac-1", idNumber: "2019-00101", lname: "Abad", fname: "Anthony", mname: "J.", department: "College of Computing & Information Sciences", program: "BS Computer Science", statusStep: 6, 
    details: { address: "Prk. 1, Apokon, Tagum City", contact: "09123456789", email: "anthony@gmail.com", thesis: "AI-Driven Crop Yield Prediction", guardian: "Mrs. Abad" }
  },
  {
    id: "rac-2", idNumber: "2019-00105", lname: "Corpuz", fname: "Bea", mname: "L.", department: "College of Computing & Information Sciences", program: "BS Information Technology", statusStep: 3, 
    details: { address: "Visayan Village, Tagum City", contact: "09987654321", email: "bea@yahoo.com", thesis: "Automated Library System", guardian: "Mr. Corpuz" }
  },
  {
    id: "rac-3", idNumber: "2019-00201", lname: "Santos", fname: "Carlos", mname: "M.", department: "College of Business Administration", program: "BS Accountancy", statusStep: 2, 
    details: { address: "Mankilam, Tagum City", contact: "09123456789", email: "carlos@gmail.com", thesis: "Impact of TRAIN Law on SMEs", guardian: "Mrs. Santos" }
  }
];

const STATUS_STEPS = [
  { id: 1, label: "Pre-Registered" }, { id: 2, label: "Verified" }, { id: 3, label: "Pictorial Scheduled" },
  { id: 4, label: "Attendance" }, { id: 5, label: "Info Finalized" }, { id: 6, label: "Pictorial" },
];

export function MasterlistTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const groupedMasterlist = useMemo(() => {
    const filtered = MOCK_MASTER_LIST.filter(s => 
      s.lname.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.fname.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.idNumber.includes(searchQuery)
    );

    const groups: Record<string, Record<string, typeof MOCK_MASTER_LIST>> = {};
    
    filtered.forEach(student => {
      if (!groups[student.department]) groups[student.department] = {};
      if (!groups[student.department][student.program]) groups[student.department][student.program] = [];
      groups[student.department][student.program].push(student);
    });

    return groups;
  }, [searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <div><h2 className="text-lg font-bold text-stone-800">RAC Verified Masterlist</h2><p className="text-sm text-stone-500">Official list of candidates.</p></div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">{MOCK_MASTER_LIST.length} Records</Badge>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input placeholder="Search by Name or ID..." className="pl-10 h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
        </div>

        <div className="space-y-8">
            {Object.keys(groupedMasterlist).length === 0 && <div className="text-center py-12 text-stone-400">No students found.</div>}
            {Object.keys(groupedMasterlist).sort().map((dept) => (
                <div key={dept} className="space-y-4">
                    <div className="sticky top-0 z-10 bg-[#FDFBF7]/95 backdrop-blur py-2 border-b border-amber-200/50">
                        <h3 className="text-lg font-serif font-bold text-amber-900 flex items-center gap-2"><BookOpen className="h-5 w-5" /> {dept}</h3>
                    </div>
                    {Object.keys(groupedMasterlist[dept]).sort().map((program) => (
                        <div key={program} className="pl-4 border-l-2 border-stone-200 space-y-3">
                            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2 mt-4 mb-2"><GraduationCap className="h-4 w-4" /> {program}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {groupedMasterlist[dept][program].map((student) => (
                                    <div key={student.id} onClick={() => setSelectedStudent(student)} className="group bg-white p-4 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex justify-between items-center">
                                        <div><p className="font-bold text-stone-800 group-hover:text-amber-800 transition-colors text-sm">{student.lname}, {student.fname} {student.mname}</p><p className="text-xs font-mono text-stone-500 mt-1 bg-stone-50 inline-block px-1 rounded">{student.idNumber}</p></div>
                                        <div className="flex items-center gap-2"><Badge className={`text-[10px] ${student.statusStep >= 6 ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : 'bg-stone-100 text-stone-600 hover:bg-stone-100 border-stone-200'}`}>{student.statusStep >= 6 ? 'Done' : 'Active'}</Badge><ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-amber-500" /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>

        {/* DETAILS MODAL */}
        <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
            <DialogContent className="max-w-3xl">
                {selectedStudent && (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4 text-sm text-stone-600">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif text-amber-950">{selectedStudent.lname}, {selectedStudent.fname}</DialogTitle>
                                <DialogDescription className="font-mono">ID: {selectedStudent.idNumber}</DialogDescription>
                            </DialogHeader>
                            <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 space-y-2">
                                <div className="flex items-center gap-3"><MapPin size={16}/> {selectedStudent.details.address}</div>
                                <div className="flex items-center gap-3"><Phone size={16}/> {selectedStudent.details.contact}</div>
                                <div className="flex items-center gap-3"><Mail size={16}/> {selectedStudent.details.email}</div>
                                <div className="flex items-start gap-3"><FileText size={16}/> <span className="italic">"{selectedStudent.details.thesis}"</span></div>
                            </div>
                        </div>
                        <div className="w-full md:w-64 bg-stone-50 p-6 rounded-xl border border-stone-200">
                             <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><Clock size={16} /> Status</h3>
                             <div className="space-y-3">
                                {STATUS_STEPS.map((step, index) => {
                                    const isDone = step.id <= selectedStudent.statusStep;
                                    return (
                                        <div key={step.id} className="flex gap-3 relative">
                                            {index < STATUS_STEPS.length - 1 && <div className={`absolute left-[7px] top-4 bottom-[-12px] w-0.5 ${isDone ? 'bg-green-300' : 'bg-stone-200'}`}></div>}
                                            <div className={`z-10 w-4 h-4 rounded-full flex items-center justify-center border ${isDone ? 'bg-green-100 border-green-500' : 'bg-white border-stone-300'}`}>{isDone && <div className="w-2 h-2 bg-green-500 rounded-full"/>}</div>
                                            <span className={`text-xs ${isDone ? 'text-stone-800 font-bold' : 'text-stone-400'}`}>{step.label}</span>
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