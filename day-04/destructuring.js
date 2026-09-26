// 2.1

const student = { name: "Sara", score: 92, city: "Cairo" };
const { name, score } = student;
const { city: hometown } = student;
const { attendance = 0 } = student;
const { level: tier = "beginner" } = student;

console.log(name);
console.log(score);
console.log(hometown);
console.log(attendance);
console.log(tier);

// 2.2

const developer = {
  profile: {
    email: "ahmed@mohamed-abdo.com",
    github: "github.com/a7mdabdoo",
  },
};

const {
  profile: { email, github },
} = developer;

console.log(email);
console.log(github);

//console.log(profile);
// why profile is not defined? because we use profile as a key to destructure the object, so it is not available in the outer scope.

const {
  profile,
  profile: { email: email2 },
} = developer;

console.log(profile);
console.log(email2);

// 2.3 Arrays Destructuring

const five = ["first", "second", "third", "fourth", "fifth"];

const [first, second] = five;
console.log(first);
console.log(second);


const [, , , fourth] = five;
console.log(fourth);


const [, , , , , sixth = "sixth"] = five;
console.log(sixth);


var a=10; var b=20;
[a, b] = [b, a];
console.log(a); // 10 -> 20
console.log(b); // 20 -> 10



const [head ,...tail] = five;
console.log(head);
console.log(tail);



// 2.4  Parameters Destructuring



function describe({ name, score, city = "Unknown" }) {
    return `Srudent ${name} scored ${score} in ${city}`;
}  
console.log(describe({ name: "Ahmed", score: 95, city: "Qena" }));
console.log(describe({ name: "Sara", score: 88 }));
 





function summarise({ name = "Student", score = 0, passMark = 60 } = {}) {
    const passStatus = score >= passMark? "passed" : "failed";
    return `${name} scored ${score} -> ${passStatus}`;
}



console.log(summarise( { name: "Ahmed", score: 95, passMark: 60 }));
console.log(summarise({ name: "Omar" }));                          
console.log(summarise());                                           
// Without = {}, calling summarise() throws TypeError: Cannot destructure property 'name' of 'undefined'




const studentsList = [
    { name: "Ahmed", score: 95 },
    { name: "Sara", score: 85 },
    { name: "Omar", score: 72 },
    { name: "Mona", score: 64 }
];

for (const { name, score } of studentsList) {
    console.log(`${name} scored ${score}`);
}
const gradeTally ={
    A: 2,
    b: 1,
    c:1,
    d:1,
    f:0
};
for (const [grade, count] of Object.entries(gradeTally)) {
    console.log(`Grade ${grade} has ${count} students`);
}