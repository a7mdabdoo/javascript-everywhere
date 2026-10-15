/**
 * Day 06 — Project Types
 * types.ts
 */

export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export interface Address {
  city?: string;
}

export interface Student {
  readonly id: number;
  name: string;
  score: number;
  address?: Address;
}

export interface GradedStudent extends Student {
  letterGrade: LetterGrade;
  passed: boolean;
  attendance: number | null;
}

export interface AttendanceRecord {
  studentId: number;
  rate: number;
}
