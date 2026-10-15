# Day 06 — Task 13: Predictions API & DOM (`predictions-api.md`)

## Summary
Twenty-one predictions covering HTTP requests, status codes, fetch lifecycle, failure layers, query strings, and DOM event mechanics.

---

### Snippet 01 (`p01.ts`)
```ts
const res = await fetch("http://localhost:3000/api/tasks/999");
console.log(res.ok, res.status);
```
- **Prediction:** `false 404`
- **Actual:** `false 404`
- **Mechanism (#1):** **HTTP Status vs Network Failure**. `fetch()` resolves successfully whenever the server responds, even for error status codes like 404 or 500. `res.ok` is only true for 200–299.

---

### Snippet 02 (`p02.ts`)
```ts
try {
  const res = await fetch("http://localhost:3000/api/tasks/999");
  console.log("no throw", res.status);
} catch {
  console.log("threw");
}
```
- **Prediction:** `"no throw 404"`
- **Actual:** `no throw 404`
- **Mechanism (#2):** **`fetch` Does Not Throw on 4xx/5xx**. A common beginner mistake is wrapping `fetch` in `try/catch` and assuming errors like 404 will trigger `catch`. `fetch` only rejects if the request could not be made at all (network disconnection, DNS failure, refused connection).

---

### Snippet 03 (`p03.ts`)
```ts
try {
  await fetch("http://localhost:3999/api/tasks");
  console.log("ok");
} catch (err) {
  console.log(err instanceof Error ? err.name : "?");
}
```
- **Prediction:** `"TypeError"`
- **Actual:** `TypeError`
- **Mechanism:** When a connection is refused (port 3999 closed), Node/browser fetch rejects with a `TypeError` whose `.cause.code` is `ECONNREFUSED`.

---

### Snippet 04 (`p04.ts`)
```ts
const res = await fetch("http://localhost:3000/api/tasks/1");
const a: unknown = await res.json();
const b: unknown = await res.json();
console.log(a, b);
```
- **Prediction:** Throws `TypeError: body stream already read`
- **Actual:** Crashes on second call: `TypeError: Response body object should not be disturbed or locked`
- **Mechanism (#4):** **Single-Use Stream Body**. The body of a `Response` is a readable stream. Once consumed by `.json()`, `.text()`, or `.blob()`, it cannot be read a second time.

---

### Snippet 05 (`p05.ts`)
```ts
const pending = fetch("http://localhost:3000/api/tasks");
console.log(pending instanceof Promise);
const res = await pending;
console.log(typeof res.json, Array.isArray(res));
```
- **Prediction:** `true` \n `"function" false`
- **Actual:** `true` \n `function false`
- **Mechanism:** `fetch` returns a Promise resolving to a `Response` object. `res` is an instance of `Response`, not the data array; the data array is extracted by calling `await res.json()`.

---

### Snippet 06 (`p06.ts`)
```ts
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "  Trim me  " }),
});
const task = (await res.json()) as { title: string; priority: string; done: boolean };
console.log(res.status, JSON.stringify(task.title), task.priority, task.done);
```
- **Prediction:** `201 "Trim me" medium false`
- **Actual:** `201 "Trim me" medium false`
- **Mechanism:** Successful POST returns status 201 Created. The server trims the title, assigns default priority `"medium"`, and defaults `done` to `false`.

---

### Snippet 07 (`p07.ts`)
```ts
const url = "http://localhost:3000/api/tasks/3";
const first = await fetch(url, { method: "DELETE" });
const second = await fetch(url, { method: "DELETE" });
console.log(first.status, second.status);
```
- **Prediction:** `204 404`
- **Actual:** `204 404`
- **Mechanism (#7):** **DELETE Idempotency & Status Codes**. First DELETE deletes the task and returns `204 No Content`. The second DELETE fails to find the task and returns `404 Not Found`.

---

### Snippet 08 (`p08.ts`)
```ts
const res = await fetch("http://localhost:3000/api/tasks/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ done: "yes" }),
});
console.log(res.status, await res.text());
```
- **Prediction:** `400 {"error":"done must be true or false"}`
- **Actual:** `400 {"error":"done must be true or false"}`
- **Mechanism:** Server schema validation rejects non-boolean `done` with HTTP 400 Bad Request.

---

### Snippet 09 (`p09.ts`)
```ts
const res = await fetch("http://localhost:3000/api/tasks/1", { method: "PUT" });
console.log(res.status, res.statusText);
```
- **Prediction:** `405 Method Not Allowed`
- **Actual:** `405 Method Not Allowed`
- **Mechanism:** The server specifies allowed methods (GET, PATCH, DELETE) on `/api/tasks/:id`. Any other HTTP verb receives `405 Method Not Allowed`.

---

### Snippet 10 (`p10.ts`)
```ts
const res = await fetch("http://localhost:3000/");
console.log(res.status, res.headers.get("content-type"));
const data: unknown = await res.json();
console.log(data);
```
- **Prediction:** `200 text/html; charset=utf-8` \n Throws `SyntaxError: Unexpected token '<'`
- **Actual:** `200 text/html; charset=utf-8` \n Throws `SyntaxError: Unexpected token '<' in JSON at position 0`
- **Mechanism (#10):** **Content-Type Mismatch**. Calling `.json()` on an HTML page response throws a SyntaxError because HTML begins with `<`. Always verify `content-type` contains `application/json` before parsing JSON.

---

### Snippet 11 (`p11.ts`)
```ts
const u = new URL("https://example.com/search");
u.searchParams.set("q", "tom & jerry");
u.searchParams.set("page", "2");
console.log(u.search);
console.log(new URL("/api/tasks?q=a%20b", "http://localhost:3000").searchParams.get("q"));
```
- **Prediction:** `?q=tom+%26+jerry&page=2` \n `"a b"`
- **Actual:** `?q=tom+%26+jerry&page=2` \n `a b`
- **Mechanism:** `URLSearchParams` handles URL percent-encoding automatically (`&` becomes `%26`, spaces become `+` or `%20`). `.get()` decodes them back to raw values.

---

### Snippet 12 (`p12.ts`)
```ts
console.log("start");
fetch("http://localhost:3000/api/tasks").then(() => console.log("response"));
setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("microtask"));
console.log("end");
```
- **Prediction:** `start` -> `end` -> `microtask` -> `timer` -> `response`
- **Actual:** `start` \n `end` \n `microtask` \n `timer` \n `response`
- **Mechanism (#12):** **Event Loop Scheduling**.
  1. Synchronous code executes first (`start`, `end`).
  2. Microtask queue drains next (`Promise.resolve()`).
  3. Macrotask queue (Timer queue) runs `setTimeout(..., 0)`.
  4. Network I/O completes via OS network callback and queues its handler.

---

### Snippet 13 (`p13.ts`)
```ts
const controller = new AbortController();
controller.abort();
const outcome = await fetch("http://localhost:3000/api/tasks", { signal: controller.signal })
  .then((res) => `status ${res.status}`)
  .catch((err: Error) => err.name);
console.log(outcome);
```
- **Prediction:** `"AbortError"`
- **Actual:** `AbortError`
- **Mechanism:** Aborting before or during fetch causes the Promise to immediately reject with an `AbortError`.

---

### Snippet 14 (`p14.ts`)
```ts
const results = await Promise.all([
  fetch("http://localhost:3000/api/tasks/1"),
  fetch("http://localhost:3000/api/tasks/999"),
]);
console.log(results.map((r) => r.status));
```
- **Prediction:** `[200, 404]`
- **Actual:** `[ 200, 404 ]`
- **Mechanism (#14):** `Promise.all` does not fail on 404 because HTTP 404 is a resolved Promise (`ok: false`, but not rejected).

---

### Snippet 15 (`p15.ts`)
```ts
const results = await Promise.allSettled([
  fetch("http://localhost:3000/api/tasks/1"),
  fetch("http://localhost:3999/api/tasks/1"),
]);
console.log(results.map((r) => r.status));
```
- **Prediction:** `['fulfilled', 'rejected']`
- **Actual:** `[ 'fulfilled', 'rejected' ]`
- **Mechanism (#14 vs #15):** The second fetch fails at network layer (`ECONNREFUSED`), so its Promise rejects. `Promise.allSettled` captures both outcomes safely without failing the whole batch.

---

### Snippet 16 (`p16.ts`)
```ts
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  body: { title: "Object body" } as any,
});
console.log(res.status);
```
- **Prediction (tsc):** Fails without `as any` because `BodyInit` requires string, Blob, FormData, or Buffer.
- **Actual:** `tsc` error TS2322 without cast. With cast, sends `[object Object]` which fails JSON parsing -> `400 Bad Request`.
- **Mechanism (#16):** Passing a raw JS object to `fetch` does not automatically stringify to JSON. You must pass `JSON.stringify(obj)`.

---

### Snippet 17 (`p17.ts`)
```ts
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Hi", priority: "urgent" }),
});
const body = (await res.json()) as { error: string };
console.log(res.status, body.error);
```
- **Prediction:** `400 "priority must be one of: low, medium, high"`
- **Actual:** `400 priority must be one of: low, medium, high`
- **Mechanism:** Server catches invalid literal union values and returns 400 with a detailed error message.

---

### Snippet 18 (`p18.ts`)
```ts
const res = await fetch("http://localhost:3000/api/tasks/1");
const data = await res.json();
console.log(data.nonExistentProperty);
```
- **Prediction:** `tsc` passes without error because `res.json()` returns `Promise<any>`. Runtime prints `undefined`.
- **Actual:** `undefined`
- **Mechanism (#18):** TypeScript's built-in DOM types declare `res.json(): Promise<any>`. This allows any property access without type errors. We must annotate `const data: unknown = await res.json()` and validate with Type Guards.

---

### Snippet 19 (HTML & DOM: `textContent` vs `innerHTML`)
- **Prediction:** `textContent` renders literal text `<strong>Safe</strong>`, preventing XSS attacks. `innerHTML` executes/parses tags as DOM nodes.
- **Mechanism:** Always use `textContent` when displaying user input.

---

### Snippet 20 (Event Bubbling)
- **Prediction:** Clicking an inner button nested inside an `<li>` triggers the button handler first, then bubbles to `li`, then to `ul`.
- **Mechanism (#20):** **Event Bubbling**. Events propagate upward from the target element through all its ancestor elements unless `e.stopPropagation()` is called.

---

### Snippet 21 (Event Delegation: `target` vs `currentTarget`)
- **Prediction:** `e.target` is the specific element clicked (e.g. `<button>`). `e.currentTarget` is the element to which the listener was attached (e.g. `<ul>`).
- **Mechanism:** Event delegation attaches one listener on the parent and uses `e.target` to identify which child was clicked.
