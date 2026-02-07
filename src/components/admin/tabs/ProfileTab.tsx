"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck } from "lucide-react";

export function ProfileTab({ user, setUser }: any) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-xl mx-auto mt-10">
        <Card className="shadow-xl border-t-4 border-amber-600">
            <CardHeader className="text-center border-b bg-stone-50">
                <div className="w-24 h-24 mx-auto mb-4 relative"><Avatar className="w-full h-full border-4 border-white shadow-lg"><AvatarImage src={user.avatar}/><AvatarFallback>AD</AvatarFallback></Avatar></div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.role}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {!isEditing ? (
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2"><span className="text-xs font-bold text-stone-400 uppercase">System Role</span><span className="font-medium flex gap-2"><ShieldCheck size={16} className="text-green-600"/> Administrator</span></div>
                        <div className="flex justify-between border-b pb-2"><span className="text-xs font-bold text-stone-400 uppercase">Email</span><span className="font-medium">{user.email}</span></div>
                        <Button className="w-full mt-4" variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); setUser({...user, name: fd.get('name'), email: fd.get('email')}); setIsEditing(false); }} className="space-y-4">
                        <div className="space-y-2"><Label>Name</Label><Input name="name" defaultValue={user.name}/></div>
                        <div className="space-y-2"><Label>Email</Label><Input name="email" defaultValue={user.email}/></div>
                        <div className="flex gap-2"><Button type="button" variant="ghost" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button><Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">Save</Button></div>
                    </form>
                )}
            </CardContent>
        </Card>
    </div>
  );
}