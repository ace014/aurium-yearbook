"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; 
import { UserCircle, ClipboardCheck } from "lucide-react";

// --- 1. DATA IMPORTS ---
import provinces from "@/data/province.json";
import cities from "@/data/city.json";
import barangays from "@/data/barangay.json";

// Type assertions
const provinceList = provinces as Array<{ province_code: string; province_name: string }>;
const cityList = cities as Array<{ city_code: string; city_name: string; province_code: string }>;
const barangayList = barangays as Array<{ brgy_code: string; brgy_name: string; city_code: string }>;

// --- 2. CONFIGURATION DATA ---
const titleOptions = ["Mr.", "Mrs.", "Ms.", "Dr.", "Atty.", "Engr.", "Arch.", "Prof.", "Rev."];

const courseOptions = [
  { course: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION", majors: ["FINANCIAL MANAGEMENT", "HUMAN RESOURCE MANAGEMENT", "MARKETING MANAGEMENT"] },
  { course: "BACHELOR OF SCIENCE IN COMMERCE", majors: ["MANAGEMENT"] },
  { course: "BACHELOR OF SCIENCE IN ACCOUNTANCY", majors: [] },
  { course: "BACHELOR OF SCIENCE IN ACCOUNTING TECHNOLOGY", majors: [] },
  { course: "BACHELOR OF SCIENCE IN MANAGEMENT ACCOUNTING", majors: [] },
  { course: "BACHELOR OF ELEMENTARY EDUCATION (GENERALIST)", majors: [] },
  { course: "BACHELOR OF PHYSICAL EDUCATION", majors: [] },
  { course: "BACHELOR OF SECONDARY EDUCATION", majors: ["ENGLISH", "FILIPINO", "MATHEMATICS", "SCIENCE", "SOCIAL STUDIES"] },
  { course: "BACHELOR OF ARTS IN ENGLISH", majors: [] },
  { course: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE", majors: [] },
  { course: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY", majors: [] },
  { course: "BACHELOR OF SCIENCE IN PSYCHOLOGY", majors: [] },
  { course: "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT", majors: [] },
  { course: "BACHELOR OF SCIENCE IN HOTEL AND RESTAURANT MANAGEMENT", majors: [] },
  { course: "BACHELOR OF SCIENCE IN TOURISM MANAGEMENT", majors: [] },
  { course: "BACHELOR OF SCIENCE IN COMPUTER ENGINEERING", majors: [] },
  { course: "BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING", majors: [] },
  { course: "BACHELOR OF SCIENCE IN ELECTRONICS ENGINEERING", majors: [] },
  { course: "BACHELOR OF SCIENCE IN CRIMINOLOGY", majors: [] },
  { course: "MAED", majors: ["EDUCATIONAL MANAGEMENT", "GUIDANCE & COUNSELING", "PHYSICAL EDUCATION", "TEACHING ENGLISH", "TEACHING MATHEMATICS", "TEACHING SCIENCE"] },
  { course: "MASTER IN BUSINESS ADMINISTRATION", majors: [] },
  { course: "MASTER IN MANAGEMENT", majors: [] }
];

// UPDATED STEPS: Added 'Review' as Step 6
const steps = [
  { id: 1, name: "Personal", title: "Personal Information" },
  { id: 2, name: "Address", title: "Home Address" },
  { id: 3, name: "Academic", title: "Academic & Contact" },
  { id: 4, name: "Family", title: "Parents or Guardian" },
  { id: 5, name: "Photo", title: "Upload Formal Photo" },
  { id: 6, name: "Review", title: "Review Details" }, // New Step
  { id: 7, name: "Privacy", title: "Data Privacy" },
];

export default function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0); 

  // --- STATE: Personal ---
  const [lname, setLname] = useState("");
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [suffix, setSuffix] = useState("");
  const [nickname, setNickname] = useState("");
  const [bdate, setBdate] = useState("");

  // --- STATE: Address ---
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedBarangayCode, setSelectedBarangayCode] = useState("");

  // Get names for review display
  const provinceName = useMemo(() => provinceList.find(p => p.province_code === selectedProvinceCode)?.province_name || "", [selectedProvinceCode]);
  const cityName = useMemo(() => cityList.find(c => c.city_code === selectedCityCode)?.city_name || "", [selectedCityCode]);
  const barangayName = useMemo(() => barangayList.find(b => b.brgy_code === selectedBarangayCode)?.brgy_name || "", [selectedBarangayCode]);

  const sortedProvinceList = useMemo(() => {
    const target = "Davao del Norte"; 
    const priority = provinceList.find(p => p.province_name === target);
    const others = provinceList.filter(p => p.province_name !== target);
    others.sort((a, b) => a.province_name.localeCompare(b.province_name));
    return priority ? [priority, ...others] : others;
  }, []);

  const filteredCities = useMemo(() => {
    return cityList.filter(city => city.province_code === selectedProvinceCode);
  }, [selectedProvinceCode]);

  const filteredBarangays = useMemo(() => {
    return barangayList.filter(brgy => brgy.city_code === selectedCityCode);
  }, [selectedCityCode]);

  const handleProvinceChange = (code: string) => {
    setSelectedProvinceCode(code);
    setSelectedCityCode("");
    setSelectedBarangayCode("");
  };

  const handleCityChange = (code: string) => {
    setSelectedCityCode(code);
    setSelectedBarangayCode("");
  };

  // --- STATE: Academic ---
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [email, setEmail] = useState("");
  const [umEmail, setUmEmail] = useState(""); 

  // --- STATE: Family ---
  const [useGuardian, setUseGuardian] = useState(false);
  
  // Father
  const [fatherTitle, setFatherTitle] = useState("Mr.");
  const [fatherFname, setFatherFname] = useState("");
  const [fatherLname, setFatherLname] = useState("");
  const [fatherMname, setFatherMname] = useState("");
  const [fatherSuffix, setFatherSuffix] = useState("");

  // Mother
  const [motherTitle, setMotherTitle] = useState("Mrs.");
  const [motherFname, setMotherFname] = useState("");
  const [motherLname, setMotherLname] = useState("");
  const [motherMname, setMotherMname] = useState("");

  // Guardian
  const [guardianTitle, setGuardianTitle] = useState("Mrs.");
  const [guardianFname, setGuardianFname] = useState("");
  const [guardianLname, setGuardianLname] = useState("");
  const [guardianRel, setGuardianRel] = useState("");

  // --- STATE: Photo Upload ---
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMajors = useMemo(() => {
    return courseOptions.find(c => c.course === selectedCourse)?.majors || [];
  }, [selectedCourse]);

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    const courseData = courseOptions.find(c => c.course === value);
    if (courseData && courseData.majors.length === 0) {
      setSelectedMajor("N/A");
    } else {
      setSelectedMajor("");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const jumpToStep = (stepId: number) => {
    setDirection(stepId > currentStep ? 1 : -1);
    setCurrentStep(stepId);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      
      {/* --- HEADER (Full Width & Sticky) --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-amber-100/50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* Logo Area */}
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
              <span className="text-[8px] md:text-[10px] text-amber-700 uppercase tracking-[0.1em] font-bold mt-0.5">Registration</span>
            </div>
          </Link>

          {/* Action Button */}
          <Link href="/">
             <Button variant="ghost" size="sm" className="text-stone-500 hover:text-amber-900 text-xs md:text-sm">
               Exit Wizard
             </Button>
          </Link>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 md:px-6">
        
        {/* Progress Bar (Responsive) */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex justify-between relative z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={() => jumpToStep(step.id)}
                className={`flex flex-col items-center cursor-pointer group ${
                  step.id <= currentStep ? "text-amber-700 font-bold" : "text-gray-300"
                }`}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 text-xs md:text-sm font-bold transition-all duration-300 bg-white
                  ${
                    step.id <= currentStep
                      ? "border-amber-600 bg-amber-900 text-white shadow-md scale-110"
                      : "border-gray-200 text-gray-300 group-hover:border-amber-200"
                  }`}
                >
                  {step.id}
                </div>
                <span className="text-[10px] md:text-xs mt-2 hidden sm:block font-medium tracking-wide uppercase">{step.name}</span>
              </div>
            ))}
          </div>
          {/* Progress Line */}
          <div className="relative h-1 w-[90%] mx-auto bg-gray-200 rounded-full -mt-6 md:-mt-8 z-0">
             <div 
               className="absolute top-0 left-0 h-full bg-amber-500/50 transition-all duration-500 ease-out rounded-full"
               style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
             ></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="w-full max-w-2xl shadow-xl bg-white border-t-4 border-amber-900 rounded-xl overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-6 text-center md:text-left">
            <CardTitle className="text-xl md:text-2xl font-serif text-amber-950">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-stone-500 text-xs md:text-sm">
              Please provide accurate information for your yearbook entry.
            </CardDescription>
          </CardHeader>

          <CardContent className="min-h-[400px] pt-6">
            <motion.div
              key={currentStep}
              initial={{ x: direction * 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* --- STEP 1: PERSONAL --- */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="lname">Last Name <span className="text-red-500">*</span></Label>
                          <Input id="lname" value={lname} onChange={e => setLname(e.target.value)} placeholder="Dela Cruz" className="h-11" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="fname">First Name <span className="text-red-500">*</span></Label>
                          <Input id="fname" value={fname} onChange={e => setFname(e.target.value)} placeholder="Juan" className="h-11" />
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="mname">Middle Name</Label>
                          <Input id="mname" value={mname} onChange={e => setMname(e.target.value)} placeholder="Santos" className="h-11" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="suffix">Suffix</Label>
                          <Input id="suffix" value={suffix} onChange={e => setSuffix(e.target.value)} placeholder="Jr., III (Optional)" className="h-11" />
                      </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname (for Yearbook)</Label>
                    <Input id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Juanny" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bdate">Birthdate</Label>
                    <Input id="bdate" type="date" value={bdate} onChange={e => setBdate(e.target.value)} className="block w-full h-11" />
                  </div>
                </div>
              )}

              {/* --- STEP 2: ADDRESS --- */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                     <Label>Province</Label>
                     <Select value={selectedProvinceCode} onValueChange={handleProvinceChange}>
                       <SelectTrigger className="h-11">
                         <SelectValue placeholder="Select Province" />
                       </SelectTrigger>
                       <SelectContent className="max-h-[200px]">
                         {sortedProvinceList.map((prov) => (
                           <SelectItem key={prov.province_code} value={prov.province_code}>
                             {prov.province_name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label>Municipality / City</Label>
                     <Select 
                       value={selectedCityCode} 
                       onValueChange={handleCityChange}
                       disabled={!selectedProvinceCode}
                     >
                       <SelectTrigger className={`h-11 ${!selectedProvinceCode ? "bg-gray-100" : ""}`}>
                         <SelectValue placeholder="Select Municipality/City" />
                       </SelectTrigger>
                       <SelectContent className="max-h-[200px]">
                         {filteredCities.map((city) => (
                           <SelectItem key={city.city_code} value={city.city_code}>
                             {city.city_name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label>Barangay</Label>
                     <Select 
                       value={selectedBarangayCode} 
                       onValueChange={setSelectedBarangayCode}
                       disabled={!selectedCityCode}
                     >
                       <SelectTrigger className={`h-11 ${!selectedCityCode ? "bg-gray-100" : ""}`}>
                         <SelectValue placeholder="Select Barangay" />
                       </SelectTrigger>
                       <SelectContent className="max-h-[200px]">
                         {filteredBarangays.map((brgy) => (
                           <SelectItem key={brgy.brgy_code} value={brgy.brgy_code}>
                             {brgy.brgy_name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  </div>
                </div>
              )}

              {/* --- STEP 3: ACADEMIC --- */}
              {currentStep === 3 && (
                <div className="space-y-5">
                   <div className="space-y-2">
                    <Label>Program / Course</Label>
                    <Select onValueChange={handleCourseChange} value={selectedCourse}>
                      <SelectTrigger className="w-full h-auto min-h-[50px] py-3 text-left flex items-center">
                        <span className="whitespace-normal leading-tight block text-left w-full">
                           <SelectValue placeholder="Select Course" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] max-w-[90vw] md:max-w-[500px]">
                        {courseOptions.map((opt) => (
                          <SelectItem 
                            key={opt.course} 
                            value={opt.course}
                            className="py-3 border-b last:border-0 whitespace-normal text-left"
                          >
                            {opt.course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                     <Label>Major / Specialization</Label>
                     <Select 
                       value={selectedMajor} 
                       onValueChange={setSelectedMajor}
                       disabled={!selectedCourse || selectedMajor === "N/A"}
                     >
                       <SelectTrigger 
                         className={`w-full h-auto min-h-[50px] py-3 text-left items-center ${selectedMajor === "N/A" ? "bg-gray-100 text-gray-500" : ""}`}
                       >
                         <span className="whitespace-normal leading-tight block text-left w-full">
                            <SelectValue placeholder={selectedMajor === "N/A" ? "N/A (Not Applicable)" : "Select Major"} />
                         </span>
                       </SelectTrigger>
                       <SelectContent className="max-w-[90vw]">
                          {selectedMajor === "N/A" ? (
                            <SelectItem value="N/A">N/A</SelectItem>
                          ) : (
                            currentMajors.map((major) => (
                              <SelectItem key={major} value={major} className="py-2 whitespace-normal text-left">
                                {major}
                              </SelectItem>
                            ))
                          )}
                       </SelectContent>
                     </Select>
                  </div>

                  <div className="h-px bg-gray-200 my-2"></div>

                  <div className="space-y-2">
                      <Label>Primary Contact Number</Label>
                      <Input value={contactNum} onChange={e => setContactNum(e.target.value)} placeholder="09XXXXXXXXX" inputMode="numeric" className="h-11" />
                  </div>
                   <div className="space-y-2">
                      <Label>Personal Email Address</Label>
                      <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="h-11" />
                  </div>
                  {/* UM EMAIL FIELD */}
                  <div className="space-y-2">
                      <Label>UM Student Email</Label>
                      <Input type="email" value={umEmail} onChange={e => setUmEmail(e.target.value)} placeholder="IDNUMBER.tc@umindanao.edu.ph" className="h-11" />
                  </div>
                </div>
              )}

               {/* --- STEP 4: FAMILY (NOW CONNECTED TO STATE) --- */}
               {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <Checkbox 
                      id="guardian-mode" 
                      checked={useGuardian}
                      onCheckedChange={(checked) => setUseGuardian(checked as boolean)}
                    />
                    <Label htmlFor="guardian-mode" className="cursor-pointer text-amber-900 font-medium">
                      I live with a Guardian (Not Parents)
                    </Label>
                  </div>

                  {!useGuardian ? (
                    <>
                      {/* FATHER */}
                      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-4 border-b border-gray-100">
                          <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Father's Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={fatherLname} onChange={e => setFatherLname(e.target.value)} placeholder="Dela Cruz" className="h-10" />
                             </div>
                             <div className="space-y-2">
                                <Label>First Name</Label>
                                <div className="flex gap-2">
                                  <Select value={fatherTitle} onValueChange={setFatherTitle}>
                                    <SelectTrigger className="w-[80px] shrink-0 h-10"><SelectValue /></SelectTrigger>
                                    <SelectContent>{titleOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                  </Select>
                                  <Input value={fatherFname} onChange={e => setFatherFname(e.target.value)} placeholder="Juan" className="flex-1 h-10"/>
                                </div>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2"><Label>Middle Name</Label><Input value={fatherMname} onChange={e => setFatherMname(e.target.value)} placeholder="Santos" className="h-10" /></div>
                             <div className="space-y-2"><Label>Suffix</Label><Input value={fatherSuffix} onChange={e => setFatherSuffix(e.target.value)} placeholder="Jr." className="h-10" /></div>
                          </div>
                      </div>

                      {/* MOTHER */}
                      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Mother's Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={motherLname} onChange={e => setMotherLname(e.target.value)} placeholder="Dela Cruz" className="h-10" />
                             </div>
                             <div className="space-y-2">
                                <Label>First Name</Label>
                                <div className="flex gap-2">
                                  <Select value={motherTitle} onValueChange={setMotherTitle}>
                                    <SelectTrigger className="w-[80px] shrink-0 h-10"><SelectValue /></SelectTrigger>
                                    <SelectContent>{titleOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                  </Select>
                                  <Input value={motherFname} onChange={e => setMotherFname(e.target.value)} placeholder="Maria" className="flex-1 h-10"/>
                                </div>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2"><Label>Middle Name</Label><Input value={motherMname} onChange={e => setMotherMname(e.target.value)} placeholder="Santos" className="h-10" /></div>
                          </div>
                      </div>
                    </>
                  ) : (
                    /* GUARDIAN */
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Guardian's Information</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2"><Label>Last Name</Label><Input value={guardianLname} onChange={e => setGuardianLname(e.target.value)} placeholder="Last Name" className="h-10" /></div>
                         <div className="space-y-2">
                            <Label>First Name</Label>
                            <div className="flex gap-2">
                              <Select value={guardianTitle} onValueChange={setGuardianTitle}>
                                <SelectTrigger className="w-[80px] shrink-0 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>{titleOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                              </Select>
                              <Input value={guardianFname} onChange={e => setGuardianFname(e.target.value)} placeholder="First Name" className="flex-1 h-10"/>
                            </div>
                         </div>
                       </div>
                       <div className="space-y-2"><Label>Relationship</Label><Input value={guardianRel} onChange={e => setGuardianRel(e.target.value)} placeholder="e.g. Grandmother" className="h-10" /></div>
                    </div>
                  )}
                </div>
              )}

               {/* --- STEP 5: PHOTO --- */}
               {currentStep === 5 && (
                <div className="space-y-6">
                   <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                   />
                   <div 
                      onClick={triggerFileInput}
                      className="flex flex-col items-center justify-center py-10 space-y-4 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer min-h-[300px]"
                   >
                      {photoPreview ? (
                        <div className="relative group">
                           <img 
                             src={photoPreview} 
                             alt="Preview" 
                             className="w-48 h-48 object-cover rounded-md border-4 border-white shadow-xl rotate-1 group-hover:rotate-0 transition-transform duration-300" 
                           />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-md transition-opacity text-white text-sm font-bold">
                             Change Image
                           </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mb-2">
                            <UserCircle size={64} />
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-serif text-amber-900">Upload Formal Photo</p>
                            <p className="text-sm text-stone-500 mt-1">JPG or PNG, max 5MB</p>
                          </div>
                        </>
                      )}
                      <Button variant="outline" className="mt-4 pointer-events-none border-amber-200 text-amber-900">
                        {photoPreview ? "Replace Photo" : "Select from Device"}
                      </Button>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100 flex gap-3">
                      <div className="mt-0.5">ℹ️</div>
                      <div>
                        <strong>Requirements:</strong>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-blue-700/80">
                          <li>White background required</li>
                          <li>Wear formal attire (Toga or Business)</li>
                          <li>High resolution (not blurry)</li>
                        </ul>
                      </div>
                    </div>
                </div>
              )}

              {/* --- STEP 6: REVIEW DETAILS (UPDATED WITH PARENTS) --- */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <ClipboardCheck className="text-amber-700 w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-amber-900 text-lg">Confirm Your Details</h3>
                    </div>
                    
                    <div className="space-y-4 text-sm text-stone-700 divide-y divide-amber-200/50">
                      
                      {/* Personal Info Review */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                        <div>
                          <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">Full Name</span>
                          <span className="font-medium text-lg">{fname} {mname} {lname} {suffix}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">Nickname</span>
                          <span>{nickname || "-"}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">Birthdate</span>
                          <span>{bdate || "-"}</span>
                        </div>
                      </div>

                      {/* Address Review */}
                      <div className="py-4">
                        <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">Home Address</span>
                        <span>{barangayName}, {cityName}, {provinceName}</span>
                      </div>

                      {/* Academic Review */}
                      <div className="py-4">
                        <div className="mb-2">
                          <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">Course & Major</span>
                          <span className="font-medium">{selectedCourse}</span>
                          {selectedMajor !== "N/A" && <span className="block text-stone-500">{selectedMajor}</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                           <div>
                              <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">UM Email</span>
                              <span className="text-blue-700 font-medium">{umEmail || "-"}</span>
                           </div>
                           <div>
                              <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">Personal Email</span>
                              <span className="font-medium">{email || "-"}</span>
                           </div>
                           <div className="mt-2 md:col-span-2">
                              <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">Contact</span>
                              <span>{contactNum || "-"}</span>
                           </div>
                        </div>
                      </div>

                      {/* Family Information Review */}
                      <div className="py-4">
                        <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide mb-2">Family Information</span>
                        {useGuardian ? (
                          <div className="bg-white/50 p-2 rounded border border-amber-100">
                            <span className="text-xs text-stone-500 block">Guardian</span>
                            <span className="font-medium">{guardianTitle} {guardianFname} {guardianLname} ({guardianRel})</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2">
                            <div className="bg-white/50 p-2 rounded border border-amber-100">
                              <span className="text-xs text-stone-500 block">Father</span>
                              <span className="font-medium">{fatherTitle} {fatherFname} {fatherMname} {fatherLname} {fatherSuffix}</span>
                            </div>
                            <div className="bg-white/50 p-2 rounded border border-amber-100">
                              <span className="text-xs text-stone-500 block">Mother</span>
                              <span className="font-medium">{motherTitle} {motherFname} {motherMname} {motherLname}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Photo Review */}
                      <div className="pt-4">
                        <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide mb-2">Attached Photo</span>
                        {photoPreview ? (
                          <div className="flex items-center gap-3">
                            <img src={photoPreview} className="w-12 h-12 rounded-full object-cover border border-amber-300" />
                            <span className="text-green-700 font-medium text-xs">Photo Uploaded Successfully</span>
                          </div>
                        ) : (
                          <span className="text-red-500 text-xs italic">No photo uploaded</span>
                        )}
                      </div>

                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-stone-200 bg-stone-50 rounded-lg">
                      <Checkbox id="confirm-review" className="mt-1" />
                      <Label htmlFor="confirm-review" className="text-sm font-medium leading-snug cursor-pointer text-stone-700">
                          I hereby confirm that the details shown above are true, correct, and free from errors.
                      </Label>
                  </div>
                </div>
              )}

               {/* --- STEP 7: PRIVACY (Formerly Step 6) --- */}
               {currentStep === 7 && (
                <div className="space-y-4">
                  <div className="p-5 bg-stone-50 border border-stone-200 rounded-lg h-72 overflow-y-auto text-sm text-stone-600 leading-relaxed text-justify pr-2">
                      <h4 className="font-bold text-amber-900 mb-3 text-base">Data Privacy Consent</h4>
                      <p className="mb-3">
                          In compliance with the <strong>Data Privacy Act of 2012 (R.A. 10173)</strong>, I hereby authorize the AURIUM Yearbook Committee of the University of Mindanao Tagum College to collect, process, and store the personal data indicated herein for the purpose of the yearbook publication.
                      </p>
                      <p className="mb-3">
                          I understand that my information will be used solely for:
                      </p>
                      <ul className="list-disc pl-5 mb-3 space-y-1">
                        <li>Verification of graduate status.</li>
                        <li>Layout and design of the yearbook pages.</li>
                        <li>Communication regarding yearbook distribution.</li>
                      </ul>
                      <p>
                          I attest that all information provided is true and correct.
                      </p>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border border-amber-100 bg-amber-50/50 rounded-lg">
                      <Checkbox id="terms" className="mt-1" />
                      <Label htmlFor="terms" className="text-sm font-medium leading-snug cursor-pointer text-amber-900">
                          I have read and understood the Data Privacy Statement and agree to the processing of my personal data.
                      </Label>
                  </div>
                </div>
              )}

            </motion.div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-stone-100 bg-stone-50/50 p-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="text-stone-500 hover:text-stone-800"
            >
              Previous
            </Button>
            <Button 
              className="bg-amber-900 hover:bg-amber-800 text-white min-w-[140px] shadow-lg shadow-amber-900/20"
              onClick={handleNext}
            >
              {currentStep === 7 ? "Submit Registration" : "Next Step"}
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-stone-200 py-8 mt-auto">
        <div className="container mx-auto px-6 text-center text-xs text-stone-400">
          <p className="mb-2">&copy; 2026 AURIUM Yearbook Committee. All rights reserved.</p>
          <div className="flex justify-center gap-4">
             <Link href="#" className="hover:text-amber-700">Privacy Policy</Link>
             <span className="text-stone-300">•</span>
             <Link href="#" className="hover:text-amber-700">Terms of Use</Link>
             <span className="text-stone-300">•</span>
             <Link href="#" className="hover:text-amber-700">Get Help</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}