"use client";

import Link from "next/link";
import { Users, StickyNote, User, ScanLine, X, LogOut, Home } from "lucide-react"; // Added Home icon
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { BrandLogo } from "./BrandLogo";

interface StaffSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  staffUser: any;
}

export function StaffSidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, staffUser }: StaffSidebarProps) {
  return (
    <>
      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            
            <aside className="relative w-72 bg-stone-950 text-stone-300 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 h-full border-r border-stone-800">
                <div className="p-6 border-b border-stone-800/50 flex items-center justify-between">
                    <BrandLogo />
                    <Button variant="ghost" size="icon" className="text-stone-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-2 px-3">Menu</p>
                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "verification" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { setActiveTab("verification"); setIsMobileMenuOpen(false); }}
                    >
                        <Users size={18} className={activeTab === "verification" ? "text-amber-400" : "text-stone-500"} /> Graduate Verification
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "notes" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { setActiveTab("notes"); setIsMobileMenuOpen(false); }}
                    >
                        <StickyNote size={18} className={activeTab === "notes" ? "text-amber-400" : "text-stone-500"} /> Staff Notes
                    </Button>

                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-12 ${activeTab === "profile" ? "bg-amber-900/40 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
                        onClick={() => { setActiveTab("profile"); setIsMobileMenuOpen(false); }}
                    >
                        <User size={18} className={activeTab === "profile" ? "text-amber-400" : "text-stone-500"} /> My Profile
                    </Button>

                    {/* ACTION LINKS */}
                    <div className="pt-4 mt-4 border-t border-stone-800/50 space-y-2">
                        <Link href="/admin/scanner" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-stone-400 hover:text-green-400 hover:bg-stone-900 h-12">
                                <ScanLine size={18} /> Attendance Scanner
                            </Button>
                        </Link>
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-stone-400 hover:text-amber-400 hover:bg-stone-900 h-12">
                                <Home size={18} /> Return to Website
                            </Button>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-stone-800/50 bg-stone-950">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="border-2 border-stone-700">
                            <AvatarImage src={staffUser.avatar} />
                            <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{staffUser.name}</p>
                            <p className="text-[10px] text-stone-500 truncate uppercase tracking-wider">{staffUser.role}</p>
                        </div>
                    </div>
                    {/* LOGOUT CONFIRMATION (Mobile) */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-center gap-2 text-red-400 border-red-900/30 bg-red-900/10 hover:bg-red-900/20 hover:text-red-300">
                                <LogOut size={16} /> Sign Out
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[90%] rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Confirm Logout</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to end your session? You will be redirected to the landing page.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Link href="/" className="w-full">
                                    <Button variant="destructive" className="w-full">Yes, Log Out</Button>
                                </Link>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </aside>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-72 bg-stone-950 text-stone-300 hidden md:flex flex-col h-screen fixed left-0 top-0 z-20 border-r border-stone-800 shadow-2xl">
        <div className="p-8 border-b border-stone-800/50 flex items-center justify-center">
             <BrandLogo />
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-2 px-3">Menu</p>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === "verification" ? "bg-amber-900/30 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
            onClick={() => setActiveTab("verification")}
          >
            <Users size={18} className={activeTab === "verification" ? "text-amber-500" : "text-stone-500"} /> Graduate Verification
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === "notes" ? "bg-amber-900/30 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
            onClick={() => setActiveTab("notes")}
          >
            <StickyNote size={18} className={activeTab === "notes" ? "text-amber-500" : "text-stone-500"} /> Staff Notes
          </Button>

          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all ${activeTab === "profile" ? "bg-amber-900/30 text-amber-100 border-r-2 border-amber-500" : "hover:text-white hover:bg-stone-900"}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} className={activeTab === "profile" ? "text-amber-500" : "text-stone-500"} /> My Profile
          </Button>

          {/* ACTION LINKS */}
          <div className="pt-6 mt-6 border-t border-stone-800/50 space-y-2">
            <Link href="/admin/scanner">
              <Button variant="ghost" className="w-full justify-start gap-4 text-stone-400 hover:text-green-400 hover:bg-stone-900 h-12">
                <ScanLine size={18} /> Attendance Scanner
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-4 text-stone-400 hover:text-amber-400 hover:bg-stone-900 h-12">
                <Home size={18} /> Return to Website
              </Button>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-stone-800/50 bg-stone-950">
          <div className="flex items-center gap-3 mb-6 bg-stone-900/50 p-3 rounded-xl border border-stone-800">
            <Avatar className="border border-stone-600 h-10 w-10">
              <AvatarImage src={staffUser.avatar} />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{staffUser.name}</p>
              <p className="text-[10px] text-stone-500 truncate uppercase tracking-wider">{staffUser.role}</p>
            </div>
          </div>
          {/* LOGOUT CONFIRMATION (Desktop) */}
          <Dialog>
             <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    <LogOut size={18} /> Sign Out
                </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-stone-800">Confirm Logout</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to end your session? You will be redirected to the landing page.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button variant="destructive" className="w-full">Yes, Log Out</Button>
                    </Link>
                </DialogFooter>
             </DialogContent>
          </Dialog>
        </div>
      </aside>
    </>
  );
}