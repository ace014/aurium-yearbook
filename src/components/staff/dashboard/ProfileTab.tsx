"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface ProfileTabProps {
  staffUser: any;
  setStaffUser: React.Dispatch<React.SetStateAction<any>>;
}

export function ProfileTab({ staffUser, setStaffUser }: ProfileTabProps) {
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStaffUser((prev: any) => ({
        ...prev,
        name: (formData.get("staffName") as string) || prev.name,
        role: (formData.get("staffRole") as string) || prev.role,
        department: (formData.get("staffDept") as string) || prev.department,
        email: (formData.get("staffEmail") as string) || prev.email,
    }));
    setIsProfileEditing(false);
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStaffUser((prev: any) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-10">
      <Card className="shadow-2xl border-t-8 border-amber-600 rounded-3xl overflow-hidden">
        {isProfileEditing ? (
            <form onSubmit={handleProfileSave}>
                <CardHeader className="text-center pb-8 border-b border-stone-100 bg-stone-50">
                  <div className="w-32 h-32 mx-auto mb-4 relative group cursor-pointer" onClick={() => profileFileInputRef.current?.click()}>
                    <Avatar className="w-full h-full border-[6px] border-white shadow-xl group-hover:opacity-80 transition-opacity">
                      <AvatarImage src={staffUser.avatar} className="object-cover" />
                      <AvatarFallback className="text-4xl bg-stone-200 text-stone-400">ST</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-full transition-opacity">
                        <Camera className="text-white w-10 h-10" />
                    </div>
                    <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={handleProfilePhotoChange}/>
                  </div>
                  <div className="space-y-3 max-w-sm mx-auto">
                      <Input name="staffName" defaultValue={staffUser.name} className="text-center font-bold text-2xl font-serif bg-white shadow-sm" placeholder="Name" />
                      <Input name="staffRole" defaultValue={staffUser.role} className="text-center text-sm text-stone-500 bg-white shadow-sm" placeholder="Role" />
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-stone-400 font-bold">Department</Label>
                      <Input name="staffDept" defaultValue={staffUser.department} className="bg-stone-50 h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-stone-400 font-bold">Email</Label>
                      <Input name="staffEmail" defaultValue={staffUser.email} className="bg-stone-50 h-12" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-stone-50 p-6 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsProfileEditing(false)}>Cancel</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8 shadow-lg shadow-green-900/20 text-white">Save Profile</Button>
                </CardFooter>
            </form>
        ) : (
            <>
              <CardHeader className="text-center pb-10 border-b border-stone-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-stone-50">
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                  <Avatar className="w-full h-full border-[6px] border-white shadow-xl">
                      <AvatarImage src={staffUser.avatar} className="object-cover"/>
                      <AvatarFallback className="text-4xl bg-stone-200 text-stone-400">ST</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 right-1 bg-green-500 w-8 h-8 rounded-full border-[4px] border-white"></div>
                  </div>
                  <CardTitle className="text-3xl font-serif text-stone-900 mb-1">{staffUser.name}</CardTitle>
                  <CardDescription className="text-stone-500 font-medium uppercase tracking-widest text-xs">{staffUser.role}</CardDescription>
                  <div className="mt-4">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 px-3 py-1">{staffUser.id}</Badge>
                  </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Department</Label>
                      <p className="font-medium text-stone-800 text-lg">{staffUser.department}</p>
                  </div>
                  <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Access Level</Label>
                      <p className="font-medium text-stone-800 text-lg">Editor / Scanner</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                      <Label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Email</Label>
                      <p className="font-medium text-stone-800 text-lg border-b border-stone-100 pb-2">{staffUser.email}</p>
                  </div>
                  <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Joined</Label>
                      <p className="font-medium text-stone-800">September 2024</p>
                  </div>
                  </div>
              </CardContent>
              <CardFooter className="bg-stone-50 p-6 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Last login: Today at 8:00 AM
                  </div>
                  <Button variant="outline" onClick={() => setIsProfileEditing(true)} className="border-stone-300 hover:bg-white hover:text-amber-900">Edit Profile</Button>
              </CardFooter>
            </>
        )}
      </Card>
    </div>
  );
}