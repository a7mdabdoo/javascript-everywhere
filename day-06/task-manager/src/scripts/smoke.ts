/**
 * Task Manager — API Smoke Test
 * scripts/smoke.ts
 */

import { createTask, deleteTask, listTasks, setBaseUrl, updateTask } from "../client/api.ts";
import { describeError, type Result } from "../client/http.ts";

setBaseUrl(process.env.API_URL ?? "http://localhost:3000/api");

function show<T>(label: string, result: Result<T>): T | undefined {
  if (result.ok) {
    console.log(`✓ ${label}`);
    return result.value;
  }
  console.log(`✗ ${label} — ${describeError(result.error)}`);
  return undefined;
}

console.log("=== Running API Smoke Test ===");

const before = show("list", await listTasks());
console.log(`  ${before?.length ?? 0} tasks on the server`);

const created = show("create", await createTask({ title: "Smoke test task", priority: "low", dueDate: "2026-10-30" }));
if (created) {
  console.log(`  new id ${created.id}, created ${created.createdAt}, dueDate ${created.dueDate}`);
  const updated = show("update", await updateTask(created.id, { done: true, priority: "high" }));
  console.log(`  done=${updated?.done} priority=${updated?.priority}`);
  show("delete", await deleteTask(created.id));
  show("delete again (should be 404)", await deleteTask(created.id));
}

show("create with empty title (should be 400)", await createTask({ title: "   ", priority: "low" }));
show("update with bad priority (should be 400)", await updateTask(1, { priority: "urgent" as never }));
