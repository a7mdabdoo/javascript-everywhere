// p21
type Student = { name: string; score: number };
const update: Partial<Student> = { score: 80 };
const full: Required<Partial<Student>> = { score: 80 };
console.log(update, full);
