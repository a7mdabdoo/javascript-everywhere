// p10
interface Student { readonly id: number; tags: string[] }
const s: Student = { id: 1, tags: [] };
s.tags.push("ts");
console.log(s);
