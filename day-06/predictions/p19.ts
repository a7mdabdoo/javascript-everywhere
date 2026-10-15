// p19
type Student = { name: string; score: number };
const s = { name: "Sara", score: 92 } as Student;
const t = { name: "Omar" } as Student;
console.log(s.score, t.score);
