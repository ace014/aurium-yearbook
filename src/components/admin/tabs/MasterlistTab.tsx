"use client";

import { Search, BookOpen, GraduationCap, FileText, MapPin, Phone, Mail, ChevronRight, Clock, ChevronDown, ChevronUp, Filter, FolderOpen, Folder, User, Image as ImageIcon, X, Home, CreditCard, Building2, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// gamiton nato ang hook diri para limpyo ang file, didto na tanang logic gatuyok
import { useMasterlist } from "@/hooks/useMasterlist";

export function MasterlistTab() {
  
  // kwaon nato tanang states ug variables nga gi-return gikan sa hook
  const {
    searchQuery,
    setSearchQuery,
    selectedStudent,
    setSelectedStudent,
    activeDeptFilter,
    setActiveDeptFilter,
    activeStatusFilter,     
    setActiveStatusFilter,  
    expandedDepts,
    toggleDept,
    processedData,
    DEPARTMENT_ORDER,
    STATUS_STEPS
  } = useMasterlist();

  // gamayng helper component para di ta mag sige ug copy-paste aning UI structure kada field
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* --- Kani ang pinaka Header sa Page --- */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-amber-600"/> Masterlist Database
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                        Secure repository of verified graduates. Monitoring all students from Registration to Final Verification.
                    </p>
                </div>
                {/* Badge para makita dayon pila kabuok records ang ni-match sa filter */}
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-1.5 text-sm h-fit">
                    {processedData.totalResults} Records Found
                </Badge>
            </div>
            
            {/* Search and Filters Section */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                    <Input 
                        placeholder="Search by Name or ID number..." 
                        className="pl-10 h-11 bg-stone-50 border-stone-200 focus:ring-amber-500/20 focus:border-amber-500" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>

                {/* Dropdown Filter para sa Status (1-5 steps logic ni Koi) */}
                <div className="w-full md:w-48">
                    <Select value={activeStatusFilter} onValueChange={setActiveStatusFilter}>
                        <SelectTrigger className="h-11 bg-stone-50 border-stone-200">
                            <div className="flex items-center gap-2 text-stone-600">
                                <ListFilter size={16} />
                                <SelectValue placeholder="Filter Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            {STATUS_STEPS.map(step => (
                                <SelectItem key={step.id} value={step.id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${step.color}`}></div>
                                        {step.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Dropdown Filter para sa Department */}
                <div className="w-full md:w-64">
                    <Select value={activeDeptFilter} onValueChange={setActiveDeptFilter}>
                        <SelectTrigger className="h-11 bg-stone-50 border-stone-200">
                            <div className="flex items-center gap-2 text-stone-600">
                                <Filter size={16} />
                                <SelectValue placeholder="Filter Department" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Departments</SelectItem>
                            {DEPARTMENT_ORDER.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

        {/* --- Kani ang Main List sa ubos (Folders nga pwede i-expand) --- */}
        <div className="space-y-4 pb-10 min-h-[400px]">
            {/* Kung walay na search o na filter, kani mugawas */}
            {processedData.sortedDepts.length === 0 && (
                <div className="text-center py-16 text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200 flex flex-col items-center">
                    <Search className="h-12 w-12 mb-4 opacity-20"/>
                    <p className="text-lg font-medium text-stone-500">No records found</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                </div>
            )}

            {/* Loop through each department */}
            {processedData.sortedDepts.map((dept) => {
                const isExpanded = expandedDepts.includes(dept);
                return (
                    <div key={dept} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-200">
                        {/* Folder Header (clickable to expand/collapse) */}
                        <div 
                            onClick={() => toggleDept(dept)}
                            className={`cursor-pointer flex justify-between items-center p-4 ${isExpanded ? 'bg-stone-50 border-b border-stone-100' : 'bg-white hover:bg-stone-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                {isExpanded ? <FolderOpen className="h-5 w-5 text-amber-600" /> : <Folder className="h-5 w-5 text-stone-400" />}
                                <h3 className="font-serif font-bold text-stone-800">{dept}</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="text-xs font-mono text-stone-500 border-stone-200 bg-white">
                                    {processedData.deptCounts[dept]} Students
                                </Badge>
                                {isExpanded ? <ChevronUp className="h-4 w-4 text-stone-400" /> : <ChevronDown className="h-4 w-4 text-stone-400" />}
                            </div>
                        </div>

                        {/* Folder Body (List of programs and students) - mu gawas ra kung isExpanded */}
                        {isExpanded && (
                            <div className="p-4 space-y-6 bg-[#FDFBF7]/30 animate-in slide-in-from-top-2 duration-200">
                                {Object.keys(processedData.groups[dept]).sort().map((program) => (
                                    <div key={program} className="space-y-3">
                                        
                                        {/* Program/Course Header inside the folder */}
                                        <div className="flex items-center gap-2 pl-2">
                                            <div className="h-px w-4 bg-amber-200"></div>
                                            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider bg-amber-50/50 px-2 py-1 rounded text-amber-900/70">
                                                {program}
                                            </h4>
                                            <div className="h-px flex-1 bg-stone-100"></div>
                                        </div>
                                        
                                        {/* Grid of students under this program */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-0 md:pl-6">
                                            {processedData.groups[dept][program]
                                                .sort((a, b) => a.lname.localeCompare(b.lname))
                                                .map((student) => {
                                                    // pangitaon nato ang corresponding color para sa status ani nga student
                                                    const statusInfo = STATUS_STEPS.find(s => s.id === student.statusStep) || STATUS_STEPS[0];
                                                    
                                                    return (
                                                        <div 
                                                            key={student.id} 
                                                            onClick={() => setSelectedStudent(student)} 
                                                            className="group bg-white p-3.5 rounded-lg border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex justify-between items-center relative overflow-hidden"
                                                        >
                                                            {/* pa choy choy nga border left ig hover */}
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            <div className="relative z-10 w-full">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <p className="font-bold text-stone-800 group-hover:text-amber-800 transition-colors text-sm truncate pr-2">
                                                                        {student.lname}, {student.fname} {student.mname.charAt(0)}. {student.suffix}
                                                                    </p>
                                                                    {/* Dot indicator sa kilid */}
                                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${statusInfo.color}`} title={statusInfo.label}></div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-[11px] font-mono text-stone-500">
                                                                        {student.idNumber}
                                                                    </p>
                                                                    <span className="text-[9px] text-stone-400 font-medium uppercase">{statusInfo.label}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* --- PROFILE MODAL: Mugawas ni kung naay gi-click nga student --- */}
        <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
            {/* Added [&>button]:hidden para ma hide to ang default X close button, naa tay atoang custom close */}
            <DialogContent className="max-w-[95vw] md:max-w-7xl h-[92vh] p-0 overflow-hidden rounded-xl border-0 shadow-2xl bg-white flex flex-col md:flex-row [&>button]:hidden">
                <div className="sr-only">
                    <DialogHeader>
                        <DialogTitle>Student Profile: {selectedStudent?.lname}</DialogTitle>
                        <DialogDescription>Detailed view of student information.</DialogDescription>
                    </DialogHeader>
                </div>

                {/* Custom X Button aron dali ma close */}
                <button 
                    onClick={() => setSelectedStudent(null)} 
                    className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-stone-100 backdrop-blur-sm rounded-full text-stone-500 border border-stone-200 transition-all shadow-sm"
                >
                    <X size={20}/>
                </button>

                {selectedStudent && (
                    <>
                        {/* COLUMN 1: IDENTITY & 3 PHOTOS (Kani tong gi update para mo match sa verification layout) */}
                        <div className="w-full md:w-[360px] bg-stone-100 p-6 flex flex-col items-center border-r border-stone-200 overflow-y-auto shrink-0 relative">
                            
                            <div className="text-center w-full mb-6 mt-8">
                                <h2 className="text-2xl font-black text-stone-900 uppercase leading-none tracking-tight">
                                    {selectedStudent.lname}, <br/> 
                                    {selectedStudent.fname} {selectedStudent.mname?.charAt(0)}. 
                                    {selectedStudent.suffix && <span className="ml-1 text-stone-600">{selectedStudent.suffix}</span>}
                                </h2>
                                <p className="text-amber-700 font-serif italic text-lg mt-1">"{selectedStudent.nickname}"</p>
                            </div>

                            {/* --- THE 3 BOXES PARA SA PHOTOS --- */}
                            <div className="w-full space-y-4">
                                
                                {/* 1. Graduation Photo */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase text-stone-400 pl-1 flex items-center gap-1">
                                        <ImageIcon size={10} /> Graduation Photo
                                    </span>
                                    <div className="w-full aspect-[4/5] bg-white p-2 shadow-sm border border-stone-200 rounded-lg">
                                        {selectedStudent.photo_grad ? (
                                            <img src={selectedStudent.photo_grad} className="w-full h-full object-cover rounded-sm" alt="Graduation" />
                                        ) : (
                                            <div className="w-full h-full bg-stone-50 flex flex-col items-center justify-center text-stone-300">
                                                <ImageIcon size={24} className="opacity-20 mb-1"/>
                                                <span className="text-[10px] italic">Not Uploaded</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 2. Creative Photo */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase text-stone-400 pl-1 flex items-center gap-1">
                                        <ImageIcon size={10} /> Creative Photo
                                    </span>
                                    <div className="w-full aspect-[4/5] bg-white p-2 shadow-sm border border-stone-200 rounded-lg">
                                        {selectedStudent.photo_creative ? (
                                            <img src={selectedStudent.photo_creative} className="w-full h-full object-cover rounded-sm" alt="Creative" />
                                        ) : (
                                            <div className="w-full h-full bg-stone-50 flex flex-col items-center justify-center text-stone-300">
                                                <ImageIcon size={24} className="opacity-20 mb-1"/>
                                                <span className="text-[10px] italic">Not Uploaded</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* 3. Reference Photo (Ang original nga upload) */}
                                <div className="pt-4 border-t border-stone-200">
                                    <span className="text-[10px] font-bold uppercase text-stone-400 pl-1 block mb-2 text-center">Reference (Pre-Reg)</span>
                                    <div className="w-24 h-24 bg-white p-1 shadow-sm border border-stone-200 rounded-lg mx-auto">
                                        <img src={selectedStudent.photo} className="w-full h-full object-cover rounded-sm opacity-90" alt="Reference" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: DATA DASHBOARD (Kani tong mga info jud) */}
                        <div className="flex-1 bg-white p-8 md:p-10 overflow-y-auto">
                            
                            {/* Academic Details */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
                                    <GraduationCap className="text-amber-600 w-5 h-5" />
                                    <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest">Academic Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <InfoField label="Department / School" value={selectedStudent.department} icon={Building2} fullWidth />
                                    </div>
                                    <InfoField label="Program / Course" value={selectedStudent.course} />
                                    <InfoField label="Major" value={selectedStudent.major} />
                                    <div className="col-span-2">
                                        <InfoField label="Thesis / Capstone Title" value={`"${selectedStudent.details.thesis}"`} icon={FileText} fullWidth />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {/* Personal ug Pamilya */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
                                        <User className="text-stone-400 w-5 h-5" />
                                        <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest">Personal & Family</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <InfoField label="Date of Birth" value={selectedStudent.details.birthdate} />
                                        <InfoField label="Father's Name" value={selectedStudent.details.father} />
                                        <InfoField label="Mother's Name" value={selectedStudent.details.mother} />
                                        <InfoField label="Guardian" value={selectedStudent.details.guardian} />
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
                                        <MapPin className="text-stone-400 w-5 h-5" />
                                        <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest">Contact Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <InfoField label="Home Address" value={selectedStudent.details.address} icon={Home} />
                                        <InfoField label="Mobile Number" value={selectedStudent.details.contact} icon={Phone} />
                                        <InfoField label="Personal Email" value={selectedStudent.details.personalEmail} icon={Mail} />
                                        <InfoField label="School Email" value={selectedStudent.details.email} icon={Mail} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: TRACKER (Mao ni tong nagpakita sa progress ni student 1 to 5) */}
                        <div className="w-full md:w-64 bg-stone-50 border-l border-stone-200 p-6 overflow-y-auto shrink-0 pt-16 md:pt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-stone-800 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Clock size={14} className="text-amber-600" /> Status History
                                </h3>
                            </div>
                            
                            <div className="space-y-0 relative pl-2">
                                {STATUS_STEPS.map((step, index) => {
                                    // I-check nato kung lampas naba sya ani nga step
                                    const isDone = step.id <= (selectedStudent.statusStep || 1);
                                    const isCurrent = step.id === selectedStudent.statusStep;
                                    
                                    return (
                                        <div key={step.id} className="flex gap-3 relative pb-8 last:pb-0 group">
                                            {/* Line (mu yellow if na human na) */}
                                            {index < STATUS_STEPS.length - 1 && (
                                                <div className={`absolute left-[7px] top-5 bottom-0 w-[2px] ${isDone ? 'bg-amber-500' : 'bg-stone-200'}`}></div>
                                            )}
                                            
                                            {/* Dot indicator */}
                                            <div className={`
                                                z-10 w-4 h-4 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 mt-1
                                                ${isDone ? 'bg-amber-50 border-amber-600' : 'bg-white border-stone-300'}
                                                ${isCurrent ? 'ring-2 ring-amber-200 scale-110' : ''}
                                            `}>
                                                {isDone && <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"/>}
                                            </div>
                                            
                                            {/* Text description */}
                                            <div>
                                                <span className={`text-xs font-bold block leading-tight ${isDone ? 'text-stone-800' : 'text-stone-400'}`}>
                                                    {step.label}
                                                </span>
                                                {isCurrent && (
                                                    <span className="text-[9px] text-amber-700 font-bold uppercase tracking-wider mt-1 block bg-amber-100 px-1.5 py-0.5 rounded w-fit">
                                                        Current
                                                    </span>
                                                )}
                                                {isDone && <span className="text-[9px] text-stone-400 block mt-0.5">Completed</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    </div>
  );
}