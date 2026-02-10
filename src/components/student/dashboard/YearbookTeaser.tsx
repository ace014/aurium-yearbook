"use client";

import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function YearbookTeaser() {
  return (
    <Card className="md:col-span-3 bg-gradient-to-r from-stone-900 to-stone-800 text-stone-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3"></div>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="space-y-4 flex-1 text-center md:text-left">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30">COMING SOON</Badge>
                <h2 className="text-3xl font-serif font-bold text-white">The 2026 Digital Yearbook</h2>
                <p className="text-stone-400 max-w-lg">Experience the memories of your batch in our interactive digital yearbook.</p>
                <Button variant="outline" className="border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white" disabled>
                    <BookOpen className="mr-2 w-4 h-4" /> View Yearbook (Locked)
                </Button>
            </div>
            <div className="w-40 h-56 bg-amber-900/50 rounded-lg border border-amber-700/50 shadow-2xl flex items-center justify-center backdrop-blur-sm -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-not-allowed">
                <div className="text-center"><div className="text-amber-500 font-serif font-bold text-xl tracking-widest">AURIUM</div><div className="text-amber-700 text-xs uppercase mt-1">2026 Edition</div></div>
            </div>
        </CardContent>
    </Card>
  );
}