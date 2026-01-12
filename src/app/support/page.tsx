"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Search, 
  Mail, 
  MessageCircle, 
  FileQuestion, 
  ArrowLeft, 
  UserCog, 
  CalendarClock, 
  Image as ImageIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupportPage() {
  const faqs = [
    {
      q: "How do I edit my registration details?",
      a: "Once submitted, you cannot edit your details directly. Please contact the editorial board via email to request changes to your profile."
    },
    {
      q: "What should I wear for the photoshoot?",
      a: "For the Toga shot, ladies must wear a tube/spaghetti strap top. Gentlemen should wear a white polo/long-sleeves with a necktie. For the creative shot, follow your department's theme."
    },
    {
      q: "When will the yearbooks be distributed?",
      a: "Yearbook distribution typically begins 6-8 months after the graduation ceremony. You will be notified via the email provided during registration."
    },
    {
      q: "I forgot my portal password.",
      a: "Go to the Login page and click 'Forgot Password'. A reset link will be sent to your registered UM student email."
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* --- HEADER --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-amber-100/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 overflow-hidden">
                   <Image src="/images/umtc-logo.png" alt="UMTC" fill className="object-contain"/>
                </div>
                <div className="h-6 w-[1px] bg-stone-300"></div>
                <div className="relative w-8 h-8 overflow-hidden">
                   <Image src="/images/aurium-logo.png" alt="Aurium" fill className="object-contain"/>
                </div>
            </div>
            <span className="font-serif font-bold text-amber-950 ml-2">Help Center</span>
          </Link>
          <Link href="/">
             <Button variant="ghost" size="sm" className="gap-2 hover:text-amber-700">
               <ArrowLeft size={16} /> Back to Home
             </Button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="bg-amber-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">How can we help you?</h1>
            <p className="text-amber-100 max-w-xl mx-auto mb-8 text-lg">
              Search our knowledge base or browse common topics below.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-3.5 text-stone-400" size={20} />
              <Input 
                placeholder="Search for answers (e.g. 'schedule', 'payment')" 
                className="pl-12 h-12 bg-white text-stone-900 border-0 shadow-xl rounded-full text-base focus-visible:ring-amber-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- QUICK TOPICS --- */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white hover:border-amber-400 transition-all cursor-pointer shadow-lg hover:shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <UserCog size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-900">Account & Profile</h3>
                <p className="text-xs text-stone-500">Edit details, reset password</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:border-amber-400 transition-all cursor-pointer shadow-lg hover:shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <CalendarClock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-900">Scheduling</h3>
                <p className="text-xs text-stone-500">Book or move pictorial dates</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:border-amber-400 transition-all cursor-pointer shadow-lg hover:shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <ImageIcon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-900">Photos & Orders</h3>
                <p className="text-xs text-stone-500">Digital copies, hard covers</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- FAQs & CONTACT --- */}
      <main className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-amber-100 rounded-full text-amber-700">
               <FileQuestion size={24} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-stone-200 hover:border-amber-200 transition-colors shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-stone-800">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-500 leading-relaxed text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Side Panel */}
        <div className="space-y-6">
          <Card className="bg-stone-900 text-white border-0 shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Still need help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-stone-400 text-sm">
                Our support team is available Monday to Friday, 8:00 AM - 5:00 PM.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-stone-500 uppercase font-bold">Email Us</p>
                    <p className="text-sm font-medium truncate" title="aurium.support@umindanao.edu.ph">aurium.support@umindanao.edu.ph</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase font-bold">Live Chat</p>
                    <p className="text-sm font-medium">Available on Portal</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold mt-4 shadow-lg shadow-amber-900/20">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>

      </main>

      <footer className="bg-white border-t border-stone-200 py-8 text-center text-xs text-stone-400 mt-auto">
        <p>© 2026 AURIUM Yearbook Committee.</p>
      </footer>
    </div>
  );
}