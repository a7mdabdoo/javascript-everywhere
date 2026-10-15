/**
 * Day 06 — Task 8: Generics Lab
 * generics-lab.ts
 */

import type { Student } from "./db-types.ts";
import { STUDENTS, getStudent } from "./typed-db.ts";

console.log("=== Part 8.1 — Generic Functions ===");

// 1. first and last helpers:
export function first<T>(items: T[]): T | undefined {
  return items[0];
}

export function last<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[items.length - 1] : undefined;
}

const numFirst = first([10, 20, 30]);       // Inferred: number | undefined
const strLast = last(["CS101", "AI201"]);   // Inferred: string | undefined
const boolFirst = first([true, false]);     // Inferred: boolean | undefined
console.log({ numFirst, strLast, boolFirst });

// 2. findById with { id: number } constraint:
export function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

const studentList: Student[] = Object.values(STUDENTS);
const foundStudent = findById(studentList, 101); // Valid call
console.log("findById student 101:", foundStudent?.name);

type CourseItem = { id: number; title: string };
const courseList: CourseItem[] = [
  { id: 1, title: "Discrete Math" },
  { id: 2, title: "Operating Systems" },
];
const foundCourse = findById(courseList, 2);
console.log("findById course 2   :", foundCourse?.title);

// Constraint rejection (recorded):
// findById(["apple", "banana"], 1);
// error TS2322: Type 'string' is not assignable to type '{ id: number; }'.

// 3. pluck helper:
export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

const studentNames = pluck(studentList, "name"); // Inferred: string[]
const studentCities = pluck(studentList, "city"); // Inferred: string[]
console.log("Plucked names :", studentNames);
console.log("Plucked cities:", studentCities);

// Invalid key rejection (recorded):
// pluck(studentList, "nonExistentKey");
// error TS2345: Argument of type '"nonExistentKey"' is not assignable to parameter of type 'keyof Student'.

// 4. groupBy helper:
export function groupBy<T, K extends string>(
  items: T[],
  keyOf: (item: T) => K
): Partial<Record<K, T[]>> {
  const result: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = keyOf(item);
    const existing = result[key];
    if (existing) {
      existing.push(item);
    } else {
      result[key] = [item];
    }
  }
  return result;
}

const groupedByStatus = groupBy(studentList, (s) => s.status);
console.log("Grouped by status active count    :", groupedByStatus["active"]?.length);
console.log("Grouped by status graduated count :", groupedByStatus["graduated"]?.length);

// 5. unique helper with Set:
export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
console.log("Unique cities:", unique(["Qena", "Cairo", "Qena", "Alexandria", "Cairo"]));


console.log("\n=== Part 8.2 — Generic Types & Result Pattern ===");

// 1. Result<T> discriminated union:
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

// 2. safeParse with runtime type guard check:
export function safeParse<T>(
  json: string,
  check: (value: unknown) => value is T
): Result<T> {
  try {
    const parsed: unknown = JSON.parse(json);
    if (check(parsed)) {
      return { ok: true, value: parsed };
    }
    return { ok: false, error: "Parsed JSON does not match expected schema" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Invalid JSON syntax: ${msg}` };
  }
}

function isScoreRecord(value: unknown): value is { exam: number } {
  return typeof value === "object" && value !== null && typeof (value as { exam: unknown }).exam === "number";
}

const resGood = safeParse('{"exam": 95}', isScoreRecord);
const resWrongShape = safeParse('{"test": "not a number"}', isScoreRecord);
const resBadSyntax = safeParse('{broken json', isScoreRecord);

console.log("SafeParse Good       :", resGood.ok ? resGood.value : resGood.error);
console.log("SafeParse Wrong Shape:", resWrongShape.ok ? resWrongShape.value : resWrongShape.error);
console.log("SafeParse Bad Syntax :", resBadSyntax.ok ? resBadSyntax.value : resBadSyntax.error);

// Prove reading .value without .ok check is an error:
// const unsafeValue = resGood.value; // error TS2339: Property 'value' does not exist on type 'Result<{ exam: number; }>'. Property 'value' does not exist on type '{ ok: false; error: string; }'.

// 3. Generic Store interface:
export interface Store<T extends { id: number }> {
  add(item: T): void;
  get(id: number): T | undefined;
  all(): T[];
  remove(id: number): boolean;
}

export function createStore<T extends { id: number }>(): Store<T> {
  const map = new Map<number, T>();
  return {
    add(item: T): void {
      map.set(item.id, item);
    },
    get(id: number): T | undefined {
      return map.get(id);
    },
    all(): T[] {
      return Array.from(map.values());
    },
    remove(id: number): boolean {
      return map.delete(id);
    },
  };
}

const studentStore = createStore<Student>();
studentStore.add({ id: 201, name: "Sara", city: "Qena", courseId: "CS-201", status: "active" });
console.log("Store all count:", studentStore.all().length);
console.log("Store get 201  :", studentStore.get(201)?.name);

// Wrong shape error (recorded):
// studentStore.add({ id: 202, title: "Book without Student fields" });
// error TS2345: Argument of type '{ id: number; title: string; }' is not assignable to parameter of type 'Student'.


console.log("\n=== Part 8.3 — Generic Async Helpers ===");

// 1. withTimeout helper:
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]);
}

// 2. retry helper without unhandled return or unknown error issues:
export async function retry<T>(fn: () => Promise<T>, times: number): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      if (attempt === times) break;
    }
  }
  const errorMsg = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Exceeded ${times} retry attempts. Final error: ${errorMsg}`);
}

// 3. mapAsync helper:
export async function mapAsync<T, U>(
  items: T[],
  fn: (item: T) => Promise<U>
): Promise<U[]> {
  return Promise.all(items.map((item) => fn(item)));
}

// Testing with Task 5 functions:
const student101WithTimeout = await withTimeout(getStudent(101), 1000);
console.log("withTimeout fetched student 101:", student101WithTimeout.name);

let attemptsCount = 0;
const flakyTask = async (): Promise<string> => {
  attemptsCount++;
  if (attemptsCount < 3) throw new Error("Flaky network drop");
  return "Recovered on attempt #3";
};
const retrySuccess = await retry(flakyTask, 4);
console.log("retry result:", retrySuccess);

const studentIds = [101, 102, 104];
const mappedStudents = await mapAsync(studentIds, (id) => getStudent(id));
console.log("mapAsync fetched names:", mappedStudents.map((s) => s.name));
