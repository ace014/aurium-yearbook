"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
// BAG-O: Nag-add ko og Loader2 diri para sa atong nindot nga loading animation
import { CheckCircle, Clock, Loader2, LogOut } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import { StudentHeader } from "@/components/student/dashboard/StudentHeader";
import { ProfileCard } from "@/components/student/dashboard/ProfileCard";
import { BookingWidget } from "@/components/student/dashboard/BookingWidget";
import { YearbookTeaser } from "@/components/student/dashboard/YearbookTeaser";
import { YearbookPreview } from "@/components/student/dashboard/YearbookPreview";
import { useRouter } from "next/navigation"; 

// BAG-O: I-import ang toast
import toast from "react-hot-toast";

import { Booking, Schedule } from "@/types/index";
import * as studentService from "@/app/student/studentService";
import { Student } from "@/types";

export default function StudentDashboard() {
  const router = useRouter(); 
  const [user, setUser] = useState<Student | null>(null);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [booking, setBooking] = useState<Booking>();
  
  const [showPreview, setShowPreview] = useState(false);
  
  // @Koi: State para mu-gawas ang Logout Confirmation Modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchStudent = useCallback(async () => {
    try {
      const res = await studentService.getStudentProfile(); 
      console.log(res);

      const hasBooking = res.booking.length > 0 ? res.booking[0] : null;
      if (hasBooking) setBooking(hasBooking);

      setUser(res);
    } catch(err) {
      console.error(err);
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await studentService.fetchSchedules();
      setSchedule(res);
    } catch(err) {
      console.error(err);
    }
  }, []); 

  useEffect(() => {
    fetchStudent();
    fetchSchedules();
  }, [fetchStudent, fetchSchedules]);

  const handleBooking = async (booking_id: number, period: string) => {
    const res = await studentService.addBook(booking_id, period)

    if (!res) {
      toast.error("Something went wrong submitting the book!");
    } else {
      toast.success("Successfully booked! Please be on time!");
      fetchStudent(); 
    }
  };

  // @Koi: Tinuod nga Logout Handler
  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      // 1. I-clear ang local storage basin naa siyay gibilin diri
      localStorage.clear();
      sessionStorage.clear();

      // 2. I-call ang API sa backend para i-clear ang HTTP Cookies. 
      // (Basta mag-logout sa Next.js, kailangan naay API call para ma-destroy ang session sa server)
      await fetch('http://localhost:4000/api/student/logout', { method: 'POST' }).catch(() => {});

      toast.success("You have successfully logged out.");
      
      // 3. I-redirect sa Landing Page (/) unya i-refresh para limpyo ang state
      window.location.href = "/"; 
    } catch (err) {
      toast.error("Failed to log out properly.");
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  // BAG-O: Gi-ilisan ang plain nga "Loading..." og nindot nga spinner UI
  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600 mb-4" />
        <p className="text-stone-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (showPreview) {
    return <YearbookPreview user={user} onClose={() => setShowPreview(false)} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans relative">
      
      {/* @Koi: Gipasa nako ang setShowLogoutConfirm(true) padulong sa header imbes lahos logout */}
      <StudentHeader 
        user={{ fname: user.first_name, idNumber: user.student_number, photoUrl: undefined}} 
        onLogout={() => setShowLogoutConfirm(true)} 
      />

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* DASHBOARD TITLE */}
        <header className="md:flex justify-between items-end pb-6 border-b border-stone-200">
            <div>
                <h1 className="text-3xl font-serif font-bold text-stone-800">Student Dashboard</h1>
                <p className="text-stone-500 mt-2">Welcome to the official University of Mindanao Yearbook Portal.</p>
            </div>
            {user && user.studentAuth?.status === 'FULLY_VERIFIED' ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-sm border-green-200 gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified Graduate
                </Badge>
            ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 gap-1">
                    <Clock className="w-3 h-3" /> Verification Pending
                </Badge>
            )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <ProfileCard
            fullName={`${user.first_name} ${user.last_name}`}
            idNumber={user.student_number}
            course={user.course}
            photoUrl={user.photo_url}
            onCheckEntry={() => setShowPreview(true)} 
          />

          <BookingWidget
            bookingList={schedule}
            booking={booking} 
            idNumber={user.student_number}
            onBook={handleBooking}
          />

          {/* 3. Yearbook Teaser Component */}
          <YearbookTeaser />

        </div>
      </main>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Ready to leave?</h3>
            <p className="text-stone-500 text-sm mb-6">
              Are you sure you want to log out of your student portal?
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}