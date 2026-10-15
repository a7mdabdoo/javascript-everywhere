/**
 * Task Manager — Full Stack Interactive Client Application
 * client/main.ts
 */

import type { Priority, Task } from "../shared/types.ts";
import { PRIORITIES, validateNewTask } from "../shared/validate.ts";
import { createTask, deleteTask, listTasks, updateTask } from "./api.ts";
import { describeError } from "./http.ts";

// ---------- DOM lookups with typed helper ----------

function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id} in index.html`);
  return el as T;
}

const form = $<HTMLFormElement>("task-form");
const titleInput = $<HTMLInputElement>("title");
const prioritySelect = $<HTMLSelectElement>("priority");
const dueDateInput = $<HTMLInputElement>("dueDate");
const addButton = $<HTMLButtonElement>("add-button");
const formError = $<HTMLParagraphElement>("form-error");
const search = $<HTMLInputElement>("search");
const list = $<HTMLUListElement>("task-list");
const counts = $<HTMLParagraphElement>("counts");
const status = $<HTMLParagraphElement>("status");
const retry = $<HTMLButtonElement>("retry");
const clearDone = $<HTMLButtonElement>("clear-done");
const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");

// ---------- Application State ----------

type Filter = "all" | "active" | "done";

type View =
  | { status: "loading" }
  | { status: "failed"; message: string }
  | { status: "ready" };

interface State {
  view: View;
  tasks: Task[];
  filter: Filter;
  query: string;
  pending: ReadonlySet<number>;
  notice: string;
}

let state: State = {
  view: { status: "loading" },
  tasks: [],
  filter: "all",
  query: "",
  pending: new Set(),
  notice: "",
};

function setState(changes: Partial<State>): void {
  state = { ...state, ...changes };
  render();
}

function withPending(id: number, on: boolean): ReadonlySet<number> {
  const next = new Set(state.pending);
  if (on) next.add(id);
  else next.delete(id);
  return next;
}

function replaceTask(updated: Task): Task[] {
  return state.tasks.map((t) => (t.id === updated.id ? updated : t));
}

// ---------- Render: State -> DOM ----------

function visibleTasks(): Task[] {
  const q = state.query.trim().toLowerCase();
  return state.tasks.filter((t) => {
    if (state.filter === "active" && t.done) return false;
    if (state.filter === "done" && !t.done) return false;
    return q === "" || t.title.toLowerCase().includes(q);
  });
}

function taskItem(task: Task): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "task";
  li.classList.toggle("done", task.done);
  li.classList.toggle("pending", state.pending.has(task.id));
  li.dataset.id = String(task.id);
  li.dataset.priority = task.priority;

  const box = document.createElement("input");
  box.type = "checkbox";
  box.id = `task-${task.id}`;
  box.checked = task.done;
  box.dataset.action = "toggle";

  const label = document.createElement("label");
  label.htmlFor = box.id;
  label.className = "task-title";
  label.textContent = task.title; // Safe textContent to prevent XSS

  // Custom Feature (Task 21): Due Date Display
  let dueSpan: HTMLSpanElement | null = null;
  if (task.dueDate) {
    dueSpan = document.createElement("span");
    dueSpan.className = "task-due";
    dueSpan.textContent = `Due: ${task.dueDate}`;
  }

  const select = document.createElement("select");
  select.dataset.action = "priority";
  select.ariaLabel = `Priority for ${task.title}`;
  for (const p of PRIORITIES) {
    select.add(new Option(p, p, false, p === task.priority));
  }

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete";
  del.dataset.action = "delete";
  del.ariaLabel = `Delete ${task.title}`;
  del.textContent = "✕";

  for (const control of [box, select, del]) {
    control.disabled = state.pending.has(task.id);
  }

  li.append(box, label);
  if (dueSpan) li.append(dueSpan);
  li.append(select, del);

  return li;
}

function statusText(view: View, shown: number): string {
  switch (view.status) {
    case "loading":
      return "Loading tasks…";
    case "failed":
      return view.message;
    case "ready":
      if (state.notice) return state.notice;
      if (state.tasks.length === 0) return "No tasks yet — add your first one.";
      if (shown === 0) return "Nothing matches this filter.";
      return "";
    default: {
      const unreachable: never = view;
      return unreachable;
    }
  }
}

function render(): void {
  // Preserve focus position for accessibility:
  const focused = document.activeElement;
  const focusId = focused instanceof HTMLElement ? focused.closest<HTMLElement>(".task")?.dataset.id : undefined;
  const focusAction = focused instanceof HTMLElement ? focused.dataset.action : undefined;

  const shown = visibleTasks();
  list.replaceChildren(...shown.map(taskItem));

  const doneCount = state.tasks.filter((t) => t.done).length;
  counts.textContent = `${state.tasks.length - doneCount} active · ${doneCount} done`;

  status.textContent = statusText(state.view, shown.length);
  status.classList.toggle("error", state.view.status === "failed");
  retry.hidden = state.view.status !== "failed";

  for (const button of filterButtons) {
    button.ariaPressed = String(button.dataset.filter === state.filter);
  }
  clearDone.disabled = doneCount === 0;

  if (focusId && focusAction) {
    list.querySelector<HTMLElement>(`[data-id="${focusId}"] [data-action="${focusAction}"]`)?.focus();
  }
}

// ---------- Actions ----------

let loadController: AbortController | undefined;

async function loadTasks(): Promise<void> {
  loadController?.abort();
  loadController = new AbortController();
  setState({ view: { status: "loading" }, notice: "" });

  const result = await listTasks(loadController.signal);
  if (!result.ok) {
    if (result.error.kind !== "aborted") {
      setState({ view: { status: "failed", message: describeError(result.error) } });
    }
    return;
  }
  setState({ view: { status: "ready" }, tasks: result.value });
}

async function handleAdd(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const data = new FormData(form);

  const rawTitle = data.get("title");
  const rawPriority = data.get("priority");
  const rawDueDate = data.get("dueDate");

  // Validate on the client with the same shared rules:
  const checked = validateNewTask({
    title: rawTitle,
    priority: rawPriority,
    dueDate: rawDueDate ? String(rawDueDate) : undefined,
  });

  if (!checked.ok) {
    formError.textContent = checked.error;
    titleInput.focus();
    return;
  }

  formError.textContent = "";
  addButton.disabled = true;

  try {
    const result = await createTask(checked.value);
    if (!result.ok) {
      formError.textContent = describeError(result.error);
      return;
    }
    form.reset();
    setState({
      tasks: [...state.tasks, result.value],
      notice: `Added “${result.value.title}”.`,
    });
    titleInput.focus();
  } finally {
    addButton.disabled = false;
  }
}

// Optimistic toggle: update UI immediately, rollback if server rejects
async function toggleTask(id: number, done: boolean): Promise<void> {
  const before = state.tasks;
  setState({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, done } : t)),
    pending: withPending(id, true),
    notice: "",
  });

  const result = await updateTask(id, { done });
  if (result.ok) {
    setState({ tasks: replaceTask(result.value), pending: withPending(id, false) });
  } else {
    setState({
      tasks: before,
      pending: withPending(id, false),
      notice: `Couldn't save — ${describeError(result.error)}`,
    });
  }
}

