const paiza = require("./paiza");

async function test() {
  let paizaLoader = new paiza();
  await paizaLoader.login();
  const tests = await paizaLoader.getTest(
    "https://paiza.jp/career/challenges/293/retry"
  );
}
//test();

async function jumpto() {
  let paizaLoader = new paiza();
  await paizaLoader.login();
  const tests = await paizaLoader.getTest(
    "https://paiza.jp/career/challenges/293/retry"
  );
}
