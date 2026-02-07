"use client";

import { useState } from "react";
import { Plus, Edit3, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MOCK_SCHEDULES = [
  { date: "2026-03-15", amSlots: 50, amBooked: 48, pmSlots: 50, pmBooked: 12 },
  { date: "2026-03-16", amSlots: 50, amBooked: 50, pmSlots: 50, pmBooked: 50 },
];

export function SchedulesTab() {
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [newDateInput, setNewDateInput] = useState("");
  const [manualStudentName, setManualStudentName] = useState("");

  const handleUpdateCapacity = (date: string, session: 'am' | 'pm', newCapacity: number) => {
    setSchedules(prev => prev.map(sched => {
        if (sched.date === date) {
            return session === 'am' ? { ...sched, amSlots: newCapacity } : { ...sched, pmSlots: newCapacity };
        }
        return sched;
    }));
  };

  const handleAddNewDate = () => {
    if (!newDateInput) return;
    const exists = schedules.some(s => s.date === newDateInput);
    if (exists) { alert("Date exists!"); return; }
    const newSchedule = { date: newDateInput, amSlots: 50, amBooked: 0, pmSlots: 50, pmBooked: 0 };
    setSchedules(prev => [...prev, newSchedule].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewDateInput(""); 
  };

  const handleManualAdd = (date: string, session: 'am' | 'pm') => {
    if (!manualStudentName) return;
    setSchedules(prev => prev.map(sched => {
        if (sched.date === date) {
            const currentBooked = session === 'am' ? sched.amBooked : sched.pmBooked;
            const limit = session === 'am' ? sched.amSlots : sched.pmSlots;
            if (currentBooked >= limit) { alert("Slot full!"); return sched; }
            return session === 'am' ? { ...sched, amBooked: sched.amBooked + 1 } : { ...sched, pmBooked: sched.pmBooked + 1 };
        }
        return sched;
    }));
    setManualStudentName(""); 
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div><h2 className="text-2xl font-serif font-bold text-stone-800">Pictorial Availability</h2><p className="text-stone-500 text-sm">Manage capacities.</p></div>
            <Dialog>
                <DialogTrigger asChild><Button className="bg-amber-900 hover:bg-amber-800 shadow-lg"><Plus className="mr-2 h-4 w-4" /> Add Date</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Open New Schedule</DialogTitle><DialogDescription>Add a new date.</DialogDescription></DialogHeader>
                    <div className="py-4"><Label>Select Date</Label><Input type="date" value={newDateInput} onChange={(e) => setNewDateInput(e.target.value)} /></div>
                    <DialogFooter><Button onClick={handleAddNewDate}>Create</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        
        <div className="grid gap-6">
            {schedules.map((day, idx) => (
                <Card key={idx} className="overflow-hidden border-t-4 border-t-amber-600 shadow-md rounded-2xl border-stone-200">
                    <CardHeader className="bg-stone-50/80 pb-4 border-b border-stone-100">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2 font-serif text-stone-800"><Calendar className="text-amber-600 h-5 w-5" /> {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</CardTitle>
                            <Badge variant="outline" className={day.amBooked + day.pmBooked >= day.amSlots + day.pmSlots ? "text-red-600 border-red-200 bg-red-50" : "text-green-600 border-green-200 bg-green-50"}>{day.amBooked + day.pmBooked >= day.amSlots + day.pmSlots ? "FULLY BOOKED" : "AVAILABLE"}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {['am', 'pm'].map((session) => {
                                const isAm = session === 'am';
                                const booked = isAm ? day.amBooked : day.pmBooked;
                                const slots = isAm ? day.amSlots : day.pmSlots;
                                return (
                                    <div key={session} className={`space-y-4 p-4 rounded-xl border border-stone-100 ${isAm ? 'bg-amber-50/30' : 'bg-blue-50/30'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-stone-700 flex items-center gap-2 text-sm">{isAm ? '🌤️ Morning' : '☀️ Afternoon'}</h4>
                                            <Dialog>
                                                <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit3 className="h-3.5 w-3.5" /></Button></DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle>Modify Capacity</DialogTitle></DialogHeader>
                                                    <Input type="number" defaultValue={slots} onChange={(e) => handleUpdateCapacity(day.date, session as 'am'|'pm', parseInt(e.target.value))} />
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-medium"><span className={booked >= slots ? "text-red-600" : "text-stone-700"}>{booked} Booked</span><span className="text-stone-400">Limit: {slots}</span></div>
                                            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${booked >= slots ? "bg-red-500" : isAm ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${(booked / slots) * 100}%` }}></div></div>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild><Button variant="outline" size="sm" className="w-full text-xs"><Plus className="mr-1 h-3 w-3" /> Add Student</Button></DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader><DialogTitle>Add to {isAm ? 'Morning' : 'Afternoon'}</DialogTitle></DialogHeader>
                                                <Input placeholder="Student Name" value={manualStudentName} onChange={(e) => setManualStudentName(e.target.value)} />
                                                <DialogFooter><Button onClick={() => handleManualAdd(day.date, session as 'am'|'pm')}>Confirm</Button></DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}