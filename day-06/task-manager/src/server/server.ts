/**
 * Task Manager — Local REST API & Static File Server
 * server/server.ts
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import type { ApiErrorBody, Task } from "../shared/types.ts";
import { validateNewTask, validateTaskUpdate } from "../shared/validate.ts";

const PORT = Number(process.env.PORT ?? 3000);
const SLOW = Number(process.env.SLOW ?? 0);             // extra ms before every API response
const FAIL_RATE = Number(process.env.FAIL_RATE ?? 0);   // 0–1: chance an API call fails with 500

const ROOT = new URL("../../", import.meta.url);        // the project folder
const DATA_DIR = new URL("data/", ROOT);
const DATA_FILE = new URL("tasks.json", DATA_DIR);

export const SEED: Task[] = [
  { id: 1, title: "Read the Day 06 README", done: true, priority: "high", createdAt: "2026-09-27T09:00:00.000Z" },
  { id: 2, title: "Call the API with fetch", done: false, priority: "high", createdAt: "2026-09-27T09:05:00.000Z" },
  { id: 3, title: "Style the task list with Grid", done: false, priority: "medium", createdAt: "2026-09-27T09:10:00.000Z" },
];

// ---------- storage: a JSON file, so tasks survive a restart ----------

async function loadTasks(): Promise<Task[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8")) as Task[];
  } catch {
    return [...SEED]; // first run, or the file was deleted
  }
}

async function saveTasks(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

let tasks = await loadTasks();

// ---------- helpers ----------

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendError(res: ServerResponse, status: number, error: string): void {
  const body: ApiErrorBody = { error };
  sendJson(res, status, body);
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  let text = "";
  for await (const chunk of req) {
    text += chunk;
    if (text.length > 10_000) throw new Error("Body too large");
  }
  return JSON.parse(text); // throws SyntaxError on bad JSON → 400
}

// ---------- the API ----------

async function handleApi(req: IncomingMessage, res: ServerResponse, path: string): Promise<void> {
  if (SLOW > 0) await delay(SLOW);
  if (Math.random() < FAIL_RATE) return sendError(res, 500, "Random failure (FAIL_RATE is on)");

  const method = req.method ?? "GET";

  // /api/tasks
  if (path === "/api/tasks") {
    if (method === "GET") return sendJson(res, 200, tasks);

    if (method === "POST") {
      const checked = validateNewTask(await readBody(req));
      if (!checked.ok) return sendError(res, 400, checked.error);

      const task: Task = {
        id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
        title: checked.value.title,
        done: false,
        priority: checked.value.priority,
        createdAt: new Date().toISOString(),
      };
      if (checked.value.dueDate) {
        task.dueDate = checked.value.dueDate;
      }

      tasks = [...tasks, task];
      await saveTasks();
      return sendJson(res, 201, task);
    }

    return sendError(res, 405, `${method} is not allowed on /api/tasks`);
  }

  // /api/tasks/:id
  const match = path.match(/^\/api\/tasks\/(\d+)$/);
  if (match) {
    const id = Number(match[1]);
    const task = tasks.find((t) => t.id === id);
    if (!task) return sendError(res, 404, `No task with id ${id}`);

    if (method === "GET") return sendJson(res, 200, task);

    if (method === "PATCH") {
      const checked = validateTaskUpdate(await readBody(req));
      if (!checked.ok) return sendError(res, 400, checked.error);
      const updated: Task = { ...task, ...checked.value };
      tasks = tasks.map((t) => (t.id === id ? updated : t));
      await saveTasks();
      return sendJson(res, 200, updated);
    }

    if (method === "DELETE") {
      tasks = tasks.filter((t) => t.id !== id);
      await saveTasks();
      res.writeHead(204); // 204 No Content
      return void res.end();
    }

    return sendError(res, 405, `${method} is not allowed on /api/tasks/${id}`);
  }

  sendError(res, 404, `No API route for ${method} ${path}`);
}

// ---------- static files: index.html, styles.css, and compiled dist/ ----------

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

async function handleStatic(res: ServerResponse, path: string): Promise<void> {
  const file = path === "/" ? "/index.html" : path;
  const allowed = file === "/index.html" || file === "/layout-lab.html" || file === "/styles.css" || file.startsWith("/dist/");
  if (!allowed || file.includes("..")) return sendError(res, 404, "Not found");
  try {
    const body = await readFile(new URL(`.${file}`, ROOT));
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    sendError(res, 404, `Not found: ${file}${file.startsWith("/dist/") ? " — did you run npm run build?" : ""}`);
  }
}

// ---------- the server ----------

const server = createServer(async (req, res) => {
  const started = Date.now();
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  try {
    if (path.startsWith("/api/")) await handleApi(req, res, path);
    else await handleStatic(res, path);
  } catch (err) {
    if (err instanceof SyntaxError) sendError(res, 400, "Body is not valid JSON");
    else sendError(res, 500, "Something went wrong on the server");
  } finally {
    if (path.startsWith("/api/")) {
      console.log(`${req.method} ${path} → ${res.statusCode} (${Date.now() - started}ms)`);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Task API on http://localhost:${PORT}  ·  app on http://localhost:${PORT}/`);
  if (SLOW) console.log(`  SLOW: +${SLOW}ms per API call`);
  if (FAIL_RATE) console.log(`  FAIL_RATE: ${FAIL_RATE * 100}% of API calls fail`);
});
