/**
 * Task Manager — Shared API Contract
 * shared/types.ts
 */

export type Priority = "low" | "medium" | "high";

export interface Task {
  readonly id: number;
  title: string;
  done: boolean;
  priority: Priority;
  dueDate?: string;           // Task 21 custom feature: optional due date (YYYY-MM-DD)
  readonly createdAt: string;  // ISO date, set by the server
}

// What the client sends to create a task:
export type NewTask = Pick<Task, "title" | "priority" | "dueDate">;

// What the client sends to update a task:
export type TaskUpdate = Partial<Pick<Task, "title" | "done" | "priority" | "dueDate">>;

// API error response shape:
export interface ApiErrorBody {
  error: string;
}
