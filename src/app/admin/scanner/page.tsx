"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  ScanLine, 
  CheckCircle, 
  XCircle, 
  Camera, 
  CameraOff,
  Search,
  ListFilter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- NEW LIBRARY IMPORT ---
import { Scanner } from '@yudiel/react-qr-scanner';

// --- SOUND ASSETS ---
// Success: A pleasant chime
const AUDIO_SUCCESS = "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=success-1-6297.mp3"; 
// Error: A harsh buzzer sound ("Eeeeeek!")
const AUDIO_ERROR = "https://www.myinstants.com/media/sounds/wrong-answer-sound-effect.mp3";

// --- TYPES ---
interface Student {
  id: string;
  name: string;
  photo: string;
  status: "present" | "absent";
  timeIn?: string;
  schedule: {
      date: string;
      session: "AM" | "PM";
  };
}

// --- MOCK DATABASE ---
const GLOBAL_STUDENT_DB: Student[] = [
    { id: "2020-00123", name: "Juan Dela Cruz", photo: "https://github.com/shadcn.png", status: "absent", schedule: { date: "2026-03-15", session: "AM" } },
    { id: "2020-00124", name: "Maria Clara", photo: "https://github.com/shadcn.png", status: "absent", schedule: { date: "2026-03-15", session: "AM" } },
    { id: "2020-00125", name: "Jose Rizal", photo: "https://github.com/shadcn.png", status: "absent", schedule: { date: "2026-03-15", session: "AM" } },
    { id: "2020-00456", name: "Emilio Aguinaldo", photo: "https://github.com/shadcn.png", status: "absent", schedule: { date: "2026-03-15", session: "PM" } },
    { id: "2020-00457", name: "Apolinario Mabini", photo: "https://github.com/shadcn.png", status: "absent", schedule: { date: "2026-03-15", session: "PM" } },
    { id: "2020-00789", name: "Lapu Lapu", photo: "https://github.com/shadcn.png", status: "absent", schedule: { date: "2026-03-16", session: "AM" } },
];

const SESSION_OPTIONS = [
    { label: "March 15 - Morning (AM)", date: "2026-03-15", session: "AM" },
    { label: "March 15 - Afternoon (PM)", date: "2026-03-15", session: "PM" },
    { label: "March 16 - Morning (AM)", date: "2026-03-16", session: "AM" },
];

