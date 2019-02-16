/**
 * テストディレクトリ内にある全てのテストを実行し、結果を出力する。
 */

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
let failsCount = 0;
let errorCount = 0;

inFiles.forEach((val, index) => {
  let resultObj;
  try {
    resultObj = execSync("cat " + val + " | node dist/index.js");
  } catch (error) {
    errorCount++;
    console.log(("ERROR  : " + path.basename(val)).bold.red);
    console.log();
    // console.log(error.toString().red);
    return;
  }

  const result = resultObj.toString();
  const out = fs.readFileSync(outFiles[index], { encoding: "utf-8" });
  const isPass = result === out;
  if (isPass) {
    passCount++;
  } else {
    failsCount++;
  }

  if (isPass) {
    console.log(("PASSED : " + path.basename(val)).green);
  } else {
    console.log(("FAILS  : " + path.basename(val)).bold.magenta);
    console.log("Result : ".bold.magenta);
    console.log(result.magenta);
    console.log("Expectation : ".bold.magenta);
    console.log(out.magenta);
  }
});

const failsCountString = failsCount.toString();
const styledFailsCount =
  failsCount === 0 ? failsCountString.gray : failsCountString.red;

console.log(
  "TOTAL : ",
  inFiles.length.toString().green,
  " PASSED : ",
  passCount.toString().green,
  " FAILS : ",
  styledFailsCount,
  " ERROR : ",
  errorCount.toString().red
);

if (failsCount === 0 && inFiles.length === passCount) {
  console.log("Passing all exam".bold.green);
} else {
  console.log("Fails an exam".bold.magenta);
}
