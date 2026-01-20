"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// --- MOCK QUEUE DATA ---
// In a real app, this would come from your Database via API/Websockets
const MOCK_QUEUE = [
  { id: 1, name: "Juan Dela Cruz", photo: "https://github.com/shadcn.png", status: "inside" },
  { id: 2, name: "Maria Clara", photo: "https://github.com/shadcn.png", status: "inside" },
  { id: 3, name: "Pedro Penduko", photo: "https://github.com/shadcn.png", status: "inside" },
  { id: 4, name: "Jose Rizal", photo: "https://github.com/shadcn.png", status: "inside" },
  { id: 5, name: "Andres Boni", photo: "https://github.com/shadcn.png", status: "inside" },
  
  // Next in line
  { id: 6, name: "Gabriela Silang", photo: "https://github.com/shadcn.png", status: "waiting" },
  { id: 7, name: "Antonio Luna", photo: "https://github.com/shadcn.png", status: "waiting" },
  { id: 8, name: "Apolinario Mabini", photo: "https://github.com/shadcn.png", status: "waiting" },
  { id: 9, name: "Melchora Aquino", photo: "https://github.com/shadcn.png", status: "waiting" },
  { id: 10, name: "Emilio Aguinaldo", photo: "https://github.com/shadcn.png", status: "waiting" },
];

export default function QueuePage() {
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const serving = MOCK_QUEUE.filter(q => q.status === 'inside').slice(0, 5);
  const waiting = MOCK_QUEUE.filter(q => q.status === 'waiting').slice(0, 5);

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans flex flex-col overflow-hidden">
      
      {/* HEADER BAR */}
      <header className="bg-amber-900/20 border-b border-amber-900/50 p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center font-serif font-bold text-2xl">A</div>
            <div>
                <h1 className="text-2xl font-serif font-bold tracking-wider text-amber-50">NOW SERVING</h1>
                <p className="text-amber-500/80 text-sm uppercase tracking-[0.2em] font-bold">Pictorial Queue</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-4xl font-mono font-bold text-stone-100">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-stone-500 text-sm uppercase tracking-widest">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 flex flex-col gap-8">
        
        {/* SECTION 1: NOW PHOTOGRAPHING (Big) */}
        <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <h2 className="text-xl font-bold text-stone-400 uppercase tracking-widest">Currently Inside Studio</h2>
            </div>
            
            <div className="grid grid-cols-5 gap-6 h-[400px]">
                {serving.map((student) => (
                    <Card key={student.id} className="bg-stone-900 border-amber-600/30 border-t-4 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
                        <img 
                            src={student.photo} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-6 z-20 text-center">
                            <h3 className="text-2xl font-bold text-white leading-tight mb-1">{student.name}</h3>
                            <Badge className="bg-green-600 hover:bg-green-600 text-[10px]">IN SESSION</Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* SECTION 2: UP NEXT (Smaller) */}
        <div className="h-48">
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">Up Next in Queue</h2>
            <div className="grid grid-cols-5 gap-4">
                {waiting.map((student, idx) => (
                    <div key={student.id} className="flex items-center gap-4 bg-stone-900/50 p-3 rounded-lg border border-stone-800">
                        <span className="text-2xl font-bold text-stone-700 font-mono">0{idx + 1}</span>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-stone-600">
                                <AvatarImage src={student.photo} />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-stone-300 truncate text-sm">{student.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* FOOTER TICKER */}
      <footer className="bg-amber-950 py-3 px-6">
        <div className="flex items-center gap-2 text-amber-200/80 text-sm overflow-hidden whitespace-nowrap">
            <InfoIcon className="w-4 h-4" />
            <span className="animate-marquee">
                Please prepare your receipt and student ID before entering. Do not leave the waiting area once your name is on the "Up Next" list. 
                Next batch: Please fix your hair and attire now.
            </span>
        </div>
      </footer>
    </div>
  );
}

function InfoIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    )
}