import { useState, useMemo } from "react";

// --- SOUND ASSETS ---
// kani tong tingog if success
const AUDIO_SUCCESS = "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=success-1-6297.mp3"; 
// kani if error (e.g. wrong session, id not found)
const AUDIO_ERROR = "https://www.myinstants.com/media/sounds/wrong-answer-sound-effect.mp3";

// --- TYPES ---
// Gi-update nako ang status para mo match didto sa Roster (Schedules Tab) para di maglibog si Koi sa backend
export interface StudentRecord {
  id: string;
  name: string;
  photo: string;
  status: "attended" | "pending" | "missed"; 
  timeIn?: string;
  schedule: {
      date: string;
      session: "AM" | "PM";
  };
}

// --- MOCK DATABASE ---
const GLOBAL_STUDENT_DB: StudentRecord[] = [
    { id: "2020-00123", name: "Juan Dela Cruz", photo: "https://github.com/shadcn.png", status: "pending", schedule: { date: "2026-03-15", session: "AM" } },
    { id: "2020-00124", name: "Maria Clara", photo: "https://github.com/shadcn.png", status: "pending", schedule: { date: "2026-03-15", session: "AM" } },
    { id: "2020-00125", name: "Jose Rizal", photo: "https://github.com/shadcn.png", status: "pending", schedule: { date: "2026-03-15", session: "AM" } },
    { id: "2020-00456", name: "Emilio Aguinaldo", photo: "https://github.com/shadcn.png", status: "pending", schedule: { date: "2026-03-15", session: "PM" } },
    { id: "2020-00457", name: "Apolinario Mabini", photo: "https://github.com/shadcn.png", status: "pending", schedule: { date: "2026-03-15", session: "PM" } },
    { id: "2020-00789", name: "Lapu Lapu", photo: "https://github.com/shadcn.png", status: "pending", schedule: { date: "2026-03-16", session: "AM" } },
];

export const SESSION_OPTIONS = [
    { label: "March 15 - Morning (AM)", date: "2026-03-15", session: "AM" },
    { label: "March 15 - Afternoon (PM)", date: "2026-03-15", session: "PM" },
    { label: "March 16 - Morning (AM)", date: "2026-03-16", session: "AM" },
];

export function useScanner() {
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<"idle" | "success" | "error">("idle");
  const [scannedStudent, setScannedStudent] = useState<StudentRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(true);
  
  // --- SESSION STATE ---
  // default value, parse the key para makuha ang date ug session string
  const [currentSessionKey, setCurrentSessionKey] = useState("2026-03-15-AM"); 
  const [selectedDate, selectedSession] = currentSessionKey.split("-").length === 4 
      ? [currentSessionKey.substring(0, 10), currentSessionKey.substring(11)] 
      : ["2026-03-15", "AM"]; 

  // --- LOCAL ATTENDANCE STATE ---
  const [localStudentDB, setLocalStudentDB] = useState<StudentRecord[]>(GLOBAL_STUDENT_DB);
  // gi update nako from "present" to "attended" para uniform
  const [filter, setFilter] = useState<"all" | "attended" | "pending">("all");

  // --- AUDIO PLAYER HELPER ---
  const playAudio = (type: "success" | "error") => {
      const audio = new Audio(type === "success" ? AUDIO_SUCCESS : AUDIO_ERROR);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play failed (need interaction sa user una)", e));
  };

  // --- DERIVED LISTS (para sa right sidebar) ---
  const sessionList = useMemo(() => {
      return localStudentDB.filter(s => 
          s.schedule.date === selectedDate && s.schedule.session === selectedSession
      );
  }, [localStudentDB, selectedDate, selectedSession]);

  const displayedList = useMemo(() => {
      if (filter === "all") return sessionList;
      return sessionList.filter(s => s.status === filter);
  }, [sessionList, filter]);

  // counter para sa stats
  const totalStudents = sessionList.length;
  const attendedCount = sessionList.filter(s => s.status === "attended").length;
  const pendingCount = totalStudents - attendedCount;

  // --- CORE SCAN LOGIC ---
  const processScan = (idToScan: string) => {
    if (!idToScan) return;

    // Helper para mu-reset ang scanner ui after 3 secs
    const triggerReset = () => {
        setTimeout(() => {
            setScanResult("idle");
            setScannedStudent(null);
            setErrorMessage("");
        }, 3000);
    };

    const studentRecord = localStudentDB.find(s => s.id === idToScan);

    // ERROR 1: Wala sa database
    if (!studentRecord) {
        setScanResult("error");
        setErrorMessage("ID not found in database.");
        setScannedStudent(null);
        playAudio("error"); 
        triggerReset(); 
        return;
    }

    setScannedStudent(studentRecord);

    // ERROR 2: Sayo ra o na-late (wrong session)
    if (studentRecord.schedule.date !== selectedDate || studentRecord.schedule.session !== selectedSession) {
        setScanResult("error");
        setErrorMessage(`Wrong Session! Scheduled for: ${studentRecord.schedule.date} (${studentRecord.schedule.session})`);
        playAudio("error"); 
        triggerReset();
        return;
    }

    // ERROR 3: Naka scan na sya daan (doble entry)
    if (studentRecord.status === 'attended') {
        setScanResult("error"); 
        setErrorMessage("Student already scanned!");
        playAudio("error"); 
        triggerReset();
        return;
    }

    // SUCCESS - all goods
    setScanResult("success");
    setErrorMessage("");
    playAudio("success"); 
    
    // update state, set to 'attended' para mo reflect dayon sa lists
    setLocalStudentDB(prev => prev.map(student => 
        student.id === studentRecord.id 
            ? { ...student, status: "attended", timeIn: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) } 
            : student
    ));

    triggerReset(); 
  };

  // manual entry fallback if dli ma read ang qr
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processScan(scanInput);
    setScanInput("");
  };

  // QR scanner library handler
  const handleQrScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
        const rawValue = detectedCodes[0].rawValue;
        // make sure idle sya para dli mag sige ug trigger while nag display pa sa success/error ui
        if (rawValue && scanResult === "idle") {
            processScan(rawValue);
        }
    }
  };

  return {
    scanInput, setScanInput,
    scanResult,
    scannedStudent,
    errorMessage,
    isCameraActive, setIsCameraActive,
    currentSessionKey, setCurrentSessionKey,
    selectedSession,
    filter, setFilter,
    displayedList,
    totalStudents,
    attendedCount,
    pendingCount,
    handleManualSubmit,
    handleQrScan,
    SESSION_OPTIONS
  };
}