"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; 

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

const steps = [
  { id: 1, name: "Personal", title: "Personal Information" },
  { id: 2, name: "Address", title: "Home Address" },
  { id: 3, name: "Academic", title: "Academic & Contact" },
  { id: 4, name: "Family", title: "Parents or Guardian" },
  { id: 5, name: "Photo", title: "Upload Formal Photo" },
  { id: 6, name: "Privacy", title: "Data Privacy" },
];

export default function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0); 

  // --- STATE: Address ---
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedBarangayCode, setSelectedBarangayCode] = useState("");

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

  // --- STATE: Family ---
  const [useGuardian, setUseGuardian] = useState(false);
  const [fatherTitle, setFatherTitle] = useState("Mr.");
  const [motherTitle, setMotherTitle] = useState("Mrs.");
  const [guardianTitle, setGuardianTitle] = useState("Mrs.");

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
    <div className="w-full max-w-lg mx-auto p-4">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => jumpToStep(step.id)}
            className={`flex flex-col items-center cursor-pointer ${
              step.id <= currentStep ? "text-yellow-600 font-bold" : "text-gray-300"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors duration-300
              ${
                step.id <= currentStep
                  ? "border-yellow-600 bg-amber-900 text-white"
                  : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {step.id}
            </div>
            <span className="text-[10px] mt-1 hidden sm:block">{step.name}</span>
          </div>
        ))}
      </div>

      <Card className="shadow-xl bg-white border-t-4 border-amber-900">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-amber-900">
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          <motion.div
            key={currentStep}
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="lname">Last Name</Label>
                        <Input id="lname" placeholder="Dela Cruz" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fname">First Name</Label>
                        <Input id="fname" placeholder="Juan" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="mname">Middle Name</Label>
                        <Input id="mname" placeholder="Santos" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suffix">Suffix</Label>
                        <Input id="suffix" placeholder="Jr., III (Optional)" />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input id="nickname" placeholder="Juanny" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bdate">Birthdate</Label>
                  <Input id="bdate" type="date" className="block w-full" />
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                   <Label>Province</Label>
                   <Select value={selectedProvinceCode} onValueChange={handleProvinceChange}>
                     <SelectTrigger>
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
                     <SelectTrigger className={!selectedProvinceCode ? "bg-gray-100" : ""}>
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
                     <SelectTrigger className={!selectedCityCode ? "bg-gray-100" : ""}>
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

            {/* STEP 3: ACADEMIC */}
            {currentStep === 3 && (
              <div className="space-y-4">
                 <div className="space-y-2">
                  <Label>Course</Label>
                  <Select onValueChange={handleCourseChange} value={selectedCourse}>
                    {/* FIX: 
                        1. h-auto & min-h allows growth.
                        2. [&>span]:whitespace-normal targets the inner SelectValue text and forces it to wrap.
                        3. text-left & items-start ensures multi-line text looks good.
                    */}
                    <SelectTrigger className="w-full h-auto min-h-[48px] py-3 text-left items-center [&>span]:whitespace-normal [&>span]:leading-snug">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    
                    <SelectContent className="max-h-[300px] max-w-[90vw]">
                      {courseOptions.map((opt) => (
                        <SelectItem 
                          key={opt.course} 
                          value={opt.course}
                          className="py-3 border-b last:border-0 whitespace-normal text-left leading-snug"
                        >
                          {opt.course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                   <Label>Major</Label>
                   <Select 
                     value={selectedMajor} 
                     onValueChange={setSelectedMajor}
                     disabled={!selectedCourse || selectedMajor === "N/A"}
                   >
                     <SelectTrigger 
                       className={`w-full h-auto min-h-[48px] py-3 text-left items-center [&>span]:whitespace-normal [&>span]:leading-snug ${selectedMajor === "N/A" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
                     >
                        <SelectValue placeholder={selectedMajor === "N/A" ? "N/A (Not Applicable)" : "Select Major"} />
                     </SelectTrigger>
                     <SelectContent className="max-w-[90vw]">
                        {selectedMajor === "N/A" ? (
                          <SelectItem value="N/A">N/A</SelectItem>
                        ) : (
                          currentMajors.map((major) => (
                            <SelectItem key={major} value={major} className="py-2 whitespace-normal text-left leading-snug">
                              {major}
                            </SelectItem>
                          ))
                        )}
                     </SelectContent>
                   </Select>
                </div>

                <hr className="border-gray-200 my-4"/>

                <div className="space-y-2">
                    <Label>Primary Contact Number</Label>
                    <Input placeholder="09XXXXXXXXX" inputMode="numeric" />
                </div>
                 <div className="space-y-2">
                    <Label>Personal Email Address</Label>
                    <Input type="email" placeholder="you@email.com" />
                </div>
              </div>
            )}

             {/* STEP 4: PARENTS OR GUARDIAN */}
             {currentStep === 4 && (
              <div className="space-y-6">
                
                <div className="flex items-center space-x-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
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
                    {/* FATHER INFORMATION */}
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 border-b pb-4">
                        <h3 className="font-bold text-amber-900 text-sm">Father's Information</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label>Last Name</Label>
                              <Input placeholder="Dela Cruz" />
                           </div>
                           
                           <div className="space-y-2">
                              <Label>First Name</Label>
                              <div className="flex gap-2">
                                <Select value={fatherTitle} onValueChange={setFatherTitle}>
                                  <SelectTrigger className="w-[85px] shrink-0"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {titleOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                <Input placeholder="Juan" className="flex-1"/>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label>Middle Name</Label>
                              <Input placeholder="Santos" />
                           </div>
                           <div className="space-y-2">
                              <Label>Suffix</Label>
                              <Input placeholder="Jr., III (Optional)" />
                           </div>
                        </div>

                        <div className="space-y-2">
                             <Label>Contact Number</Label>
                             <Input placeholder="09XXXXXXXXX" inputMode="numeric"/>
                        </div>
                    </div>

                    {/* MOTHER INFORMATION */}
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="font-bold text-amber-900 text-sm">Mother's Information</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label>Last Name</Label>
                              <Input placeholder="Dela Cruz" />
                           </div>
                           
                           <div className="space-y-2">
                              <Label>First Name</Label>
                              <div className="flex gap-2">
                                <Select value={motherTitle} onValueChange={setMotherTitle}>
                                  <SelectTrigger className="w-[85px] shrink-0"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {titleOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                <Input placeholder="Maria" className="flex-1"/>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label>Middle Name</Label>
                              <Input placeholder="Santos" />
                           </div>
                           <div className="space-y-2">
                              <Label>Suffix</Label>
                              <Input placeholder="(Optional)" />
                           </div>
                        </div>

                        <div className="space-y-2">
                             <Label>Contact Number</Label>
                             <Input placeholder="09XXXXXXXXX" inputMode="numeric"/>
                        </div>
                    </div>
                  </>
                ) : (
                  /* GUARDIAN INFORMATION */
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="space-y-3">
                        <h3 className="font-bold text-amber-900 text-sm">Guardian's Information</h3>
                        
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label>Last Name</Label>
                              <Input placeholder="Last Name" />
                           </div>
                           
                           <div className="space-y-2">
                              <Label>First Name</Label>
                              <div className="flex gap-2">
                                <Select value={guardianTitle} onValueChange={setGuardianTitle}>
                                  <SelectTrigger className="w-[85px] shrink-0"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {titleOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                <Input placeholder="First Name" className="flex-1"/>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label>Middle Name</Label>
                              <Input placeholder="Middle Name" />
                           </div>
                           <div className="space-y-2">
                              <Label>Suffix</Label>
                              <Input placeholder="(Optional)" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label>Relationship</Label>
                              <Input placeholder="e.g. Aunt, Grandmother" />
                           </div>
                           <div className="space-y-2">
                              <Label>Contact Number</Label>
                              <Input placeholder="09XXXXXXXXX" inputMode="numeric"/>
                           </div>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            )}

             {/* STEP 5: PHOTO UPLOAD */}
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
                    className="flex flex-col items-center justify-center py-8 space-y-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer min-h-[250px]"
                 >
                    {photoPreview ? (
                      <div className="relative group">
                         <img 
                           src={photoPreview} 
                           alt="Preview" 
                           className="w-40 h-40 object-cover rounded-full border-4 border-amber-900 shadow-lg" 
                         />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-full transition-opacity text-white text-xs font-bold">
                           Change
                         </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-900 text-3xl">
                          📷
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-medium text-amber-900">Click to Upload Photo</p>
                          <p className="text-sm text-gray-500">JPG or PNG, max 5MB</p>
                        </div>
                      </>
                    )}
                    <Button variant="secondary" className="mt-4 pointer-events-none">
                      {photoPreview ? "Change Photo" : "Select Photo"}
                    </Button>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-md text-sm text-amber-800 border border-amber-200">
                    <strong>Important:</strong> Please upload a recent 2x2 or Formal ID picture. Ensure your face is clear.
                  </div>
              </div>
            )}

             {/* STEP 6: PRIVACY */}
             {currentStep === 6 && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border rounded-md h-64 overflow-y-auto text-sm text-gray-600">
                    <p className="font-bold mb-2">Data Privacy Act Agreement</p>
                    <p>
                        I hereby agree that all personal data provided in this form may be collected, processed, and stored by the AURIUM Yearbook Committee.
                    </p>
                    <p className="mt-2">
                        I understand that my information will be handled in accordance with the Data Privacy Act of 2012.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm font-medium leading-none">
                        I agree to the Data Privacy Statement
                    </Label>
                </div>
              </div>
            )}

          </motion.div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button 
            className="bg-amber-900 hover:bg-amber-800 text-white min-w-[100px]"
            onClick={handleNext}
          >
            {currentStep === 6 ? "Create Account" : "Next Step"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}