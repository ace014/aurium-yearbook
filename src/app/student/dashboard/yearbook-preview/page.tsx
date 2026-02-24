"use client"; 

import { useRouter } from "next/navigation";
import { YearbookPreview } from "@/components/student/dashboard/YearbookPreview";

export default function YearbookPreviewPage() {
  const router = useRouter();


  const dummyUser = {
    first_name: "Yuna",
    last_name: "Tanaka",
    course: "Bachelor of Science in Information Technology",
    student_number: 201002,
    photo: "" 
  };

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <YearbookPreview 
        user={dummyUser as any} // 'as any' lang usa para dili mag-inarte si TS sa uban missing fields
        onClose={() => router.push('/student/dashboard')} // Mo-back sa dashboard inig click sa close/back button
      />
    </main>
  );
}