// Pessimistic priority update: wait for server confirmation
async function changePriority(id: number, priority: Priority): Promise<void> {
  setState({ pending: withPending(id, true), notice: "" });
  const result = await updateTask(id, { priority });
  setState({
    tasks: result.ok ? replaceTask(result.value) : state.tasks,
    pending: withPending(id, false),
    notice: result.ok ? "" : `Couldn't change priority — ${describeError(result.error)}`,
  });
}

async function removeTask(id: number): Promise<void> {
  setState({ pending: withPending(id, true), notice: "" });
  const result = await deleteTask(id);
  if (!result.ok && !(result.error.kind === "http" && result.error.status === 404)) {
    setState({
      pending: withPending(id, false),
      notice: `Couldn't delete — ${describeError(result.error)}`,
    });
    return;
  }
  setState({
    tasks: state.tasks.filter((t) => t.id !== id),
    pending: withPending(id, false),
    notice: "",
  });
}

async function clearCompleted(): Promise<void> {
  const doneIds = state.tasks.filter((t) => t.done).map((t) => t.id);
  clearDone.disabled = true;
  const results = await Promise.all(doneIds.map((id) => deleteTask(id)));
  const removed = new Set(doneIds.filter((_, i) => results[i]?.ok));
  const failed = doneIds.length - removed.size;
  setState({
    tasks: state.tasks.filter((t) => !removed.has(t.id)),
    notice: failed ? `Removed ${removed.size}, ${failed} failed — try again.` : `Removed ${removed.size} completed.`,
  });
}

// ---------- Event Delegation & Listeners ----------

form.addEventListener("submit", (e) => void handleAdd(e as SubmitEvent));
retry.addEventListener("click", () => void loadTasks());
clearDone.addEventListener("click", () => void clearCompleted());
search.addEventListener("input", () => setState({ query: search.value, notice: "" }));

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    setState({ filter: button.dataset.filter as Filter, notice: "" });
  });
}

// Delegation for checkbox toggle and priority dropdown:
list.addEventListener("change", (event) => {
  const target = event.target;
  const id = Number((target as HTMLElement).closest<HTMLElement>(".task")?.dataset.id);
  if (target instanceof HTMLInputElement && target.dataset.action === "toggle") {
    void toggleTask(id, target.checked);
  } else if (target instanceof HTMLSelectElement && target.dataset.action === "priority") {
    void changePriority(id, target.value as Priority);
  }
});

// Delegation for task deletion button:
list.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action="delete"]');
  const id = Number(button?.closest<HTMLElement>(".task")?.dataset.id);
  if (button && !Number.isNaN(id)) {
    void removeTask(id);
  }
});

void loadTasks();
