/**
 * Task Manager — Typed Client API Functions
 * client/api.ts
 */

import type { NewTask, Task, TaskUpdate } from "../shared/types.ts";
import { isTask, isTaskList } from "../shared/validate.ts";
import { request, requestWithRetry, type Result } from "./http.ts";

let baseUrl = "/api";

export function setBaseUrl(url: string): void {
  baseUrl = url;
}

const isNothing = (value: unknown): value is void => value === undefined;

// listTasks uses requestWithRetry because GET is idempotent and safe to retry:
export function listTasks(signal?: AbortSignal): Promise<Result<Task[]>> {
  return requestWithRetry(`${baseUrl}/tasks`, { check: isTaskList, signal });
}

// getTask fetches a single task:
export function getTask(id: number, signal?: AbortSignal): Promise<Result<Task>> {
  return requestWithRetry(`${baseUrl}/tasks/${id}`, { check: isTask, signal });
}

// createTask uses plain request without retry because POST is NOT idempotent:
// Retrying a failed or timed-out POST could create duplicate tasks on the server.
export function createTask(input: NewTask): Promise<Result<Task>> {
  return request(`${baseUrl}/tasks`, { method: "POST", body: input, check: isTask });
}

export function updateTask(id: number, changes: TaskUpdate): Promise<Result<Task>> {
  return request(`${baseUrl}/tasks/${id}`, { method: "PATCH", body: changes, check: isTask });
}

export function deleteTask(id: number): Promise<Result<void>> {
  return request(`${baseUrl}/tasks/${id}`, { method: "DELETE", check: isNothing });
}
