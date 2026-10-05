// Day 05 — Task 6.4: ES Module with Named and Default Exports

// Named exports:
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export function power(base, exp) {
  return Math.pow(base, exp);
}

// Default export:
export default function calculator(operation, a, b) {
  switch (operation) {
    case "add":
      return add(a, b);
    case "multiply":
      return multiply(a, b);
    case "power":
      return power(a, b);
    default:
      return null;
  }
}
