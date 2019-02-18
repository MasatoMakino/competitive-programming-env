"use strict";
const issueInfo = require("../issue/IssueInfo");
const testConfig = require("../testConfig");
const fs = require("fs");
const path = require("path");
const makeDir = require("make-dir");
const datefns = require("date-fns");
const cpx = require("cpx");
const rimraf = require("rimraf");

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
  },
  /**
   * 指定されたアーカイブディレクトリからファイルを復元する。
   * @param {string} dirPath
   *   ディレクトリパス。
   *   タイムスタンプ付きのディレクトリを指定すると、そのディレクトリのファイルを復元する。
   *   issueフォルダを指定すると、そのディレクトリ内の最新のアーカイブを復元する。
   * @param {*} isDryRun
   */
  rollback(dirPath, isDryRun) {
    if (isDryRun === undefined) isDryRun = false;

    if (dirPath == null || dirPath == "") {
      console.log("復元対象を指定してください。");
      return;
    }

    const archiveDir = this.getArchiveDir(dirPath);
    if (archiveDir == null) {
      return;
    }
    console.log("restore from " + archiveDir);
    if (isDryRun) {
      return;
    }

    fs.copyFileSync(
      path.resolve(archiveDir, issueInfo.JSON_NAME),
      issueInfo.JSON_PATH()
    );
    fs.copyFileSync(
      path.resolve(archiveDir, "src", "index.js"),
      "./src/index.js"
    );

    //既存のテストケース削除
    rimraf.sync(testConfig.testDir);
    rimraf.sync("./dist");
    cpx.copySync(path.resolve(archiveDir, "dist") + "/**/*", "./dist/");
    cpx.copySync(
      path.resolve(archiveDir, "test") + "/**/*",
      testConfig.testDir
    );
  },
  /**
   * 指定されたディレクトリにissue_infoが存在するか確認する
   * @param {string}} dirPath
   */
  getArchiveDir(dirPath) {
    const resolvedPath = path.resolve(dirPath);

    console.log(resolvedPath);
    if (!fs.existsSync(resolvedPath)) {
      console.log("指定されたディレクトリが存在しません。".red);
      return;
    }

    if (this.hasIssueJson(dirPath)) {
      return resolvedPath;
    }

    const list = fs
      .readdirSync(resolvedPath)
      .sort()
      .reverse()
      .filter(val => {
        return /^[0-9_]*$/.test(val);
      });
    const listHead = path.resolve(dirPath, list[0]);
    if (this.hasIssueJson(listHead)) {
      return listHead;
    }

    console.log(
      "ディレクトリ内にアーカイブフィイルを発見できませんでした。".red
    );
    return;
  },

  /**
   * 指定されたディレクトリに課題情報が存在するか確認する。
   * @param {string} dir
   */
  hasIssueJson(dir) {
    const archivedJsonPath = path.resolve(dir, issueInfo.JSON_NAME);
    return fs.existsSync(archivedJsonPath);
  }
};
