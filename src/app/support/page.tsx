"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Loader2, 
  Send 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a network request (2 seconds delay)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Header */}
      <div className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-900/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/">
            <Button variant="ghost" className="text-stone-400 hover:text-white hover:bg-white/10 mb-8 pl-0 gap-2">
              <ArrowLeft size={20} /> Back to Home
            </Button>
          </Link>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Contact Support</h1>
          <p className="text-xl text-stone-400 max-w-2xl">
            We are here to help. Send us a message and we will respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
                <h3 className="text-xl font-bold text-stone-800 mb-6">Get in touch</h3>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 shrink-0">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-stone-800">Email</p>
                            <p className="text-stone-500 text-sm">support@aurium-umtc.edu.ph</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-stone-800">Office</p>
                            <p className="text-stone-500 text-sm">UM Tagum College, Mabini Street, Tagum City</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-stone-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Check the FAQ</h3>
                    <p className="text-stone-400 text-sm mb-6">Find quick answers to common questions about schedules and registration.</p>
                    <Link href="/faq">
                        <Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white">
                            Visit Help Center
                        </Button>
                    </Link>
                </div>
            </div>
          </div>

          {/* Contact Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 h-full flex flex-col justify-center min-h-[500px]">
              <AnimatePresence mode="wait">
                {!isSent ? (
                  /* --- FORM VIEW --- */
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                     <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Name</label>
                            <input required type="text" placeholder="John Doe" className="w-full p-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none bg-stone-50 focus:bg-white transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Email</label>
                            <input required type="email" placeholder="name@email.com" className="w-full p-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none bg-stone-50 focus:bg-white transition-all" />
                         </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700">Subject</label>
                        <select className="w-full p-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none bg-stone-50 focus:bg-white transition-all text-stone-600">
                            <option>Select a topic...</option>
                            <option>Login Issue</option>
                            <option>Registration Problem</option>
                            <option>Schedule Inquiry</option>
                            <option>Other</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700">Message</label>
                        <textarea required rows={6} placeholder="How can we help you?" className="w-full p-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none bg-stone-50 focus:bg-white transition-all resize-none"></textarea>
                     </div>
                     
                     <div className="pt-2">
                         <Button 
                           type="submit" 
                           disabled={isSubmitting}
                           className="bg-amber-900 hover:bg-amber-800 text-white px-8 py-4 h-auto rounded-xl font-bold text-lg w-full md:w-auto shadow-lg shadow-amber-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                         >
                            {isSubmitting ? (
                              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                            ) : (
                              <><Send className="mr-2 h-5 w-5" /> Send Message</>
                            )}
                         </Button>
                     </div>
                  </motion.form>
                ) : (
                  /* --- SUCCESS CONFIRMATION VIEW --- */
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="flex flex-col items-center justify-center text-center space-y-6 h-full py-12"
                  >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                      <CheckCircle size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-serif font-bold text-stone-800">Message Sent!</h3>
                      <p className="text-stone-500 max-w-md mx-auto">
                        Thank you for contacting us. We have received your message and our support team will get back to you shortly via email.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setIsSent(false)} 
                      variant="outline" 
                      className="mt-6 border-stone-300 text-stone-700 hover:bg-stone-50"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}