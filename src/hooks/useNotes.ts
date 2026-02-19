import { useState, useRef } from "react";

// initial mock data para nay unod pag open
const INITIAL_NOTES = [
  { id: 1, content: "Remember to check honor titles for BSCS students.", color: "bg-amber-100" },
  { id: 2, content: "Pictorial break time is at 12:00 PM.", color: "bg-blue-100" },
];

export function useNotes() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [newNote, setNewNote] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  // refs kani para sa touch events sa mobile (swipe left to delete)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // add note logic - butangan lang ug random color para nindot tan-awon
  const addNote = () => {
    if(!newNote.trim()) return;
    const colors = ["bg-amber-100", "bg-blue-100", "bg-green-100", "bg-rose-100"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setNotes(prev => [...prev, { id: Date.now(), content: newNote, color: randomColor }]);
    setNewNote(""); // reset input field after ma-add
  };

  // tig delete sa note if i-confirm sa admin
  const confirmDeleteNote = () => {
    if (noteToDelete !== null) {
        setNotes(prev => prev.filter(n => n.id !== noteToDelete));
        setNoteToDelete(null); // hide ang modal pagkahuman
    }
  };

  // kani na parts kay for mobile swipe-to-delete support
  const onTouchStart = (e: React.TouchEvent) => { 
    touchStartX.current = e.targetTouches[0].clientX; 
  };
  
  const onTouchMove = (e: React.TouchEvent) => { 
    touchEndX.current = e.targetTouches[0].clientX; 
  };
  
  const onTouchEnd = (id: number) => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    // kwentahon ang distance sa swipe
    const distance = touchStartX.current - touchEndX.current;
    
    // if ni-swipe ug dako (50px+), trigger the delete prompt
    if (distance > 50) setNoteToDelete(id);
    
    // reset ang touches
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return {
    notes,
    newNote,
    setNewNote,
    noteToDelete,
    setNoteToDelete,
    addNote,
    confirmDeleteNote,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}