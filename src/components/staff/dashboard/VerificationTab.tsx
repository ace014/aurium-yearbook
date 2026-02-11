"use client";

import { useState, useRef } from "react";
import { Search, CheckCircle2, ChevronRight, Edit3, Save, Clock, Camera, MapPin, Home, Phone, Mail, GraduationCap, User, Quote, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 

const MOCK_GRADUATES = [
  { 
    id: "2020-00123", 
    lname: "Dela Cruz", fname: "Juan", mname: "Santos", suffix: "", nickname: "\"Juanny\"", birthdate: "2002-05-15", 
    province: "Davao del Norte", city: "Tagum City", barangay: "Visayan Village",
    course: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE", major: "Data Science", thesis: "AI-Driven Traffic Management System for Tagum City", 
    contactNum: "09123456789", personalEmail: "juan.delacruz@gmail.com", 
    father: "Pedro Dela Cruz", mother: "Maria Dela Cruz", guardian: "", 
    photo: "https://github.com/shadcn.png", 
    status: "pending", last_edited_by: null, last_edited_at: null
  },
  { 
    id: "2020-00456", 
    lname: "Clara", fname: "Maria", mname: "Reyes", suffix: "", nickname: "\"Mar\"", birthdate: "2001-11-20",
    province: "Davao de Oro", city: "Nabunturan", barangay: "Poblacion",
    course: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION", major: "Marketing Management", thesis: "Impact of Social Media Marketing on Local Coffee Shops",
    contactNum: "09987654321", personalEmail: "maria.clara@yahoo.com",
    father: "Jose Clara", mother: "Teresa Clara", guardian: "",
    photo: "https://github.com/shadcn.png",
    status: "verified", last_edited_by: "Ms. Sarah Jenkins", last_edited_at: "2026-03-15 09:30 AM"
  },
];

interface VerificationTabProps {
  staffUser: any;
  selectedStudent: any;
  setSelectedStudent: (student: any) => void;
}

export function VerificationTab({ staffUser, selectedStudent, setSelectedStudent }: VerificationTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [graduates, setGraduates] = useState(MOCK_GRADUATES);
  const [isEditing, setIsEditing] = useState(false);
  const studentPhotoInputRef = useRef<HTMLInputElement>(null);

  const filteredGraduates = graduates.filter(g => 
    g.lname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.id.includes(searchTerm)
  );

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

    setGraduates(prev => prev.map(g => g.id === selectedStudent.id ? { ...g, ...updates } : g));
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
    const update = { status: "verified", last_edited_by: staffUser.name, last_edited_at: timestamp };
    setGraduates(prev => prev.map(g => g.id === selectedStudent.id ? { ...g, ...update } : g));
    setSelectedStudent((prev: any) => ({ ...prev, ...update }));
  };

  return (
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
                    ${selectedStudent?.id === grad.id ? "bg-amber-50 border-amber-200 shadow-sm" : "bg-white hover:bg-stone-50 border-transparent hover:border-stone-200"}`}
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
                    <Search className="h-8 w-8 mb-2 opacity-20" /> No graduates found.
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

                                  <TabsContent value="personal" className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2"><Label>First Name</Label><Input name="fname" defaultValue={selectedStudent.fname} className="bg-stone-50" /></div>
                                          <div className="space-y-2"><Label>Last Name</Label><Input name="lname" defaultValue={selectedStudent.lname} className="bg-stone-50" /></div>
                                          <div className="space-y-2"><Label>Middle Name</Label><Input name="mname" defaultValue={selectedStudent.mname} className="bg-stone-50" /></div>
                                          <div className="space-y-2"><Label>Suffix</Label><Input name="suffix" defaultValue={selectedStudent.suffix} className="bg-stone-50" /></div>
                                      </div>
                                      <div className="space-y-2"><Label>Nickname (with quotes)</Label><Input name="nickname" defaultValue={selectedStudent.nickname} className="bg-stone-50" /></div>
                                  </TabsContent>

                                  <TabsContent value="academic" className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                                      <div className="space-y-2"><Label>Course</Label><Input name="course" defaultValue={selectedStudent.course} className="bg-stone-50" /></div>
                                      <div className="space-y-2"><Label>Major</Label><Input name="major" defaultValue={selectedStudent.major} className="bg-stone-50" /></div>
                                      <div className="space-y-2"><Label>Thesis Title</Label><Input name="thesis" defaultValue={selectedStudent.thesis} className="bg-stone-50" /></div>
                                  </TabsContent>

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
                                          <input type="file" ref={studentPhotoInputRef} className="hidden" accept="image/*" onChange={handleStudentPhotoChange} />
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
  );
}