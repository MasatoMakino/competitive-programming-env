"use strict";
const makeDir = require("make-dir");
const fs = require("fs");
const rimraf = require("rimraf");
const testConfig = require("./task/testConfig");
const AtCoderModule = require("./task/scraping/atcoder");
const colors = require("colors");

let option = process.argv[2] || 1;

const initWithNumber = opt => {
  const num = parseInt(opt);
  if (isNaN(num)) {
    console.log("NaN");
    return;
  }
  //テンプレート上書き

  const tests = new Array(num * 2).fill("");
  writeTests(tests);
};

async function initWithURL(opt) {
  if (opt == null) {
    return;
  }
  const num = parseInt(opt);
  if (!isNaN(num)) {
    return;
  }

  const atCoder = new AtCoderModule();
  await atCoder.login();
  const tests = await atCoder.getTest(opt);
  atCoder.browser.close();

  if (tests.length === 0) {
    console.log("テストケースの取得に失敗しました。".bold.red);
    return;
  }
  if (tests.length % 2 !== 0) {
    console.log(
      "取得されたテストの入出力数が合致していません。取得に失敗した可能性があります。"
        .bold.red
    );
  }

  writeTests(tests);
  return;
}

/**
 * 配列分のテストをファイル書き込み
 * @param {Array}} tests in,outの順で並んだテストケースの配列。
 */
const writeTests = tests => {
  //既存のテストケース削除
  rimraf.sync(testConfig.testDir);
  //テストケース作成
  makeDir.sync(testConfig.testDir);
  const n = tests.length / 2;
  for (let i = 0; i < n; i++) {
    const padNum = i.toString().padStart(4, "0");
    fs.writeFileSync(
      testConfig.testDir + testConfig.inName + padNum + ".txt",
      tests[i * 2]
    );
    fs.writeFileSync(
      testConfig.testDir + testConfig.outName + padNum + ".txt",
      tests[i * 2 + 1]
    );
  }
};

initWithNumber(option);
initWithURL(option);
