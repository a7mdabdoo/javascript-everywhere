# Feature Documentation: Task Due Date

## Overview
For Task 21 of Day 06, we added an optional **Due Date** (`dueDate`) field to the Task Manager application across the entire full-stack pipeline:
1. Shared TypeScript types (`shared/types.ts`)
2. Shared runtime input validation (`shared/validate.ts`)
3. Local HTTP REST API server (`src/server/server.ts`)
4. Typed frontend client (`src/client/main.ts` and `src/client/api.ts`)
5. Semantic HTML markup & responsive CSS styling (`index.html`, `styles.css`)

---

## 1. Type Definitions (`shared/types.ts`)
We extended the core `Task`, `NewTaskInput`, and `TaskUpdateInput` interfaces with an optional `dueDate?: string`:

```typescript
export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: string;
  dueDate?: string; // ISO 8601 Date (YYYY-MM-DD)
}

export interface NewTaskInput {
  title: string;
  priority: Priority;
  dueDate?: string;
}

export interface TaskUpdateInput {
  title?: string;
  done?: boolean;
  priority?: Priority;
  dueDate?: string | null;
}
```

---

## 2. Runtime Validation (`shared/validate.ts`)
Because TypeScript types only exist at compile time, runtime validation guarantees incoming HTTP payloads are safe:

- If `dueDate` is present, it must be a string matching standard date format `YYYY-MM-DD` (`^\d{4}-\d{2}-\d{2}$`).
- If invalid or poorly formatted, validation fails gracefully returning `Result<T, string>` with `{ ok: false, error: "dueDate must be a valid date string (YYYY-MM-DD)" }`.

---

## 3. Server Handling (`src/server/server.ts`)
- **POST `/api/tasks`**:
  Reads `checked.value.dueDate`. If provided, sets `task.dueDate = checked.value.dueDate` and persists it to `data/tasks.json`.
- **PATCH `/api/tasks/:id`**:
  Merges `checked.value` into existing task. If `dueDate` is updated, the changes persist safely.

---

## 4. Frontend Integration (`index.html` & `src/client/main.ts`)
- **HTML Form**: Added `<label for="dueDate">Due Date (Optional)</label>` and `<input id="dueDate" name="dueDate" type="date" />`.
- **DOM Rendering**: When rendering each task item `<li>`, if `task.dueDate` exists:
  - An accessible badge `<time class="due-badge" datetime="...">` is created.
  - If the date is earlier than today and the task is still active (`!task.done`), an `.overdue` class is applied with a red indicator.
- **Security**: The date string is inserted strictly using `textContent` to prevent any XSS attacks.

---

## 5. Verification & Testing

### Using `curl`
```bash
# Create a task with dueDate
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Study TypeScript Generics", "priority": "high", "dueDate": "2026-10-25"}'

# Verify GET returns dueDate
curl -s http://localhost:3000/api/tasks | grep "2026-10-25"
```

### Automated Smoke Test
The feature is verified in `npm run smoke` (`src/scripts/smoke.ts`):
```
✓ create
  new id 4, created 2026-10-15T10:49:15.351Z, dueDate 2026-10-30
```
