const name = "Ahmed Mohamed Abdo";
const city = "Qena";
const reason = "to learn JavaScript & TypeScript and build full-stack apps";

function getProfile(name, city, reason) {
  return `My name is ${name}, I live in ${city}, and I joined this journey ${reason}.`;
}

console.log(getProfile(name, city, reason));
console.log("Node version:", process.version);
