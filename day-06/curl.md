# Day 06 — Task 15.1: `curl` & REST API Interactions (`curl.md`)

## 1. Baseline Verification
- `.gitignore` contains `data/` and `dist/` to ensure server state and compiled JS remain uncommitted.
- Server running at `http://localhost:3000`.

---

## 2. Successful CRUD Endpoints

### 2.1 GET All Tasks (`curl -i`)
```bash
curl -i http://localhost:3000/api/tasks
```
**Output:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Thu, 15 Oct 2026 10:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 382

[
  {
    "id": 1,
    "title": "Read the Day 06 README",
    "done": true,
    "priority": "high",
    "createdAt": "2026-09-27T09:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Call the API with fetch",
    "done": false,
    "priority": "high",
    "createdAt": "2026-09-27T09:05:00.000Z"
  },
  {
    "id": 3,
    "title": "Style the task list with Grid",
    "done": false,
    "priority": "medium",
    "createdAt": "2026-09-27T09:10:00.000Z"
  }
]
```
- **Status Line:** `HTTP/1.1 200 OK` (HTTP protocol version + numeric code 200 + human reason phrase OK).
- **Header 1:** `Content-Type: application/json; charset=utf-8` (specifies MIME media type and UTF-8 encoding).
- **Header 2:** `Content-Length: 382` (exact size of the payload in bytes).

---

### 2.2 GET Single Task
```bash
curl http://localhost:3000/api/tasks/1
```
**Output:**
```json
{
  "id": 1,
  "title": "Read the Day 06 README",
  "done": true,
  "priority": "high",
  "createdAt": "2026-09-27T09:00:00.000Z"
}
```

---

### 2.3 POST Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Study Discriminated Unions","priority":"high"}'
```
**Output (HTTP 201 Created):**
```json
{
  "id": 4,
  "title": "Study Discriminated Unions",
  "done": false,
  "priority": "high",
  "createdAt": "2026-10-15T10:45:15.123Z"
}
```

---

### 2.4 PATCH Update Task
```bash
curl -X PATCH http://localhost:3000/api/tasks/4 \
  -H "Content-Type: application/json" \
  -d '{"done":true,"priority":"medium"}'
```
**Output (HTTP 200 OK):**
```json
{
  "id": 4,
  "title": "Study Discriminated Unions",
  "done": true,
  "priority": "medium",
  "createdAt": "2026-10-15T10:45:15.123Z"
}
```

---

### 2.5 DELETE Remove Task
```bash
curl -i -X DELETE http://localhost:3000/api/tasks/4
```
**Output (HTTP 204 No Content):**
```http
HTTP/1.1 204 No Content
Date: Thu, 15 Oct 2026 10:45:30 GMT
Connection: keep-alive
```

---

## 3. Error Triggering & Responsibility Audit

### 3.1 HTTP 400 — Invalid Body Validation
- **Command:**
  ```bash
  curl -i -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"   ","priority":"low"}'
  ```
- **Response:** `HTTP/1.1 400 Bad Request` | `{"error":"title is required"}`
- **Responsibility:** **Client fault (4xx)**. The client submitted whitespace-only title which violates the shared data contract.

---

### 3.2 HTTP 400 — Malformed JSON
- **Command:**
  ```bash
  curl -i -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{broken:json'
  ```
- **Response:** `HTTP/1.1 400 Bad Request` | `{"error":"Body is not valid JSON"}`
- **Responsibility:** **Client fault (4xx)**. The client sent unparseable syntax in the HTTP body payload.

---

### 3.3 HTTP 404 — Missing Task Record
- **Command:**
  ```bash
  curl -i http://localhost:3000/api/tasks/9999
  ```
- **Response:** `HTTP/1.1 404 Not Found` | `{"error":"No task with id 9999"}`
- **Responsibility:** **Client fault (4xx)**. The client requested a resource identifier that does not exist in the database.

---

### 3.4 HTTP 404 — Unknown API Route
- **Command:**
  ```bash
  curl -i http://localhost:3000/api/users
  ```
- **Response:** `HTTP/1.1 404 Not Found` | `{"error":"No API route for GET /api/users"}`
- **Responsibility:** **Client fault (4xx)**. The client queried an endpoint path not exposed by the routing table.

---

### 3.5 HTTP 405 — Method Not Allowed
- **Command:**
  ```bash
  curl -i -X PUT http://localhost:3000/api/tasks/1
  ```
- **Response:** `HTTP/1.1 405 Method Not Allowed` | `{"error":"PUT is not allowed on /api/tasks/1"}`
- **Responsibility:** **Client fault (4xx)**. The endpoint exists, but the HTTP verb is not supported. The client should use `PATCH` for updates.
