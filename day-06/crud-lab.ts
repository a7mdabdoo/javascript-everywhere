/**
 * Day 06 — Task 15.2: Plain fetch CRUD Lab
 * crud-lab.ts
 */

import type { Task, Priority } from "./task-manager/src/shared/types.ts";
import { isTask, isTaskList } from "./task-manager/src/shared/validate.ts";

const BASE_URL = "http://localhost:3000/api/tasks";

console.log("=== Task 15.2: Plain fetch CRUD Operations ===");

// 1. Read all tasks:
const getAllRes = await fetch(BASE_URL);
if (!getAllRes.ok) throw new Error(`GET all failed: HTTP ${getAllRes.status}`);
const allRaw: unknown = await getAllRes.json();
if (!isTaskList(allRaw)) throw new Error("GET all returned invalid Task[] shape");
console.log(`1. GET all returned ${allRaw.length} tasks.`);

// 2. Create a task with plain fetch:
const createRes = await fetch(BASE_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Verify Task 15 plain fetch", priority: "high" }),
});

if (!createRes.ok) {
  const errBody = (await createRes.json()) as { error: string };
  throw new Error(`POST failed: ${errBody.error}`);
}

const createdRaw: unknown = await createRes.json();
if (!isTask(createdRaw)) throw new Error("Created task does not match Task interface");
const myTask: Task = createdRaw;
console.log(`2. POST created task #${myTask.id}: "${myTask.title}" (Priority: ${myTask.priority})`);

// 3. PATCH two fields in one call & prove the third field is unchanged:
const patchRes = await fetch(`${BASE_URL}/${myTask.id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ done: true, priority: "low" as Priority }),
});

if (!patchRes.ok) throw new Error(`PATCH failed: HTTP ${patchRes.status}`);
const patchedRaw: unknown = await patchRes.json();
if (!isTask(patchedRaw)) throw new Error("Updated task does not match Task interface");

console.log(`3. PATCH updated task #${patchedRaw.id}: done=${patchedRaw.done}, priority=${patchedRaw.priority}`);
console.log(`   Proving third field 'title' unchanged: "${patchedRaw.title}" === "${myTask.title}" -> ${patchedRaw.title === myTask.title}`);

// 4. Handle 204 from DELETE without calling res.json():
const deleteRes = await fetch(`${BASE_URL}/${myTask.id}`, {
  method: "DELETE",
});

if (!deleteRes.ok) throw new Error(`DELETE failed: HTTP ${deleteRes.status}`);
console.log(`4. DELETE status: ${deleteRes.status} (Handled safely without reading empty stream body).`);

// 5. Create three tasks in parallel with Promise.all:
const titlesToCreate = ["Parallel Alpha", "Parallel Beta", "Parallel Gamma"];
const createdBatchResponses = await Promise.all(
  titlesToCreate.map((title) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority: "medium" }),
    })
  )
);

const batchCreatedTasks: Task[] = [];
for (const res of createdBatchResponses) {
  if (res.ok) {
    const raw = (await res.json()) as Task;
    batchCreatedTasks.push(raw);
  }
}
console.log(`5. Created ${batchCreatedTasks.length} tasks in parallel: IDs [${batchCreatedTasks.map((t) => t.id).join(", ")}]`);

// Delete all three in parallel:
const deleteBatchResponses = await Promise.all(
  batchCreatedTasks.map((t) => fetch(`${BASE_URL}/${t.id}`, { method: "DELETE" }))
);
console.log(`   Deleted all 3 tasks in parallel. Statuses: [${deleteBatchResponses.map((r) => r.status).join(", ")}]`);
