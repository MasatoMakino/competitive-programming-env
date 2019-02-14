import readDevStdIn from "./modules/readDevStdIn";

const input = readDevStdIn();
const tmp = input[1].split(" ").map(val => {
  return parseInt(val);
});
const a = parseInt(input[0]);
const [b, c] = tmp;
const s = input[2];

console.log("%d %s", a + b + c, s);
