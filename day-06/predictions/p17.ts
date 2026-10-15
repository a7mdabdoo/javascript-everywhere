// p17
async function getScore(): Promise<number> { return 92; }
const score = await getScore();
console.log(score.toFixed(1));
