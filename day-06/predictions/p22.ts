// p22
const sizes = { S: 1, M: 2 };
type Size = keyof typeof sizes;
const a: Size = "M";
const b: Size = "L";
console.log(a, b);
