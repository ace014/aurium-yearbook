"use client";

import { useState } from "react";
import { StaffSidebar } from "@/components/staff/dashboard/StaffSidebar";
import { StaffHeader } from "@/components/staff/dashboard/StaffHeader";
import { VerificationTab } from "@/components/staff/dashboard/VerificationTab";
import { NotesTab } from "@/components/staff/dashboard/NotesTab";
import { ProfileTab } from "@/components/staff/dashboard/ProfileTab";

const INITIAL_STAFF_USER = {
  name: "Ms. Sarah Jenkins",
  role: "Yearbook Coordinator",
  id: "STF-2026-01",
  department: "Student Affairs",
  email: "staff@aurium.edu.ph",
  avatar: "https://github.com/shadcn.png"
};

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("verification");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [staffUser, setStaffUser] = useState(INITIAL_STAFF_USER);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans relative selection:bg-amber-100 selection:text-amber-900">
      
      {/* SIDEBAR (Desktop & Mobile) */}
      <StaffSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        staffUser={staffUser}
      />

      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto h-screen bg-[#FDFBF7]">
        
        {/* SHARED HEADER */}
        <StaffHeader 
          activeTab={activeTab} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          hasSelection={!!selectedStudent && activeTab === 'verification'}
          onClearSelection={() => setSelectedStudent(null)}
        />

        {/* CONTENT TABS */}
        {activeTab === "verification" && (
            <VerificationTab 
                staffUser={staffUser} 
                selectedStudent={selectedStudent} 
                setSelectedStudent={setSelectedStudent} 
            />
        )}
        
        {activeTab === "notes" && <NotesTab />}
        
        {activeTab === "profile" && (
            <ProfileTab staffUser={staffUser} setStaffUser={setStaffUser} />
        )}

      </main>
    </div>
  );
}