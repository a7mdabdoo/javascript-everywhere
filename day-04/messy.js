// 4.1 Build the messy array

const messyStudents = [
    { name: "Ahmed", scores: [95, 90], attendance: 92 },                          // missing address
    { name: "Sara", address: { street: "Nile St" }, scores: [88], attendance: 85 }, // address without city
    { name: "Omar", address: { city: "Cairo" }, scores: [], attendance: 75 },       // empty scores array
    { name: "Mona", scores: [70, 80], attendance: 0 },                            // missing address + attendance is 0
    { name: "Ali", address: { city: "Qena" }, scores: [92], greeting() { return "Hello from Ali"; } }
];


// 4.2 Read it without crashing

for (const s of messyStudents) {
    const city = s.address?.city ?? "Unknown";
    const firstScore = s.scores?.[0] ?? "No scores yet";
    const attWithNullish = s.attendance ?? "Not recorded";
    const attWithOr = s.attendance || "Not recorded"; // Bug for Mona (0 becomes "Not recorded")

    console.log(`${s.name} -> City: ${city} | First Score: ${firstScore} | Attendance (??): ${attWithNullish} | Attendance (||): ${attWithOr}`);
}

// Using || got the attendance-0 student wrong because 0 is falsy in JavaScript, while ?? only falls back on null or undefined.


// 4.3 Wrap it in functions

function getCity(student) {
    return student?.address?.city ?? "Unknown";
}

function safeFirstScore(student) {
    return student?.scores?.[0] ?? null;
}

console.log("getCity(messyStudents[0]):", getCity(messyStudents[0]));
console.log("getCity(messyStudents[2]):", getCity(messyStudents[2]));
console.log("safeFirstScore(messyStudents[2]):", safeFirstScore(messyStudents[2]));
console.log("safeFirstScore(messyStudents[0]):", safeFirstScore(messyStudents[0]));

// Optional method call ?.() — does not crash when method is missing
console.log("Optional call on Ahmed (no method):", messyStudents[0].greeting?.());
console.log("Optional call on Ali (has method):", messyStudents[4].greeting?.());
