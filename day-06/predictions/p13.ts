// p13
function label(x: string | number) {
  if (typeof x === "string") return x.toUpperCase();
  return x.toFixed(1);
}
console.log(label("a"), label(2));
