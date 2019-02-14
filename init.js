"use strict";
const makeDir = require("make-dir");
const fs = require("fs");
const rimraf = require("rimraf");
const testConfig = require("./task/testConfig");

const option = process.argv[2] | 1;

const initWithNumber = opt => {
  const num = parseInt(opt);
  if (isNaN(num)) {
    return;
  }

  //テンプレート上書き

  //既存のテストケース削除
  rimraf.sync(testConfig.testDir);

  //空のテストケース作成
  makeDir.sync(testConfig.testDir);
  for (let i = 0; i < num; i++) {
    const padNum = i.toString().padStart(4, "0");
    fs.writeFileSync(
      testConfig.testDir + testConfig.inName + padNum + ".txt",
      ""
    );
    fs.writeFileSync(
      testConfig.testDir + testConfig.outName + padNum + ".txt",
      ""
    );
  }
};

const initWithURL = opt => {
  if (opt == null) {
    return;
  }
  const num = parseInt(opt);
  if (!isNaN(num)) {
    return;
  }
};

initWithNumber(option);
initWithURL(option);
