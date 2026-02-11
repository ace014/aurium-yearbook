"use client";

import Image from "next/image";

export function BrandLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-8 h-8 overflow-hidden hover:scale-105 transition-transform duration-300">
         <Image src="/images/umtc-logo.png" alt="UMTC" fill className="object-contain" />
      </div>
      <div className={`h-8 w-[1px] ${dark ? 'bg-stone-300' : 'bg-stone-700/50'}`}></div>
      <div className="relative w-8 h-8 overflow-hidden hover:scale-105 transition-transform duration-300">
         <Image src="/images/aurium-logo.png" alt="Aurium" fill className="object-contain" />
      </div>
      <div className="flex flex-col justify-center">
         <span className={`text-lg font-serif font-bold ${dark ? 'text-stone-800' : 'text-white'} leading-none tracking-tight`}>AURIUM</span>
         <span className="text-[8px] text-amber-600 uppercase tracking-widest font-bold">Staff Portal</span>
      </div>
    </div>
  );
}