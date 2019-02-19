"use strict";
const makeDir = require("make-dir");
const fs = require("fs");
const rimraf = require("rimraf");
const testConfig = require("./task/testConfig");
const IssueInfo = require("./task/issue/IssueInfo");
const getScraper = require("./task/scraping/getScraper");
const archiver = require("./task/archive/IssueArchiver");
const colors = require("colors");

let option = process.argv[2] || 1;

const initWithNumber = opt => {
  const num = parseInt(opt);
  if (isNaN(num)) {
    return;
  }
  console.log("init empty test case ...");

  //バックアップを作成。
  archiver.archive();

  const info = IssueInfo.get();
  IssueInfo.save(info);
  overrideIndex();
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

  const info = IssueInfo.get(opt);
  const scraper = getScraper(info);
  await scraper.login();
  const tests = await scraper.getTest(opt);
  scraper.browser.close();

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

  //テスト読み込みに成功したらバックアップを作成。
  archiver.archive();

  //上書き処理
  overrideIndex();
  IssueInfo.save(info);
  writeTests(tests);

  console.log(("Complete : init Test case form " + opt).bold.green);
  return;
}

/**
 * index.jsファイルを上書きする
 */
const overrideIndex = () => {};

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
