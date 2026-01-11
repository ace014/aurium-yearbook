// src/types/index.ts

export type StudentStatus = 'pending' | 'verified' | 'approved' | 'locked';

export interface Student {
  id: string; // The UUID
  student_id: string; // The School ID (e.g. "2023-0001")
  full_name: string;
  program: string;
  status: StudentStatus;
  photo_url: string | null;
  quote: string | null;
  created_at: string;
}

export interface QueueItem {
  id: string;
  student_id: string;
  status: 'waiting' | 'serving' | 'completed';
  updated_at: string;
}