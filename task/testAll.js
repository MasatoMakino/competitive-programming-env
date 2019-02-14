"use strict";
const fs = require("fs");
const execSync = require("child_process").execSync;
const path = require("path");
const glob = require("glob");
const colors = require("colors");
const testConfig = require("./testConfig");

const testDir = path.resolve(testConfig.testDir);
const inFiles = glob.sync(testDir + "/" + testConfig.inName + "*.txt");
const outFiles = glob.sync(testDir + "/" + testConfig.outName + "*.txt");

if (inFiles.length === 0) {
  console.log("ERROR : Test case files not found.".magenta);
  return;
}

let passCount = 0;
let errorCount = 0;

inFiles.forEach((val, index) => {
  const result = execSync("cat " + val + " | node dist/index.js").toString();
  const out = fs.readFileSync(outFiles[index], { encoding: "utf-8" });
  const isPass = result === out;
  if (isPass) {
    passCount++;
  } else {
    errorCount++;
  }

  if (isPass) {
    console.log(("PASSED : " + path.basename(val)).green);
  } else {
    console.log(("ERROR  : " + path.basename(val)).bold.magenta);
    console.log("Result : ".bold.magenta);
    console.log(result.magenta);
    console.log("Expectation : ".bold.magenta);
    console.log(out.magenta);
  }
});

const errorCountString = errorCount.toString();
const styledErrorCount =
  errorCount === 0 ? errorCountString.gray : errorCountString.red;

console.log(
  "TOTAL : ",
  inFiles.length.toString().green,
  " PASSED : ",
  passCount.toString().green,
  " ERROR : ",
  styledErrorCount
);

if (errorCount === 0) {
  console.log("Passing all exam".bold.green);
} else {
  console.log("Fails an exam".bold.magenta);
}
