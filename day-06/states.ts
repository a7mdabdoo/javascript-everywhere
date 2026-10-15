/**
 * Day 06 — Task 6.1: Discriminated Unions & States
 * states.ts
 */

console.log("=== Part 6.1 — The status Pattern (Discriminated Unions) ===");

// 1. LoadState union with 5 members:
export type IdleState = { status: "idle" };
export type LoadingState = { status: "loading"; startedAt: number };
export type SuccessState = { status: "success"; data: string[]; loadedAt: number };
export type ErrorState = { status: "error"; error: string; code: number };
export type RefreshingState = { status: "refreshing"; previousData: string[]; attempt: number };

export type LoadState = IdleState | LoadingState | SuccessState | ErrorState | RefreshingState;

// 2. describe(state) with switch and exhaustive default:
export function describe(state: LoadState): string {
  switch (state.status) {
    case "idle":
      return "App is idle. Waiting for user interaction.";
    case "loading":
      return `Fetching data... started at timestamp ${state.startedAt}.`;
    case "success":
      return `Success! Loaded ${state.data.length} records at ${new Date(state.loadedAt).toISOString()}.`;
    case "error":
      return `Failed with code ${state.code}: ${state.error}`;
    case "refreshing":
      return `Refreshing in background (attempt #${state.attempt}). Showing ${state.previousData.length} cached records.`;
    default: {
      // Exhaustive check:
      const unreachable: never = state;
      throw new Error(`Unhandled state: ${JSON.stringify(unreachable)}`);
    }
  }
}

// 3. Test describe with all states:
console.log(describe({ status: "idle" }));
console.log(describe({ status: "loading", startedAt: Date.now() }));
console.log(describe({ status: "success", data: ["Algorithms", "Database"], loadedAt: Date.now() }));
console.log(describe({ status: "error", error: "Connection timed out", code: 408 }));
console.log(describe({ status: "refreshing", previousData: ["Old Record"], attempt: 2 }));

// Property from wrong member error (recorded):
// inside case "loading":
// console.log(state.data); // error TS2339: Property 'data' does not exist on type 'LoadingState'.

// 4. Second Discriminated Union: SubmissionStatus
export type SubmissionDraft = { status: "draft"; lastSaved: string };
export type SubmissionPending = { status: "submitted"; submittedAt: string; prUrl: string };
export type SubmissionGraded = { status: "graded"; score: number; feedback: string; reviewedBy: string };

export type SubmissionStatus = SubmissionDraft | SubmissionPending | SubmissionGraded;

export function formatSubmission(sub: SubmissionStatus): string {
  switch (sub.status) {
    case "draft":
      return `Draft saved at ${sub.lastSaved}`;
    case "submitted":
      return `Under review. PR: ${sub.prUrl}`;
    case "graded":
      return `Grade: ${sub.score}/100 - "${sub.feedback}" (by ${sub.reviewedBy})`;
  }
}

console.log(formatSubmission({ status: "submitted", submittedAt: "2026-10-15", prUrl: "https://github.com/pull/1" }));
console.log(formatSubmission({ status: "graded", score: 98, feedback: "Excellent TypeScript implementation", reviewedBy: "Eng. Mostafa Saqly" }));

// 5. Rewrite Day 05 Promise.allSettled with explicit PromiseSettledResult:
type StudentAttendance = { studentId: number; present: boolean };

const mockPromises: Promise<StudentAttendance>[] = [
  Promise.resolve({ studentId: 101, present: true }),
  Promise.reject(new Error("Student 102 attendance service unavailable")),
  Promise.resolve({ studentId: 103, present: false }),
];

const results: PromiseSettledResult<StudentAttendance>[] = await Promise.allSettled(mockPromises);

console.log("\n--- Promise.allSettled Discriminated Union ---");
results.forEach((res, idx) => {
  if (res.status === "fulfilled") {
    // Narrowed to PromiseFulfilledResult<StudentAttendance>
    console.log(`[#${idx + 1} Fulfilled]: Student ${res.value.studentId} present: ${res.value.present}`);
  } else {
    // Narrowed to PromiseRejectedResult
    const reasonMsg = res.reason instanceof Error ? res.reason.message : String(res.reason);
    console.log(`[#${idx + 1} Rejected ]: ${reasonMsg}`);
  }
});
