// p15
function longest<T extends { length: number }>(a: T, b: T): T { return a.length >= b.length ? a : b; }
console.log(longest("abc", "de"), longest([1], [1, 2]));
console.log(longest(10, 20));
