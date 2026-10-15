/**
 * Day 06 — Task 12: Migrated grade-lib.ts
 * Clean types, zero 'any', real bugs fixed.
 */

export type LetterGrade = "A" | "B" | "C" | "D" | "F" | "?";

export interface StudentRecord {
  id?: number;
  name?: string;
  score: number;
  attendance?: number;
}

export const isValidScore = (score: unknown): score is number =>
  typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;

export function letterGrade(score: unknown): LetterGrade {
  if (!isValidScore(score)) return "?";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export interface PassingParams {
  score?: number;
  passMark?: number;
}

export const isPassing = ({ score = 0, passMark = 60 }: PassingParams = {}): boolean =>
  isValidScore(score) && score >= passMark;

export interface RiskParams {
  score?: number;
  attendance?: number;
}

export const isAtRisk = ({ score = 0, attendance = 0 }: RiskParams = {}): boolean =>
  !isValidScore(score) || score < 60 || attendance < 70;

export function average(numbers: number[] = []): number {
  if (numbers.length === 0) return 0;
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum / numbers.length;
}

// Fixed Real Bug: Handle empty array safely without accessing low.score on undefined
export function minMaxStudent(students: StudentRecord[] = []): [StudentRecord | null, StudentRecord | null] {
  if (students.length === 0) return [null, null];
  const first = students[0];
  if (first === undefined) return [null, null];

  let low: StudentRecord = first;
  let high: StudentRecord = first;

  for (const student of students) {
    if (student.score < low.score) low = student;
    if (student.score > high.score) high = student;
  }
  return [low, high];
}

export function countByGrade(students: StudentRecord[] = []): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const student of students) {
    const grade = letterGrade(student.score);
    counts[grade] = (counts[grade] ?? 0) + 1;
  }
  return counts;
}

export interface RowParams {
  name?: string;
  score?: number;
  attendance?: number;
}

export function formatRow({ name = "???", score = 0, attendance = 0 }: RowParams = {}): string {
  const paddedName = name.padEnd(10);
  const paddedScore = String(score).padStart(3);
  const grade = letterGrade(score);
  const safeAtt = `${attendance}%`.padStart(4);
  const status = isPassing({ score }) ? "PASS" : "FAIL";
  const riskFlag = isAtRisk({ score, attendance }) ? "AT-RISK" : "OK";
  return `${paddedName} ${paddedScore}   ${grade}   ${safeAtt}   ${status.padEnd(5)} ${riskFlag}`;
}

export interface BonusParams extends Record<string, unknown> {
  score?: number;
}

export const withBonus = <T extends BonusParams>(student: T, bonus: number = 5): T & { score: number } => {
  const currentScore = student.score ?? 0;
  return {
    ...student,
    score: Math.min(100, currentScore + bonus),
  };
};

export const withoutField = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  field: K
): Omit<T, K> => {
  const copy = { ...obj };
  delete copy[field];
  return copy;
};
