# Day 06 — Notes: TypeScript, Fetch, REST APIs & Semantic Web

**Student:** Ahmed Mohamed Abdo  
**Track:** JavaScript Everywhere (SVNU / Eng. Mostafa Saqly)  

---

## Part 1: TypeScript Fundamentals & Type Safety

### 1. Why TypeScript?
JavaScript is dynamically typed. Type errors (like typos in property names, passing `undefined` into math operations, or calling non-existent methods) only blow up when the code runs in production.
TypeScript acts as a static analysis layer over JavaScript:
- It checks types at compile time before running code.
- It catches bugs in the editor as you write.
- Types are completely stripped out at runtime — leaving pure, clean JavaScript with zero runtime overhead.

### 2. `any` vs `unknown`
- `any`: Completely disables the type checker. TypeScript lets you do anything (call it, access properties, assign to numbers) without warnings. It leaks and defeats the whole purpose of TypeScript.
- `unknown`: Type-safe alternative for values where the type is truly unknown upfront (like `JSON.parse` or API responses). TypeScript will not let you do anything with an `unknown` value until you narrow its type first using `typeof`, `instanceof`, or custom type guards.

### 3. Type Aliases vs Interfaces
- `interface`: Best for defining the shape of objects, classes, and extensible contracts. Supports declaration merging (`interface User { ... }`).
- `type`: Can represent primitives, unions (`"low" | "medium" | "high"`), tuples, functions, intersections, and mapped types.
- Best practice: Use `interface` for data models and object structures; use `type` for unions, primitives, and function signatures.

### 4. Type Narrowing & Discriminated Unions
- **Type Narrowing**: TypeScript analyzes JavaScript control flow (`if (typeof x === "string")`, `if ("key" in obj)`) to automatically narrow broad types into specific types inside code blocks.
- **Discriminated Unions**: Creating a union of object types where every member shares a common literal property (a discriminant tag, e.g. `kind: "loading" | "success" | "error"`). Inside a `switch (state.kind)`, TypeScript knows the exact properties available on each branch with 100% certainty.

### 5. Generics (`<T>`)
Generics allow functions, classes, and interfaces to work with any type while preserving exact type information rather than falling back to `any`.
- Example: `function wrap<T>(value: T): Box<T>` preserves the exact type passed in.
- Constraints (`<T extends { id: number }>`): Ensures the generic type satisfies certain minimal requirements.

### 6. Built-in Utility Types
TypeScript provides powerful built-in type transformers:
- `Partial<T>`: Makes all properties in `T` optional (ideal for PATCH request bodies).
- `Required<T>`: Makes all properties required.
- `Pick<T, Keys>`: Constructs a type by picking a subset of keys from `T`.
- `Omit<T, Keys>`: Constructs a type by omitting keys from `T`.
- `Record<K, V>`: Creates an object type with keys `K` and values `V`.
- `Readonly<T>`: Prevents any mutations to properties.

---

## Part 2: Fetch API & REST Architecture

### 1. The Anatomy of an HTTP Request
An HTTP request consists of:
- **Method (Verb)**: `GET` (read), `POST` (create), `PATCH` (partial update), `PUT` (full replace), `DELETE` (remove).
- **Path & Query**: e.g., `/api/tasks?filter=active`.
- **Headers**: Metadata such as `Content-Type: application/json` or `Accept`.
- **Body**: Data payload sent to the server (for POST, PATCH, PUT).

### 2. The `fetch()` Gotcha: `res.ok`
`fetch()` only rejects its Promise on actual **network failures** (like no internet connection, DNS failure, or server offline).
If the server returns `404 Not Found` or `500 Internal Server Error`, `fetch()` still resolves successfully!
Always check `res.ok` (status 200–299):
```typescript
const res = await fetch("/api/tasks");
if (!res.ok) {
  const errorBody = await res.json().catch(() => null);
  throw new Error(errorBody?.error ?? `HTTP ${res.status}`);
}
return await res.json();
```

### 3. Handling `204 No Content`
A successful `DELETE` request often returns HTTP `204 No Content` with an empty response body. Calling `await res.json()` on a 204 response throws a `SyntaxError: Unexpected end of JSON input`.
Always check status before parsing:
```typescript
if (res.status === 204) return;
```

### 4. Resilience & Retry Pattern
Networks are inherently unreliable. For transient errors (server 5xx errors or network blips):
- Implement retry logic with exponential backoff: `delay = initialDelay * (2 ** attempt)`.
- Never retry on 4xx client errors (like `400 Bad Request` or `404 Not Found`), because repeating an invalid request will always produce the same error.

---

## Part 3: Semantic Web, Layout & Security

### 1. Semantic HTML & Accessibility
- Use semantic landmarks: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<form>`.
- Always pair form controls with `<label for="id">`.
- Use ARIA attributes thoughtfully:
  - `role="alert"` for real-time validation error notices.
  - `aria-live="polite"` for asynchronous status updates.
  - `aria-pressed="true|false"` for filter toggle buttons.

### 2. Modern CSS: Grid vs Flexbox
- **Flexbox**: Best for one-dimensional layouts (a row of buttons, a toolbar, or an aligned list item).
- **CSS Grid**: Best for two-dimensional layouts (a sidebar + main content panel, responsive card grids) where items align across both rows and columns.
- Use CSS custom properties (`--var`) for theme colors and spacing to support dark mode via `@media (prefers-color-scheme: dark)`.

### 3. DOM Security & XSS Prevention
- Never inject untrusted user input using `.innerHTML`. Malicious script tags or `<img onerror=...>` handlers can steal cookies or tokens.
- Always use `document.createElement()` and assign content via `element.textContent`, which automatically escapes special characters into harmless text.
