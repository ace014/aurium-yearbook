"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, ArrowLeft, Bell, Info, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "./BrandLogo";

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "New Registration", message: "Student 2020-00999 has registered.", time: "2 mins ago", type: "info", read: false },
  { id: 2, title: "Photo Update", message: "Juan Dela Cruz updated their profile photo.", time: "1 hour ago", type: "success", read: false },
  { id: 3, title: "System Alert", message: "Scheduled maintenance tonight at 11 PM.", time: "5 hours ago", type: "warning", read: false },
  { id: 4, title: "Verification", message: "Maria Clara is requesting verification.", time: "1 day ago", type: "info", read: true },
];

interface StaffHeaderProps {
  activeTab: string;
  setIsMobileMenuOpen: (open: boolean) => void;
  hasSelection: boolean;
  onClearSelection: () => void;
}

export function StaffHeader({ activeTab, setIsMobileMenuOpen, hasSelection, onClearSelection }: StaffHeaderProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  return (
    <header className="flex items-center justify-between mb-8 py-4 border-b border-stone-200/50">
        <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden text-stone-500 hover:text-amber-900" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
            </Button>

            {/* Back Button only appears when a student is selected */}
            {hasSelection ? (
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="rounded-full hover:bg-stone-200 text-stone-600"
                   onClick={onClearSelection} 
                 >
                    <ArrowLeft className="h-5 w-5" />
                 </Button>
            ) : null}

            {/* HEADER TITLE / LOGO */}
            <div className="flex items-center gap-3">
                <div className="md:hidden">
                    <BrandLogo dark />
                </div>
                <div className="hidden md:block">
                    <h1 className="text-2xl font-serif font-bold text-stone-800">
                        {activeTab === 'verification' && "Graduate Verification"}
                        {activeTab === 'notes' && "Staff Notes"}
                        {activeTab === 'profile' && "My Profile"}
                    </h1>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full shadow-sm text-xs font-medium text-stone-500">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               System Online
            </div>
            
            {/* NOTIFICATION DROPDOWN */}
            <div className="relative" ref={notificationRef}>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-stone-400 hover:text-amber-800 relative rounded-full hover:bg-amber-50"
                    onClick={() => {
                         setIsNotificationsOpen(!isNotificationsOpen);
                         if (!isNotificationsOpen) markAllAsRead();
                    }}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                         <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                </Button>
                
                {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 backdrop-blur">
                            <h4 className="font-bold text-stone-800 text-sm">Notifications</h4>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">{unreadCount} Unread</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div key={notif.id} className={`p-4 border-b border-stone-50 flex gap-3 hover:bg-stone-50 transition-colors ${!notif.read ? 'bg-amber-50/30' : ''}`}>
                                        <div className={`p-2 rounded-full h-fit shrink-0 ${
                                            notif.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                            notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                            'bg-amber-100 text-amber-600'
                                        }`}>
                                            {notif.type === 'info' && <Info size={14} />}
                                            {notif.type === 'success' && <Check size={14} />}
                                            {notif.type === 'warning' && <AlertCircle size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-stone-800">{notif.title}</p>
                                            <p className="text-xs text-stone-500 leading-relaxed mb-1">{notif.message}</p>
                                            <p className="text-[10px] text-stone-400 font-medium">{notif.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-stone-400 text-xs">No new notifications.</div>
                            )}
                        </div>
                        <div className="p-2 border-t border-stone-100 bg-stone-50 text-center">
                            <button className="text-xs font-bold text-amber-700 hover:underline" onClick={markAllAsRead}>Mark all as read</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </header>
  );
}