/**
 * Task Manager — Shared Validation Rules
 * shared/validate.ts
 */

import type { NewTask, Priority, Task, TaskUpdate } from "./types.ts";

export const PRIORITIES: readonly Priority[] = ["low", "medium", "high"];
export const TITLE_MAX = 120;

export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPriority(value: unknown): value is Priority {
  return PRIORITIES.includes(value as Priority);
}

function checkTitle(value: unknown): Checked<string> {
  if (typeof value !== "string") return { ok: false, error: "title must be a string" };
  const title = value.trim();
  if (title.length === 0) return { ok: false, error: "title is required" };
  if (title.length > TITLE_MAX) return { ok: false, error: `title must be ${TITLE_MAX} characters or fewer` };
  return { ok: true, value: title };
}

function checkDueDate(value: unknown): Checked<string | undefined> {
  if (value === undefined || value === null || value === "") return { ok: true, value: undefined };
  if (typeof value !== "string") return { ok: false, error: "dueDate must be a string" };
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return { ok: false, error: "dueDate must be a valid date" };
  return { ok: true, value };
}

export function validateNewTask(input: unknown): Checked<NewTask> {
  if (!isObject(input)) return { ok: false, error: "body must be a JSON object" };

  const title = checkTitle(input["title"]);
  if (!title.ok) return title;

  const priority = input["priority"] ?? "medium";
  if (!isPriority(priority)) return { ok: false, error: `priority must be one of: ${PRIORITIES.join(", ")}` };

  const dueDate = checkDueDate(input["dueDate"]);
  if (!dueDate.ok) return dueDate;

  const newTask: NewTask = {
    title: title.value,
    priority,
  };
  if (dueDate.value !== undefined) {
    newTask.dueDate = dueDate.value;
  }

  return { ok: true, value: newTask };
}

export function validateTaskUpdate(input: unknown): Checked<TaskUpdate> {
  if (!isObject(input)) return { ok: false, error: "body must be a JSON object" };

  const update: TaskUpdate = {};

  if ("title" in input) {
    const title = checkTitle(input["title"]);
    if (!title.ok) return title;
    update.title = title.value;
  }

  if ("done" in input) {
    if (typeof input["done"] !== "boolean") return { ok: false, error: "done must be true or false" };
    update.done = input["done"];
  }

  if ("priority" in input) {
    if (!isPriority(input["priority"])) return { ok: false, error: `priority must be one of: ${PRIORITIES.join(", ")}` };
    update.priority = input["priority"];
  }

  if ("dueDate" in input) {
    const dueDate = checkDueDate(input["dueDate"]);
    if (!dueDate.ok) return dueDate;
    update.dueDate = dueDate.value;
  }

  if (Object.keys(update).length === 0) return { ok: false, error: "nothing to update" };
  return { ok: true, value: update };
}

export function isTask(value: unknown): value is Task {
  if (!isObject(value)) return false;
  if (typeof value["id"] !== "number") return false;
  if (typeof value["title"] !== "string") return false;
  if (typeof value["done"] !== "boolean") return false;
  if (!isPriority(value["priority"])) return false;
  if (typeof value["createdAt"] !== "string") return false;
  if ("dueDate" in value && value["dueDate"] !== undefined && typeof value["dueDate"] !== "string") return false;
  return true;
}

export function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}
