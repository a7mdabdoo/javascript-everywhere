/**
 * Day 06 — Task 5.1: Database Shapes
 * db-types.ts
 */

export type StudentStatus = "active" | "graduated" | "suspended";
export type Track = "Frontend" | "Backend" | "AI";

export interface Student {
  readonly id: number;
  name: string;
  city: string;
  courseId: string;
  status: StudentStatus;
  email?: string;       // Optional 1
  phone?: string;       // Optional 2
}

export interface Course {
  readonly id: string;
  title: string;
  credits: number;
  instructorId: string;
  track: Track;         // Literal union
}

// Interface extending another interface:
export interface AdvancedCourse extends Course {
  prerequisites: readonly string[];
  capstoneRequired: boolean;
}

export interface Instructor {
  readonly id: string;
  name: string;
  department: string;
  office?: string;      // Optional 3
}

export interface EnrollmentRecord {
  readonly studentId: number;
  readonly courseId: string;
  semester: string;
  finalScore?: number;
}

// Type built with intersection (&):
export type StudentWithCourse = Student & {
  courseDetails: Course;
};

export interface StudentFullReport {
  student: Student;
  scores: number[];
  averageScore: number;
  course: Course;
  instructor: Instructor;
}
