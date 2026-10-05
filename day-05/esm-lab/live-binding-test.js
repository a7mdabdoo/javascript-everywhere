// Day 05 — Task 6.5: Live Bindings Test
import { count, inc } from "../p15/counter.mjs";

console.log("Initial count imported from counter.mjs:", count);
inc();
inc();
console.log("Count after inc() called twice (Live binding updated in consumer):", count);
