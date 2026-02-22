"use client";

import { useState, useRef } from "react";
import { Search, Edit3, Save, Clock, MapPin, Home, Phone, Mail, GraduationCap, User, Image as ImageIcon, Upload, FolderOpen, ChevronDown, ChevronUp, AlertCircle, X, Check, Filter, CheckCircle2, BookOpen, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useGraduateReview } from "@/hooks/useGraduateReview"; 

interface VerificationTabProps {
  staffUser: any;
  selectedStudent: any;
  setSelectedStudent: (student: any) => void;
}

export function GraduateReviewTab({ staffUser, selectedStudent, setSelectedStudent }: VerificationTabProps) {
  
  // ipasa ang data sa hook para didto na ang logic ug filtering
  const {
    searchTerm,
    setSearchTerm,
    processedData,
    expandedDepts,
    toggleDept,
    isEditing,
    setIsEditing,
    handleSaveEdit,
    handlePhotoUpload,
    handleFinalize
  } = useGraduateReview(staffUser, selectedStudent, setSelectedStudent);

  // Local UI states para sa nested Course folders ug Pagination per course
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);
  const [coursePages, setCoursePages] = useState<Record<string, number>>({});
  
  // Gihimong 9 items per page para perfect 3x3 grid sa UI
  const ITEMS_PER_PAGE = 9; 

  // toggle open/close sa course folder, tapos i-reset ang page to 1
  const toggleCourse = (courseName: string) => {
      setExpandedCourses(prev => 
          prev.includes(courseName) ? prev.filter(c => c !== courseName) : [...prev, courseName]
      );
      if (!coursePages[courseName]) {
          setCoursePages(prev => ({...prev, [courseName]: 1}));
      }
  };

  // Helper para mo-generate sa page numbers per course
  const getCoursePageNumbers = (courseName: string, totalPages: number) => {
      const current = coursePages[courseName] || 1;
      const pages = [];
      let start = Math.max(1, current - 2);
      let end = Math.min(totalPages, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
  };

  // @Koi: helper nako para ma format ang date nga gi request, aron ma spell out ang month (e.g. October 07, 2004)
  const formatDate = (dateString: string) => {
      if (!dateString || dateString === "N/A") return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // fallback if invalid date format ang maabot from DB
      return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  };

  // gamayng helper component para di ta mag sige ug copy-paste aning UI structure
  const InfoField = ({ label, value, icon: Icon, fullWidth = false }: any) => (
    <div className={`flex flex-col space-y-1 ${fullWidth ? "col-span-2" : "col-span-1"}`}>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            {Icon && <Icon size={10} />} {label}
        </span>
        <div className="p-2.5 bg-stone-50 rounded-md border border-stone-200 text-sm font-semibold text-stone-800 break-words leading-snug">
            {value || <span className="text-stone-300 italic">N/A</span>}
        </div>
    </div>
  );

  // refs para e-trigger nato ang file input kung mu click sa box
  const gradPhotoRef = useRef<HTMLInputElement>(null);
  const creativePhotoRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // local states para modals
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [showInfoSaveConfirm, setShowInfoSaveConfirm] = useState(false);
  const [showPhotoSaveConfirm, setShowPhotoSaveConfirm] = useState(false);
  const [pendingFormEvent, setPendingFormEvent] = useState<React.FormEvent<HTMLFormElement> | null>(null);

  const onSaveInfoClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingFormEvent(e);
    setShowInfoSaveConfirm(true);
  };

  const confirmSaveInfo = () => {
    if (formRef.current) {
        handleSaveEdit(pendingFormEvent as any);
    }
    setShowInfoSaveConfirm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 h-[calc(100vh-140px)] flex flex-col">
        
        {/* --- Header Section --- */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5 flex-shrink-0">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-amber-600"/> Verification Queue
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                        Secure repository of verified graduates. Monitoring all students from Registration to Final Verification.
                    </p>
                </div>
                <Badge variant="secondary" className={`px-4 py-1.5 text-sm h-fit ${processedData.pendingCount === 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                    {processedData.pendingCount === 0 ? "All Caught Up!" : `${processedData.pendingCount} Pending Verification`}
                </Badge>
            </div>
            
            {/* Search and Filters Section */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                    <Input 
                        placeholder="Search by Name or ID number..." 
                        className="pl-10 h-11 bg-stone-50 border-stone-200 focus:ring-amber-500/20 focus:border-amber-500" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
            </div>
        </div>

        {/* --- Tunga sa page: Left side (List), Right side (Details) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pb-6">
            
            {/* LEFT: Directory List */}
            <Card className={`lg:col-span-4 xl:col-span-3 border-stone-200 shadow-sm flex flex-col overflow-hidden h-full rounded-2xl bg-white ${selectedStudent ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-stone-500"/>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Directory</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">{processedData.totalResults} results</span>
                </div>
                
                <div className="flex-1 min-h-0 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
                    {processedData.sortedDepts.length === 0 && (
                        <div className="text-center py-10 text-stone-400 text-sm flex flex-col items-center">
                            <Filter className="h-8 w-8 mb-2 opacity-20" /> No students found.
                        </div>
                    )}

                    {processedData.sortedDepts.map((dept) => {
                        const isExpanded = expandedDepts.includes(dept);
                        return (
                            <div key={dept} className="mb-3 bg-white rounded-xl border border-stone-200 overflow-hidden shrink-0 shadow-sm">
                                
                                {/* DEPT HEADER */}
                                <div 
                                    onClick={() => toggleDept(dept)}
                                    className={`cursor-pointer flex justify-between items-center p-3 transition-colors ${isExpanded ? 'bg-stone-50 border-b border-stone-100' : 'hover:bg-stone-50'}`}
                                >
                                    <span className="text-xs font-bold text-stone-800 truncate w-[85%] leading-tight">{dept}</span>
                                    {isExpanded ? <ChevronUp size={14} className="text-stone-400"/> : <ChevronDown size={14} className="text-stone-400"/>}
                                </div>
                                
                                {/* DEPT BODY (List of Courses) */}
                                {isExpanded && (
                                    <div className="bg-stone-50/30 p-2 space-y-2">
                                        {Object.keys(processedData.groups[dept]).map(program => {
                                            
                                            // @Koi: Gi nested na nako diri ang courses aron dili bug-at inig load
                                            const isCourseExpanded = expandedCourses.includes(program);
                                            const studentsInCourse = processedData.groups[dept][program];

                                            return (
                                                <div key={program} className="border border-stone-100 rounded-lg bg-white overflow-hidden shadow-sm">
                                                    
                                                    {/* COURSE HEADER */}
                                                    <div 
                                                        onClick={() => toggleCourse(program)}
                                                        className={`cursor-pointer flex justify-between items-center p-2.5 transition-colors ${isCourseExpanded ? 'bg-amber-50/30 border-b border-stone-100' : 'hover:bg-stone-50'}`}
                                                    >
                                                        <div className="flex items-center gap-2 pl-1">
                                                            <div className="w-1 h-3 bg-amber-400 rounded-full"></div>
                                                            <h4 className="text-[10px] font-bold text-stone-600 uppercase tracking-wider truncate w-40">{program}</h4>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-stone-400">{studentsInCourse.length}</span>
                                                            {isCourseExpanded ? <ChevronUp size={12} className="text-stone-400"/> : <ChevronDown size={12} className="text-stone-400"/>}
                                                        </div>
                                                    </div>

                                                    {/* COURSE BODY (List of Students) */}
                                                    {isCourseExpanded && (
                                                        <div className="p-2 space-y-1.5 bg-stone-50/50">
                                                            {studentsInCourse.map(student => (
                                                                <button 
                                                                    key={student.id}
                                                                    onClick={() => { setSelectedStudent(student); setIsEditing(false); }}
                                                                    className={`w-full text-left px-2.5 py-2 rounded-md flex items-center gap-3 transition-all border 
                                                                        ${selectedStudent?.id === student.id ? "bg-white border-amber-300 shadow-sm ring-1 ring-amber-100" : "bg-transparent border-transparent hover:bg-white hover:border-stone-200 hover:shadow-sm"}`}
                                                                >
                                                                    <Avatar className="h-8 w-8 border border-stone-200">
                                                                        <AvatarImage src={student.photo} />
                                                                        <AvatarFallback className="text-[10px] bg-stone-100 text-stone-500">{student.fname.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className={`text-[11px] font-bold truncate leading-tight ${selectedStudent?.id === student.id ? 'text-amber-900' : 'text-stone-700'}`}>
                                                                            {student.lname}, {student.fname}
                                                                        </p>
                                                                        <p className="text-[9px] text-stone-400 font-mono leading-tight mt-0.5">{student.idNumber}</p>
                                                                    </div>
                                                                    {student.status === 'verified' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" title="Verified"></div>}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* RIGHT: Diri mugawas ang mga info sa gipili nga student */}
            <div className={`lg:col-span-8 xl:col-span-9 h-full flex flex-col min-h-0 ${selectedStudent ? 'block' : 'hidden lg:block'}`}>
                {selectedStudent ? (
                    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header sa student details para makita kung verified na ba o wala pa */}
                        <div className="bg-white border border-stone-200 rounded-t-2xl p-4 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 shadow-sm z-10 flex-shrink-0">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Badge variant={selectedStudent.status === 'verified' ? 'default' : 'outline'} className={`px-3 py-1 ${selectedStudent.status === 'verified' ? 'bg-green-600 hover:bg-green-600' : 'text-stone-500 border-stone-300'}`}>
                                    {selectedStudent.status === 'verified' ? 'VERIFIED FINAL' : 'PENDING REVIEW'}
                                </Badge>
                                <span className="h-4 w-[1px] bg-stone-300 hidden sm:block"></span>
                                <div className="flex items-center gap-1 font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                                    <span className="text-stone-400">ID:</span> {selectedStudent.idNumber}
                                </div>
                            </div>
                            {selectedStudent.last_edited_by && (
                                <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
                                    <Clock size={12} className="text-stone-400" />
                                    <span>Updated by <strong>{selectedStudent.last_edited_by}</strong></span>
                                </div>
                            )}
                        </div>

                        {/* Sulod sa card: Pwede edit mode or view mode */}
                        <Card className="rounded-t-none border-t-0 shadow-sm flex-1 flex flex-col bg-white relative overflow-hidden rounded-b-2xl border-stone-200 min-h-0">
                            
                            {isEditing ? (
                                /* --- EDIT MODE (Kung gi click ang edit button) --- */
                                <div className="flex-1 overflow-y-auto p-8 bg-stone-50/50">
                                    <form id="edit-form" ref={formRef} onSubmit={onSaveInfoClick}>
                                        <div className="flex items-center justify-between mb-8 sticky top-0 bg-stone-50/95 backdrop-blur z-20 py-4 border-b border-stone-200 -mx-8 px-8 -mt-8">
                                            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                                                <Edit3 size={18} className="text-amber-600"/> Edit Information
                                            </h2>
                                            <div className="flex gap-2">
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                                                <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm">Save Changes</Button>
                                            </div>
                                        </div>
                                        <Tabs defaultValue="personal" className="w-full">
                                            <TabsList className="grid w-full grid-cols-4 mb-6 p-1 bg-stone-200/50 rounded-xl h-12">
                                                <TabsTrigger value="personal" className="text-xs font-bold">Personal</TabsTrigger>
                                                <TabsTrigger value="academic" className="text-xs font-bold">Academic</TabsTrigger>
                                                <TabsTrigger value="contact" className="text-xs font-bold">Contact</TabsTrigger>
                                                <TabsTrigger value="family" className="text-xs font-bold">Family</TabsTrigger>
                                            </TabsList>
                                            
                                            <TabsContent value="personal" className="space-y-4 bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">First Name</Label><Input name="fname" defaultValue={selectedStudent.fname} /></div>
                                                    <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Last Name</Label><Input name="lname" defaultValue={selectedStudent.lname} /></div>
                                                    <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Middle Name</Label><Input name="mname" defaultValue={selectedStudent.mname} /></div>
                                                    <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Suffix</Label><Input name="suffix" defaultValue={selectedStudent.suffix} /></div>
                                                </div>
                                                <div className="space-y-1.5 pt-2"><Label className="text-stone-500 font-bold text-xs uppercase">Nickname</Label><Input name="nickname" defaultValue={selectedStudent.nickname} /></div>
                                            </TabsContent>
                                            <TabsContent value="academic" className="space-y-6 bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
                                               <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Course</Label><Input name="course" defaultValue={selectedStudent.course} /></div>
                                               <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Major</Label><Input name="major" defaultValue={selectedStudent.major} /></div>
                                            </TabsContent>
                                            <TabsContent value="contact" className="space-y-6 bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
                                               <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Address</Label><Input name="address" defaultValue={selectedStudent.details.address} /></div>
                                               <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Mobile</Label><Input name="contactNum" defaultValue={selectedStudent.details.contactNum} /></div>
                                               <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Personal Email</Label><Input name="personalEmail" defaultValue={selectedStudent.details.personalEmail} /></div>
                                               {/* @Koi: Gi remove nako ang School Email sa UI diri kay di daw kailangan nato */}
                                            </TabsContent>
                                            <TabsContent value="family" className="space-y-6 bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
                                               {/* @Koi: Conditional rendering logic nato. Kung gi select ang Guardian, tago ang Parents. Kung parents, tago si Guardian */}
                                               {(!selectedStudent.details.guardian || selectedStudent.details.guardian === "N/A") ? (
                                                  <>
                                                      <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Father</Label><Input name="father" defaultValue={selectedStudent.details.father} /></div>
                                                      <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Mother</Label><Input name="mother" defaultValue={selectedStudent.details.mother} /></div>
                                                  </>
                                               ) : (
                                                  <div className="space-y-1.5"><Label className="text-stone-500 font-bold text-xs uppercase">Guardian</Label><Input name="guardian" defaultValue={selectedStudent.details.guardian} /></div>
                                               )}
                                            </TabsContent>
                                        </Tabs>
                                    </form>
                                </div>
                            ) : (
                                /* --- VIEW MODE (Read only lang) --- */
                                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                                    
                                    {/* Katong naay picture ug pangalan nga naka style (GI-BALIK NAKO ANG NORMAL SIZE DIRI) */}
                                    <div className="w-full md:w-5/12 bg-stone-100 p-8 flex flex-col items-center justify-center border-r border-stone-200 relative">
                                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                        
                                        <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500 ease-out group">
                                                <div className="w-48 h-48 bg-white p-2 shadow-xl rotate-2 border-2 border-stone-200 relative z-10 rounded-sm">
                                                    <img src={selectedStudent.photo} className="w-full h-full object-cover bg-stone-200" alt="Student" />
                                                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-amber-500 z-20"></div>
                                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-amber-500 z-20"></div>
                                                </div>
                                        </div>

                                        <div className="text-center space-y-3 max-w-sm relative z-10">
                                            <div>
                                                <h2 className="text-2xl font-serif font-bold text-stone-900 leading-tight uppercase tracking-wide">
                                                    {selectedStudent.lname}, <br/> {selectedStudent.fname} {selectedStudent.mname} {selectedStudent.suffix}
                                                </h2>
                                                <p className="text-amber-600 font-serif italic text-lg mt-2 font-medium">"{selectedStudent.nickname}"</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mga details sa right side nga pwede ma scroll if taas ra */}
                                    <div className="flex-1 p-10 overflow-y-auto bg-white min-h-0">
                                        <div className="space-y-10 pb-10">
                                                
                                                {/* Academic Details */}
                                                <div>
                                                    <h3 className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-5">
                                                        <GraduationCap size={16}/> Academic Profile
                                                    </h3>
                                                    <div className="grid grid-cols-1 gap-6 p-6 bg-stone-50 rounded-2xl border border-stone-100 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full opacity-50"></div>
                                                        <div className="col-span-1">
                                                            <InfoField label="Department / School" value={selectedStudent.department} icon={Building2} />
                                                        </div>
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
                                                                <span className="text-sm font-mono text-stone-700 bg-white px-2 py-1 rounded border border-stone-200 inline-block">{selectedStudent.idNumber}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] uppercase text-stone-400 font-bold block mb-1">Thesis Title</span>
                                                            <span className="text-sm italic text-stone-700 font-medium">"{selectedStudent.details.thesis}"</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Personal ug pamilya */}
                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                                    <div>
                                                        <h3 className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-5">
                                                            <User size={16}/> Personal & Family
                                                        </h3>
                                                        <div className="space-y-4 p-6 rounded-2xl border border-stone-100 bg-stone-50/30">
                                                            {/* @Koi: Gamit na nato ang date formatter nato diri */}
                                                            <InfoField label="Date of Birth" value={formatDate(selectedStudent.details.birthdate)} />
                                                            
                                                            {/* @Koi: Conditional logic pud sa View mode. Hide parents if guardian is filled */}
                                                            {(!selectedStudent.details.guardian || selectedStudent.details.guardian === "N/A") ? (
                                                                <>
                                                                    <InfoField label="Father's Name" value={selectedStudent.details.father} />
                                                                    <InfoField label="Mother's Name" value={selectedStudent.details.mother} />
                                                                </>
                                                            ) : (
                                                                <InfoField label="Guardian" value={selectedStudent.details.guardian} />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Contact details */}
                                                    <div>
                                                        <h3 className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-5">
                                                            <MapPin size={16}/> Contact Info
                                                        </h3>
                                                        <div className="space-y-4 p-6 rounded-2xl border border-stone-100 bg-stone-50/30">
                                                            <InfoField label="Address" value={selectedStudent.details.address} icon={Home} />
                                                            <InfoField label="Mobile Number" value={selectedStudent.details.contactNum} icon={Phone} />
                                                            <InfoField label="Personal Email" value={selectedStudent.details.personalEmail} icon={Mail} />
                                                            {/* @Koi: School email is completely removed here as requested */}
                                                        </div>
                                                    </div>
                                                </div>

                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FOOTER: Naa diri ang mga buttons for actions */}
                            <CardFooter className="border-t border-stone-200 bg-stone-50 p-5 flex justify-between items-center z-20 flex-shrink-0">
                                <div className="flex gap-3">
                                    <Button 
                                    variant="outline" 
                                    onClick={() => setIsEditing(true)} 
                                    disabled={isEditing}
                                    className="border-stone-300 text-stone-600 hover:bg-white hover:text-amber-700"
                                    >
                                    <Edit3 size={16} className="mr-2"/> Edit Information
                                    </Button>

                                    <Button 
                                        variant="secondary"
                                        onClick={() => setIsPhotoModalOpen(true)}
                                        className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200"
                                    >
                                        <ImageIcon size={16} className="mr-2"/> Add/Edit Photos
                                    </Button>
                                </div>

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
                    <div className="h-full flex flex-col items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl bg-white/50">
                        <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-4 border border-stone-200">
                            <User size={48} className="opacity-20 text-stone-500" />
                        </div>
                        <p className="font-serif text-lg text-stone-500 font-medium">Select a graduate from the directory</p>
                        <p className="text-sm text-stone-400 mt-1">Or use the search bar above to find by ID</p>
                    </div>
                )}
            </div>
        </div>

        {/* --- MGA DIALOGS PARA DI MAKA ACCIDENTAL CLICK --- */}
        <AlertDialog open={showInfoSaveConfirm} onOpenChange={setShowInfoSaveConfirm}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to update the student's information? This will reflect in the database immediately.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmSaveInfo} className="bg-amber-600 hover:bg-amber-700">Confirm Save</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showPhotoSaveConfirm} onOpenChange={setShowPhotoSaveConfirm}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Update Photos?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will replace any existing graduation or creative photos for this student.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { setShowPhotoSaveConfirm(false); setIsPhotoModalOpen(false); }} className="bg-green-600 hover:bg-green-700">Confirm Upload</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* --- Ang Photo Manager nga gipadak-an to 85vw ug naay saktong aspect ratio --- */}
        <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
            {/* @Koi: Gi dako nako ang width to 85vw para wide jud siya ug gi auto nako ang height aron dili mo stretch ug maporma og tukog */}
            <DialogContent className="max-w-[85vw] w-full p-0 overflow-hidden bg-stone-50 flex flex-col">
                <div className="p-6 border-b border-stone-200 bg-white flex justify-between items-center shrink-0">
                    <div>
                        <DialogTitle className="text-2xl font-bold text-stone-800">Manage Graduate Photos</DialogTitle>
                        <DialogDescription className="text-stone-500 text-base">Upload official Graduation and Creative photos using the pre-registration photo as reference.</DialogDescription>
                    </div>
                </div>
                
                {/* @Koi: Ang grid gi set og aspect ratio nga saktong porma, dili na pultahan haha */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10 overflow-y-auto">
                    {/* BOX 1: Pre-reg photo (Reference ra ni, dili ma edit) */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="bg-stone-200 text-stone-600 border-stone-300 px-3 py-1">1. Reference</Badge>
                            <span className="text-sm text-stone-500 font-bold uppercase">Pre-Reg Upload</span>
                        </div>
                        {/* @Koi: Saktong aspect ratio (2:3 or 3:4) para sa picture frame, unya height auto */}
                        <div className="w-full aspect-[3/4] bg-stone-100 border-2 border-stone-300 rounded-2xl overflow-hidden shadow-inner relative flex items-center justify-center p-4">
                            <img src={selectedStudent?.photo} className="max-w-full max-h-full object-contain drop-shadow-md rounded-md" alt="Reference" />
                        </div>
                        <p className="text-sm text-stone-500 text-center mt-3 font-medium">Reference only.</p>
                    </div>

                    {/* BOX 2: Uploadanan sa Graduation / Toga pic */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                             <Badge className="bg-amber-600 hover:bg-amber-700 px-3 py-1">2. Upload</Badge>
                             <span className="text-sm text-stone-500 font-bold uppercase">Graduation Picture (Toga)</span>
                        </div>
                        <div 
                            className="w-full aspect-[3/4] bg-white border-4 border-dashed border-amber-300 rounded-2xl overflow-hidden shadow-inner relative cursor-pointer hover:bg-amber-50 transition-colors flex flex-col items-center justify-center group p-4"
                            onClick={() => gradPhotoRef.current?.click()}
                        >
                            {selectedStudent?.photo_grad ? (
                                 <img src={selectedStudent.photo_grad} className="max-w-full max-h-full object-contain drop-shadow-md rounded-md" alt="Grad" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={28} />
                                    </div>
                                    <span className="text-lg font-bold text-stone-600 block">Click to Upload Toga Pic</span>
                                    <p className="text-sm text-stone-400 mt-2">High Resolution JPG or PNG</p>
                                </div>
                            )}
                            <input type="file" ref={gradPhotoRef} className="hidden" accept="image/*" onChange={(e) => {
                                if(e.target.files?.[0]) handlePhotoUpload('grad', e.target.files[0]);
                            }}/>
                        </div>
                        <p className="text-sm text-amber-600 text-center mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click image to change</p>
                    </div>

                    {/* BOX 3: Uploadanan sa Creative / Theme pic */}
                    <div className="flex flex-col">
                         <div className="flex items-center gap-2 mb-3">
                             <Badge className="bg-amber-600 hover:bg-amber-700 px-3 py-1">3. Upload</Badge>
                             <span className="text-sm text-stone-500 font-bold uppercase">Creative / Theme Picture</span>
                        </div>
                        <div 
                            className="w-full aspect-[3/4] bg-white border-4 border-dashed border-amber-300 rounded-2xl overflow-hidden shadow-inner relative cursor-pointer hover:bg-amber-50 transition-colors flex flex-col items-center justify-center group p-4"
                            onClick={() => creativePhotoRef.current?.click()}
                        >
                             {selectedStudent?.photo_creative ? (
                                 <img src={selectedStudent.photo_creative} className="max-w-full max-h-full object-contain drop-shadow-md rounded-md" alt="Creative" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={28} />
                                    </div>
                                    <span className="text-lg font-bold text-stone-600 block">Click to Upload Creative</span>
                                    <p className="text-sm text-stone-400 mt-2">High Resolution JPG or PNG</p>
                                </div>
                            )}
                            <input type="file" ref={creativePhotoRef} className="hidden" accept="image/*" onChange={(e) => {
                                 if(e.target.files?.[0]) handlePhotoUpload('creative', e.target.files[0]);
                            }}/>
                        </div>
                        <p className="text-sm text-amber-600 text-center mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click image to change</p>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-white border-t border-stone-200 shrink-0">
                    <Button variant="outline" size="lg" onClick={() => setIsPhotoModalOpen(false)}>Cancel & Close</Button>
                    <Button size="lg" onClick={() => setShowPhotoSaveConfirm(true)} className="bg-green-600 hover:bg-green-700 text-base px-8">Save All Photos</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}