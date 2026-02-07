"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image"; 
import { Button } from "@/components/ui/button";
import { Bell, Menu, ArrowLeft, BookOpen, Calendar } from "lucide-react";

// Modular Imports
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { VerificationTab } from "@/components/admin/tabs/VerificationTab";
import { ProfileTab } from "@/components/admin/tabs/ProfileTab";
import { MasterlistTab } from "@/components/admin/tabs/MasterlistTab";
import { SchedulesTab } from "@/components/admin/tabs/SchedulesTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("verification"); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [staffUser, setStaffUser] = useState({ name: "Admin User", role: "Head Moderator", email: "admin@aurium.edu.ph", avatar: "https://github.com/shadcn.png" });

  // --- 1. KOII'S API LOGIC ---
  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/student/fetch'); 
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setPendingStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPendingStudents([]); 
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    localStorage.setItem("aurium_admin_session", "true"); 
  }, [fetchStudents]);

  const handleVerify = async (studentId: number) => {
    try {
      await fetch("http://localhost:4000/api/admin/student/verify", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: studentId })
      });
      setPendingStudents(prev => prev.filter(s => s.StudentAuth?.student_number !== studentId));
      alert(`Student Verified!`);
    } catch (err) {
      console.error(err); alert("Verification failed.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans relative">
      {isMobileMenuOpen && (
         <div className="fixed inset-0 z-50 md:hidden bg-black/80" onClick={() => setIsMobileMenuOpen(false)}>
             <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobile={true} setIsOpen={setIsMobileMenuOpen} user={staffUser} onLogout={() => localStorage.removeItem("aurium_admin_session")}/>
         </div>
      )}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobile={false} user={staffUser} onLogout={() => localStorage.removeItem("aurium_admin_session")}/>

      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto h-screen bg-[#FDFBF7]">
        
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between mb-8 py-4 border-b border-stone-200/50">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Button variant="ghost" size="icon" className="md:hidden text-stone-500" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu className="h-6 w-6"/>
                </Button>

                {/* --- CORRECTED MOBILE BRANDING --- */}
                <div className="flex items-center gap-3 md:hidden">
                    {/* UMTC Logo */}
                    <div className="relative w-8 h-8 overflow-hidden hover:scale-105 transition-transform duration-300">
                       <Image src="/images/umtc-logo.png" alt="UMTC" fill className="object-contain" />
                    </div>
                    {/* Vertical Divider */}
                    <div className="h-8 w-[1px] bg-stone-300"></div>
                    {/* Aurium Logo */}
                    <div className="relative w-8 h-8 overflow-hidden hover:scale-105 transition-transform duration-300">
                       <Image src="/images/aurium-logo.png" alt="Aurium" fill className="object-contain" />
                    </div>
                    {/* Text Stack */}
                    <div className="flex flex-col justify-center">
                       <span className="text-lg font-serif font-bold text-stone-800 leading-none tracking-tight">AURIUM</span>
                       <span className="text-[8px] text-amber-600 uppercase tracking-widest font-bold">Moderator</span>
                    </div>
                </div>

                {/* Desktop Title (Hidden on mobile) */}
                <h1 className="text-2xl font-serif font-bold text-stone-800 hidden md:block">
                    {activeTab === 'verification' && "Verification Queue"}
                    {activeTab === 'slots' && "Schedule Manager"}
                    {activeTab === 'masterlist' && "Verified Masterlist"}
                    {activeTab === 'scanner' && "Attendance Scanner"}
                    {activeTab === 'profile' && "My Profile"}
                </h1>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
               <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full shadow-sm text-xs font-medium text-stone-500">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> System Online
               </div>
               <Button variant="ghost" size="icon" className="relative rounded-full text-stone-400 hover:text-amber-800">
                   <Bell className="h-5 w-5"/>
                   <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
               </Button>
            </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "verification" && <VerificationTab pendingStudents={pendingStudents} onVerify={handleVerify} />}
            {activeTab === "profile" && <ProfileTab user={staffUser} setUser={setStaffUser} />}
            {activeTab === 'masterlist' && <MasterlistTab />}
            {activeTab === 'slots' && <SchedulesTab />}
        </div>
      </main>
    </div>
  );
}