// p14
function first<T>(items: T[]): T { return items[0]; }
const n = first([1, 2, 3]);
const s = first(["a"]);
console.log(n + 1, s + 1);
