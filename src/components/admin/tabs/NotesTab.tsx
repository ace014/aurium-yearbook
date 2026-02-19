"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

// gi import nako ang hook dre
import { useNotes } from "@/hooks/useNotes";

export function NotesTab() {
  
  // gi-extract nako tanan gikan sa custom hook
  const {
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
  } = useNotes();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Staff Notes</h1>
      <p className="text-stone-500 mb-8">Private sticky notes for your reminders and tasks.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card for Adding New Note */}
        <div className="aspect-square rounded-xl border-2 border-dashed border-stone-300 flex flex-col p-4 bg-stone-50 hover:bg-stone-100 transition-colors">
          <Textarea 
            placeholder="Type a new note here..." 
            className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 mb-2 text-lg font-serif"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button onClick={addNote} disabled={!newNote.trim()} className="w-full bg-stone-800 text-white shadow-md hover:bg-stone-700">
            <Plus size={16} className="mr-2"/> Add Note
          </Button>
        </div>

        {/* Display tanang sticky notes gikan sa array */}
        {notes.map((note) => (
          <div 
              key={note.id} 
              className={`aspect-square rounded-xl p-6 shadow-md relative group flex flex-col ${note.color} rotate-1 hover:rotate-0 transition-transform duration-300`}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={() => onTouchEnd(note.id)}
          >
            {/* Delete button (hidden by default, magpakita if i-hover sa desktop) */}
            <button 
              onClick={() => setNoteToDelete(note.id)}
              className="absolute top-2 right-2 p-2 bg-black/5 hover:bg-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all text-stone-600"
            >
              <Trash2 size={16} />
            </button>
            
            {/* Tape effect sa taas sa sticky note for UI details */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-yellow-200/50 blur-sm"></div>
            
            <p className="text-stone-800 font-medium font-serif leading-relaxed flex-1 overflow-auto text-lg pt-2">
              {note.content}
            </p>
            
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-4 opacity-50 border-t border-stone-400/20 pt-2 flex justify-between">
                <span>Staff Only</span>
                {/* visible ra ni sa mobile para kabalo sila unsay buhaton */}
                <span className="md:hidden text-stone-400 text-[9px] italic">Swipe left to delete</span>
            </span>
          </div>
        ))}
      </div>
      
      {/* Modal Prompt bago i-delete jud aron iwas typo click */}
      <Dialog open={noteToDelete !== null} onOpenChange={(open) => !open && setNoteToDelete(null)}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Delete Note?</DialogTitle>
                  <DialogDescription>
                      This action cannot be undone. Are you sure you want to delete this sticky note?
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setNoteToDelete(null)}>Cancel</Button>
                  <Button variant="destructive" onClick={confirmDeleteNote}>Delete Note</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}