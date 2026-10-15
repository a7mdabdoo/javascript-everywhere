/**
 * Day 06 — Project Library: Grade & Student Validation
 * grade-lib.ts
 */

import type { Student, LetterGrade } from "../types.ts";

export const PASS_MARK = 60;

export function letterGrade(score: number): LetterGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function isPassing(score: number, passMark: number = PASS_MARK): boolean {
  return score >= passMark;
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function formatPercentage(rate: number | null): string {
  if (rate === null || rate === undefined) return "—";
  return `${Math.round(rate * 100)}%`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStudent(value: unknown): value is Student {
  if (!isRecord(value)) return false;

  if (typeof value["id"] !== "number" || !Number.isInteger(value["id"])) return false;
  if (typeof value["name"] !== "string" || value["name"].trim().length === 0) return false;
  if (typeof value["score"] !== "number" || Number.isNaN(value["score"])) return false;

  // Strict score boundary: must be between 0 and 100
  if (value["score"] < 0 || value["score"] > 100) return false;

  if ("address" in value && value["address"] !== undefined) {
    if (!isRecord(value["address"])) return false;
    if ("city" in value["address"] && typeof value["address"]["city"] !== "string") {
      return false;
    }
  }

  return true;
}
