"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, UserCheck, Briefcase } from "lucide-react";

import { useProfile } from "@/hooks/useProfile";

export function ProfileTab({ user, setUser }: any) {
  
  const {
    isEditing,
    handleSaveProfile,
    handleOpenEdit,
    handleCancelEdit
  } = useProfile(user, setUser);

  // Check gihapon ta sa system role para sa permission display
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'administrator';

  return (
    <div className="max-w-xl mx-auto mt-10">
        <Card className={`shadow-xl border-t-4 ${isAdmin ? 'border-amber-600' : 'border-blue-600'}`}>
            <CardHeader className="text-center border-b bg-stone-50">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                    <Avatar className="w-full h-full border-4 border-white shadow-lg">
                        <AvatarImage src={user.avatar}/>
                        <AvatarFallback>{isAdmin ? 'AD' : 'ST'}</AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle>{user.name}</CardTitle>
                {/* Diri mu gawas ang iyang gi-type nga position, fallback is just the role */}
                <CardDescription className="capitalize font-medium text-amber-700">
                    {user.position || "Staff Member"}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                
                {!isEditing ? (
                    /* --- VIEW MODE --- */
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2 items-center">
                            <span className="text-xs font-bold text-stone-400 uppercase">System Role</span>
                            <span className="font-medium flex items-center gap-2">
                                {isAdmin ? (
                                    <><ShieldCheck size={16} className="text-amber-600"/> <span className="text-amber-700">Administrator</span></>
                                ) : (
                                    <><UserCheck size={16} className="text-blue-600"/> <span className="text-blue-700">Event Staff</span></>
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-2 items-center">
                            <span className="text-xs font-bold text-stone-400 uppercase">Job Title / Position</span>
                            <span className="font-medium flex items-center gap-2 text-stone-700">
                                <Briefcase size={14} className="text-stone-400"/> {user.position || "Not specified"}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-2 items-center">
                            <span className="text-xs font-bold text-stone-400 uppercase">Email</span>
                            <span className="font-medium text-stone-700">{user.email}</span>
                        </div>
                        <Button className="w-full mt-4" variant="outline" onClick={handleOpenEdit}>
                            Edit Profile
                        </Button>
                    </div>
                ) : (
                    /* --- EDIT MODE --- */
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        {/* System role is hidden sa form kay bawal usabon */}
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input name="name" defaultValue={user.name}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Job Title / Position (e.g. Circulation Manager)</Label>
                            <Input name="position" defaultValue={user.position || ""} placeholder="Enter your designation"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input name="email" defaultValue={user.email}/>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="button" variant="ghost" className="flex-1" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                            <Button type="submit" className={`flex-1 text-white ${isAdmin ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                )}
                
            </CardContent>
        </Card>
    </div>
  );
}