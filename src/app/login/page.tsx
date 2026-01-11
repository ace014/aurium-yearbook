"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, User, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Login Function
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      alert("Login functionality will be connected to the backend later!");
      // router.push('/dashboard'); // Future redirect
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      
      {/* --- HEADER (Minimal) --- */}
      <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-amber-100/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 overflow-hidden">
                   <Image src="/images/umtc-logo.png" alt="UMTC Logo" fill className="object-contain"/>
                </div>
                <div className="h-6 w-[1px] bg-stone-300"></div>
                <div className="relative w-8 h-8 overflow-hidden">
                   <Image src="/images/aurium-logo.png" alt="Aurium Logo" fill className="object-contain"/>
                </div>
            </div>
            <span className="font-serif font-bold text-amber-950 ml-2 tracking-tight">Portal Access</span>
          </Link>
          <Link href="/">
             <Button variant="ghost" size="sm" className="text-stone-500 hover:text-amber-900">
               Return Home
             </Button>
          </Link>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-4 pt-20 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-amber-200/20 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[120px] z-0" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="shadow-2xl border-t-4 border-amber-900 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                  <UserCircleIcon />
                </div>
              </div>
              <CardTitle className="text-2xl font-serif font-bold text-amber-950">Welcome Back</CardTitle>
              <CardDescription className="text-stone-500">
                Please enter your credentials to access the yearbook system.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Student ID / Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Student ID or Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <Input 
                      id="email" 
                      placeholder="Enter your ID or email" 
                      className="pl-10 h-11 bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500" 
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-amber-700 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10 h-11 bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-amber-900 hover:bg-amber-800 text-white font-medium shadow-lg shadow-amber-900/20 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight size={16} />
                    </span>
                  )}
                </Button>

              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 border-t border-stone-100 p-6 bg-stone-50/50">
              <div className="text-center text-sm text-stone-500">
                Don't have an account yet?{" "}
                <Link href="/register" className="font-bold text-amber-800 hover:underline">
                  Pre-Register Here
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          <p className="text-center text-xs text-stone-400 mt-8">
            © 2026 AURIUM Yearbook Committee. Secure Login.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

// Helper component for the icon
function UserCircleIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-amber-900"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}