export default function ScannerPage() {
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<"idle" | "success" | "error">("idle");
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(true);
  
  // --- SESSION STATE ---
  const [currentSessionKey, setCurrentSessionKey] = useState("2026-03-15-AM"); 
  const [selectedDate, selectedSession] = currentSessionKey.split("-").length === 4 
      ? [currentSessionKey.substring(0, 10), currentSessionKey.substring(11)] 
      : ["2026-03-15", "AM"]; 

  // --- LOCAL ATTENDANCE STATE ---
  const [localStudentDB, setLocalStudentDB] = useState<Student[]>(GLOBAL_STUDENT_DB);
  const [filter, setFilter] = useState<"all" | "present" | "absent">("all");

  // --- AUDIO PLAYER HELPER ---
  const playAudio = (type: "success" | "error") => {
      const audio = new Audio(type === "success" ? AUDIO_SUCCESS : AUDIO_ERROR);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play failed (user interaction needed first)", e));
  };

  // --- DERIVED LISTS ---
  const sessionList = useMemo(() => {
      return localStudentDB.filter(s => 
          s.schedule.date === selectedDate && s.schedule.session === selectedSession
      );
  }, [localStudentDB, selectedDate, selectedSession]);

  const displayedList = useMemo(() => {
      if (filter === "all") return sessionList;
      return sessionList.filter(s => s.status === filter);
  }, [sessionList, filter]);

  const totalStudents = sessionList.length;
  const presentCount = sessionList.filter(s => s.status === "present").length;
  const absentCount = totalStudents - presentCount;

  // --- CORE SCAN LOGIC ---
  const processScan = (idToScan: string) => {
    if (!idToScan) return;

    // Helper to reset scanner after 3 seconds
    const triggerReset = () => {
        setTimeout(() => {
            setScanResult("idle");
            setScannedStudent(null);
            setErrorMessage("");
        }, 3000);
    };

    const studentRecord = localStudentDB.find(s => s.id === idToScan);

    // ERROR 1: ID NOT FOUND
    if (!studentRecord) {
        setScanResult("error");
        setErrorMessage("ID not found in database.");
        setScannedStudent(null);
        playAudio("error"); // <--- PLAY ERROR SOUND
        triggerReset(); 
        return;
    }

    setScannedStudent(studentRecord);

    // ERROR 2: WRONG SESSION
    if (studentRecord.schedule.date !== selectedDate || studentRecord.schedule.session !== selectedSession) {
        setScanResult("error");
        setErrorMessage(`Wrong Session! Scheduled for: ${studentRecord.schedule.date} (${studentRecord.schedule.session})`);
        playAudio("error"); // <--- PLAY ERROR SOUND
        triggerReset();
        return;
    }

    // ERROR 3: ALREADY SCANNED
    if (studentRecord.status === 'present') {
        setScanResult("error"); 
        setErrorMessage("Student already scanned!");
        playAudio("error"); // <--- PLAY ERROR SOUND
        triggerReset();
        return;
    }

    // SUCCESS
    setScanResult("success");
    setErrorMessage("");
    playAudio("success"); // <--- PLAY SUCCESS SOUND
    
    setLocalStudentDB(prev => prev.map(student => 
        student.id === studentRecord.id 
            ? { ...student, status: "present", timeIn: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) } 
            : student
    ));

    triggerReset(); 
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processScan(scanInput);
    setScanInput("");
  };

  // --- NEW HANDLER FOR @yudiel/react-qr-scanner ---
  const handleQrScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
        const rawValue = detectedCodes[0].rawValue;
        if (rawValue && scanResult === "idle") {
            processScan(rawValue);
        }
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* LEFT: SCANNER AREA (60%) */}
      <div className="flex-1 flex flex-col relative border-r border-stone-800">
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center z-20 gap-4 pointer-events-none">
            <div className="pointer-events-auto">
                <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-2">
                    <ScanLine className="text-amber-500"/> Entrance Scanner
                </h1>
                <p className="text-stone-400 text-xs mt-1">AURIUM Event Management System</p>
            </div>
            
            <div className="w-full sm:w-64 pointer-events-auto">
                <Select value={currentSessionKey} onValueChange={setCurrentSessionKey}>
                    <SelectTrigger className="w-full bg-stone-900 border-stone-700 text-amber-400 font-bold">
                        <SelectValue placeholder="Select Session" />
                    </SelectTrigger>
                    <SelectContent className="bg-stone-900 border-stone-700 text-stone-200">
                        {SESSION_OPTIONS.map(opt => (
                            <SelectItem key={`${opt.date}-${opt.session}`} value={`${opt.date}-${opt.session}`}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Scanner Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 relative pt-24">
            
            <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none opacity-20
                ${scanResult === 'success' ? 'bg-green-500' : scanResult === 'error' ? 'bg-red-500' : 'bg-transparent'}`} 
            />

            <div className="z-10 w-full max-w-md space-y-6">
                
                {/* --- FUTURISTIC SCANNER CARD --- */}
                <div className="relative group">
                    <div className={`absolute -inset-1 rounded-xl opacity-75 blur transition duration-500 
                        ${scanResult === 'success' ? 'bg-green-500' : scanResult === 'error' ? 'bg-red-500' : 'bg-amber-500/20'}`}>
                    </div>
                    
                    <Card className={`relative border-0 shadow-2xl overflow-hidden bg-stone-900`}>
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500/50 rounded-tl-lg z-20 animate-pulse"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500/50 rounded-tr-lg z-20 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500/50 rounded-bl-lg z-20 animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500/50 rounded-br-lg z-20 animate-pulse"></div>

                        {/* --- CAMERA AREA --- */}
                        <div className="relative w-full aspect-square bg-black flex items-center justify-center overflow-hidden">
                            
                            {isCameraActive ? (
                                <div className="absolute inset-0 z-0">
                                    <Scanner 
                                        onScan={handleQrScan}
                                        scanDelay={3000} 
                                        // REMOVED 'components={{ audio: false }}' TO FIX TYPE ERROR
                                        constraints={{ facingMode: 'environment' }}
                                        styles={{ container: { width: '100%', height: '100%' }, video: { objectFit: 'cover' } }}
                                    />
                                    {/* Scan Line Overlay */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-[scan_2s_ease-in-out_infinite] z-10"></div>
                                </div>
                            ) : (
                                <div className="text-stone-600 flex flex-col items-center">
                                    <CameraOff className="w-12 h-12 mb-2" />
                                    <p className="text-sm">Camera Paused</p>
                                </div>
                            )}

                            {/* RESULT OVERLAYS */}
                            {scanResult === 'success' && scannedStudent && (
                                <div className="absolute inset-0 z-30 bg-stone-900/90 flex flex-col items-center justify-center animate-in zoom-in-95 duration-200 p-4 text-center">
                                    <Avatar className="w-24 h-24 border-4 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.6)] mb-4">
                                        <AvatarImage src={scannedStudent.photo} />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-3xl font-black text-green-400 tracking-widest drop-shadow-md">PRESENT</h2>
                                    <p className="text-xl font-bold text-white mt-2 truncate max-w-full">{scannedStudent.name}</p>
                                    <p className="text-stone-400 font-mono text-lg">{scannedStudent.id}</p>
                                </div>
                            )}

                            {scanResult === 'error' && (
                                <div className="absolute inset-0 z-30 bg-stone-900/90 flex flex-col items-center justify-center animate-in zoom-in-95 duration-200 p-4 text-center">
                                    <XCircle className="w-24 h-24 text-red-500 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.4)]" />
                                    <h2 className="text-3xl font-black text-red-500 tracking-widest">DENIED</h2>
                                    <p className="text-red-200 font-medium text-sm mt-2 bg-red-950/50 px-3 py-1 rounded">{errorMessage}</p>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-4 bg-stone-900 border-t border-stone-800 flex justify-between items-center z-20 relative">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                <span className="text-xs text-stone-400 uppercase tracking-wider font-bold">
                                    {isCameraActive ? 'Camera Live' : 'Camera Off'}
                                </span>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsCameraActive(!isCameraActive)}
                                className="h-8 w-8 p-0 text-stone-400 hover:text-white"
                            >
                                {isCameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                            </Button>
                        </div>

                    </Card>
                </div>

                <form onSubmit={handleManualSubmit} className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-stone-500 group-focus-within:text-amber-500 transition-colors"/>
                    </div>
                    <Input 
                        placeholder="Manual Entry: Type ID & Enter..." 
                        className="bg-stone-900 border-stone-700 text-white h-14 pl-10 text-lg font-mono placeholder:text-stone-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all rounded-xl shadow-inner"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                    />
                    <Button type="submit" className="absolute right-2 top-2 bottom-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg">
                        Enter
                    </Button>
                </form>

            </div>
        </div>
      </div>

      {/* RIGHT: ATTENDANCE LIST (40%) */}
      <div className="w-full lg:w-[450px] bg-stone-900 flex flex-col border-l border-stone-800 shadow-2xl z-20">
        
        {/* Stats Header */}
        <div className="p-6 bg-stone-900 border-b border-stone-800">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-amber-500"/> Attendance: {selectedSession} Session
            </h3>
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-stone-800 p-3 rounded-lg border border-stone-700 text-center">
                    <p className="text-2xl font-bold text-white">{totalStudents}</p>
                    <p className="text-[10px] uppercase text-stone-500 font-bold tracking-wider">Total</p>
                </div>
                <div className="bg-green-900/20 p-3 rounded-lg border border-green-900/30 text-center">
                    <p className="text-2xl font-bold text-green-400">{presentCount}</p>
                    <p className="text-[10px] uppercase text-green-600 font-bold tracking-wider">Present</p>
                </div>
                <div className="bg-stone-800 p-3 rounded-lg border border-stone-700 text-center opacity-60">
                    <p className="text-2xl font-bold text-stone-400">{absentCount}</p>
                    <p className="text-[10px] uppercase text-stone-500 font-bold tracking-wider">Absent</p>
                </div>
            </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 pt-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={(val) => setFilter(val as any)}>
                <TabsList className="w-full bg-stone-800">
                    <TabsTrigger value="all" className="flex-1 text-xs">All Students</TabsTrigger>
                    <TabsTrigger value="present" className="flex-1 text-xs text-green-400 data-[state=active]:bg-green-900/20">Present</TabsTrigger>
                    <TabsTrigger value="absent" className="flex-1 text-xs text-stone-400">Absent</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        {/* Scrollable List */}
        <ScrollArea className="flex-1 p-6">
            <div className="space-y-2">
                {displayedList.map((student) => (
                    <div 
                        key={student.id} 
                        className={`group flex items-center gap-3 p-3 rounded-lg border transition-all duration-300
                        ${student.status === 'present' 
                            ? 'bg-green-900/10 border-green-900/30' 
                            : 'bg-stone-900 border-stone-800 opacity-60 hover:opacity-100 hover:bg-stone-800'
                        }`}
                    >
                        <Avatar className={`h-10 w-10 border-2 ${student.status === 'present' ? 'border-green-500' : 'border-stone-700'}`}>
                            <AvatarImage src={student.photo} />
                            <AvatarFallback className="bg-stone-800 text-stone-400">JD</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                            <p className={`font-bold text-sm truncate ${student.status === 'present' ? 'text-white' : 'text-stone-400'}`}>
                                {student.name}
                            </p>
                            <p className="text-xs text-stone-500 font-mono truncate">{student.id}</p>
                        </div>

                        <div>
                            {student.status === 'present' ? (
                                <div className="text-right">
                                    <Badge className="bg-green-600 hover:bg-green-600 text-[10px] px-2 h-5">Present</Badge>
                                    <p className="text-[10px] text-green-400/70 font-mono mt-1">{student.timeIn}</p>
                                </div>
                            ) : (
                                <Badge variant="outline" className="border-stone-700 text-stone-600 text-[10px] px-2 h-5">
                                    Waiting
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}

                {displayedList.length === 0 && (
                    <div className="text-center py-12 text-stone-500 text-sm">
                        No students found for this session.
                    </div>
                )}
            </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 text-center">
            <Button variant="ghost" className="w-full text-stone-500 hover:text-white hover:bg-stone-800 text-xs">
                Export Attendance Report
            </Button>
        </div>

      </div>
      
      {/* CSS Animation for Scan Line */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

    </div>
  );
}