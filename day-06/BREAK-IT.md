# Failure & Edge Case Testing: Task Manager (Break-It Lab)

This document records the 5 critical failure and edge-case scenarios tested against the Task Manager full-stack application as required by Day 06 Step 26.

---

## Test Case 1: XSS (Cross-Site Scripting) Injection

### Test Action
Submit a task with the following malicious payloads in the title input:
```html
<script>alert('XSS Exploit')</script>
<img src="x" onerror="alert('Hacked!')" />
"><svg onload="alert(1)">
```

### Result
- **UI Behavior**: The strings are rendered completely harmlessly as plain text in the browser list.
- **Why it passed**: The client code (`src/client/main.ts`) strictly avoids `innerHTML` and `outerHTML`. All content is created via `document.createElement()` and inserted using `element.textContent = task.title`. The browser's HTML parser treats the tags as literal character data rather than executable script elements.

---

## Test Case 2: Server Down (API Unreachable)

### Test Action
Stop the backend Node.js server (`server.ts`) or enter an invalid port in the client configuration, then try to load tasks or add a new task.

### Result
- **UI Behavior**: 
  - The status container displays an accessible error banner: `"Could not reach server. Is the API running on http://localhost:3000?"`
  - A `"Try again"` retry button appears automatically.
  - The form submission button displays a loading spinner state and gracefully restores itself without corrupting existing local tasks.
- **Why it passed**: Network exceptions (`TypeError: fetch failed` / `Failed to fetch`) are caught in `requestWithRetry` (`src/client/http.ts`) and wrapped into a structured `ApiError` with status `0` and a clear message.

---

## Test Case 3: Flaky Server (`FAIL_RATE=0.5`)

### Test Action
Start the server with an artificial 50% failure rate:
```bash
FAIL_RATE=0.5 npm run api
```
Perform multiple task additions, updates, and deletes from the web interface.

### Result
- **UI Behavior**:
  - The client seamlessly succeeds on almost all operations without the user ever seeing an error dialog.
  - When the first request hits a random 500 error, `requestWithRetry` intercepts it, logs a warning, waits with exponential backoff (`delay = 200 * 2^attempt`), and retries up to 3 times.
  - If all 3 attempts fail, only then does the UI inform the user and provide a manual retry action.
- **Verification**: Browser DevTools network panel shows the failed `500 Internal Server Error` followed 200ms later by a successful `200 OK`.

---

## Test Case 4: Invalid Payload & 400 Bad Request

### Test Action
Send invalid data directly via `curl` and through manipulated client form fields:
1. Empty title: `POST /api/tasks` with `{"title": "   ", "priority": "medium"}`
2. Excessive length: Title longer than 120 characters.
3. Invalid priority: `{"title": "Valid title", "priority": "urgent"}`
4. Invalid JSON syntax: Malformed body `{title: "missing quotes"}`

### Result
- **Server Behavior**:
  - Empty title: HTTP `400 Bad Request` with `{"error": "title is required"}`.
  - Title > 120 chars: HTTP `400 Bad Request` with `{"error": "title must be under 120 characters"}`.
  - Bad priority: HTTP `400 Bad Request` with `{"error": "priority must be one of: low, medium, high"}`.
  - Syntax error: HTTP `400 Bad Request` with `{"error": "Body is not valid JSON"}`.
- **Client Behavior**:
  - The error message returned by the server is extracted from the JSON response and rendered in the red `#form-error` `<p role="alert">` directly under the form. The form does not submit and does not crash.

---

## Test Case 5: Network Disconnection (Offline Handling)

### Test Action
Disconnect the computer from Wi-Fi / set Network Throttling to "Offline" in Chrome DevTools Network tab, then interact with the app.

### Result
- **UI Behavior**:
  - Event listeners on `window.addEventListener("offline", ...)` immediately trigger a banner: `"You are currently offline. Changes will not sync."`
  - When connection is re-established, `window.addEventListener("online", ...)` clears the banner and automatically re-syncs the task list from the server.
  - Any button clicks while offline are stopped with an instant notification rather than waiting for a long browser timeout.
