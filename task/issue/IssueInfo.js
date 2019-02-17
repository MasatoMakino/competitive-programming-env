"use strict";
const URL = require("url").URL;
const makeDir = require("make-dir");
const fs = require("fs");
const colors = require("colors");
const IssueTypes = require("./IssueTypes");

/**
 * 課題の情報を保存、読み込みを行うモジュールです。
 * どのコンテストのどの課題を実行中かを記録します。
 */
module.exports = {
  /**
   * urlから課題情報を保存したjsonオブジェクトを生成する。
   * @param {string} url
   */
  get(url) {
    const parsed = new URL(url);

    //タイプ判定
    let type = "";
    if (/atcoder\.jp/.test(parsed.host)) {
      type = IssueTypes.AT_CODER;
    } else if (/paiza\.jp/.test(parsed.host)) {
      type = IssueTypes.PAIZA;
    }

    //課題判定
    const pathName = parsed.pathname;
    let issue = "";
    switch (type) {
      case IssueTypes.AT_CODER:
        issue = pathName.split("/").pop();
        break;
      case IssueTypes.PAIZA:
        issue = pathName.split("/").slice(-2)[0];
        break;
    }

    //コンテストID
    let contestID = "";
    switch (type) {
      case IssueTypes.AT_CODER:
        contestID = parsed.host.split(".")[0];
        if (contestID === "atcoder") {
          contestID = pathName.split("/")[2];
        }
        break;
    }

    return {
      type: type,
      url: url,
      issueID: issue,
      contestID: contestID,
      initDate: new Date()
    };
  },
  /**
   * JSONオブジェクトをファイルに保存する。
   * @param {JSON} info
   */
  save(info) {},
  /**
   * ファイルからjsonオブジェクトを復元する。
   * @param {string} path
   */
  load(path) {}
};
