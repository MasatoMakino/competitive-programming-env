"use strict";
const issueInfo = require("../issue/IssueInfo");
const testConfig = require("../testConfig");
const fs = require("fs");
const path = require("path");
const makeDir = require("make-dir");
const datefns = require("date-fns");
const cpx = require("cpx");

module.exports = {
  /**
   * 現状のソースファイル、テストケース、出力コードをバックアップする。
   * テンプレートファイルはアーカイブ対象外。
   */
  archive() {
    const info = issueInfo.load();
    let archiveDir = "./archive/";
    archiveDir += info.type + "/";
    if (info.contestID != null && info.contestID != "") {
      archiveDir += info.contestID + "/";
    }
    archiveDir += info.issueID + "/";
    archiveDir += datefns.format(new Date(), "YYYYMMDD_HHmmss") + "/";
    archiveDir = path.resolve(archiveDir);
    makeDir.sync(archiveDir);

    fs.copyFileSync(
      issueInfo.JSON_PATH(),
      archiveDir + "/" + issueInfo.JSON_NAME
    );
    cpx.copySync("./src/**/!(_|template)*.js", archiveDir + "/src/");
    cpx.copySync("./dist/**/*.js", archiveDir + "/dist/");
    cpx.copySync(testConfig.testDir + "**/*", archiveDir + "/test/");
  }
};
