"use client";

import { useState, useEffect } from "react";
import { 
  ScanLine, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  User, 
  History 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- MOCK DATABASE OF STUDENTS ---
const STUDENTS_DB = [
  { 
    id: "2020-00123", 
    name: "Juan Dela Cruz", 
    photo: "https://github.com/shadcn.png", 
    schedule: { date: "2026-03-15", session: "AM" } 
  },
  { 
    id: "2020-00456", 
    name: "Maria Clara", 
    photo: "https://github.com/shadcn.png", 
    schedule: { date: "2026-03-15", session: "PM" } // Scheduled for PM
  },
];

export default function ScannerPage() {
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<"idle" | "success" | "error">("idle");
  const [scannedStudent, setScannedStudent] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Simulate "Today's Date" and "Current Session"
  const TODAY = "2026-03-15";
  const CURRENT_SESSION = "AM"; 

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput) return;

    const student = STUDENTS_DB.find(s => s.id === scanInput);

    // 1. CHECK: Does student exist?
    if (!student) {
        setScanResult("error");
        setErrorMessage("Student ID not found in system.");
        setScannedStudent(null);
        return;
    }

    // 2. CHECK: Is it the right day?
    if (student.schedule.date !== TODAY) {
        setScanResult("error");
        setErrorMessage(`Wrong Date! Scheduled for: ${student.schedule.date}`);
        setScannedStudent(student);
        return;
    }

    // 3. CHECK: Is it the right session?
    if (student.schedule.session !== CURRENT_SESSION) {
        setScanResult("error");
        setErrorMessage(`Wrong Session! Scheduled for: ${student.schedule.session} (Currently ${CURRENT_SESSION})`);
        setScannedStudent(student);
        return;
    }

    // SUCCESS!
    setScanResult("success");
    setScannedStudent(student);
    setErrorMessage("");
    
    // Add to local logs
    setRecentLogs(prev => [{...student, time: new Date().toLocaleTimeString()}, ...prev]);
    
    // Reset input for next scan
    setScanInput("");
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col md:flex-row font-sans">
      
      {/* LEFT: SCANNER AREA */}
      <div className="flex-1 p-8 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background Pulse Effect for Success/Error */}
        <div className={`absolute inset-0 transition-colors duration-500 opacity-20 pointer-events-none 
            ${scanResult === 'success' ? 'bg-green-500' : scanResult === 'error' ? 'bg-red-500' : 'bg-transparent'}`} 
        />

        <div className="z-10 w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
                <Badge variant="outline" className="text-amber-400 border-amber-500/50 bg-amber-900/20 px-4 py-1 text-xs">
                    SESSION: {CURRENT_SESSION} • {TODAY}
                </Badge>
                <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Entrance Scanner</h1>
                <p className="text-stone-400 text-sm">Scan QR Code to validate attendance</p>
            </div>

            {/* SCANNER FORM */}
            <Card className="bg-stone-800 border-stone-700 shadow-2xl">
                <CardContent className="p-6 space-y-4">
                    <form onSubmit={handleScan} className="flex gap-2">
                        <Input 
                            autoFocus
                            placeholder="Scan or Type ID Number..." 
                            className="bg-stone-900 border-stone-600 text-white h-12 text-lg font-mono placeholder:text-stone-600"
                            value={scanInput}
                            onChange={(e) => setScanInput(e.target.value)}
                        />
                        <Button type="submit" size="lg" className="bg-amber-600 hover:bg-amber-700">
                            <ScanLine className="w-6 h-6" />
                        </Button>
                    </form>

                    {/* RESULT DISPLAY */}
                    <div className="min-h-[200px] flex flex-col items-center justify-center p-4 rounded-xl border border-stone-700/50 bg-stone-900/50">
                        {scanResult === 'idle' && (
                            <div className="text-center text-stone-600">
                                <ScanLine className="w-16 h-16 mx-auto mb-2 opacity-20" />
                                <p>Ready to Scan...</p>
                            </div>
                        )}

                        {scanResult === 'success' && scannedStudent && (
                            <div className="text-center space-y-3 animate-in zoom-in-95 duration-200">
                                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-green-400">ACCESS GRANTED</h2>
                                <div>
                                    <p className="text-xl font-bold text-white">{scannedStudent.name}</p>
                                    <p className="text-stone-400">{scannedStudent.id}</p>
                                </div>
                                <Badge className="bg-green-600">Added to Queue</Badge>
                            </div>
                        )}

                        {scanResult === 'error' && (
                            <div className="text-center space-y-3 animate-in shake duration-300">
                                <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                                    <XCircle className="w-12 h-12 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-red-400">ACCESS DENIED</h2>
                                {scannedStudent && (
                                    <div>
                                        <p className="text-xl font-bold text-white">{scannedStudent.name}</p>
                                        <p className="text-red-300 text-sm font-bold mt-1">{errorMessage}</p>
                                    </div>
                                )}
                                {!scannedStudent && <p className="text-stone-400">{errorMessage}</p>}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* RIGHT: ATTENDANCE LOG */}
      <div className="w-full md:w-96 bg-stone-800 border-l border-stone-700 p-6 flex flex-col">
        <h3 className="flex items-center gap-2 font-bold text-stone-300 mb-4">
            <History className="w-4 h-4" /> Live Attendance Log
        </h3>
        <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
                {recentLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-stone-900/50 border border-stone-700">
                        <Avatar className="h-10 w-10 border border-green-500/50">
                            <AvatarImage src={log.photo} />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-sm text-stone-200">{log.name}</p>
                            <p className="text-xs text-stone-500 font-mono">{log.time}</p>
                        </div>
                    </div>
                ))}
                {recentLogs.length === 0 && (
                    <p className="text-center text-stone-600 text-sm py-10">No scans yet today.</p>
                )}
            </div>
        </ScrollArea>
      </div>

    </div>
  );
}