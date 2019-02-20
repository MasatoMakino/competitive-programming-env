"use strict";
const puppeteer = require("puppeteer");
/**
 * 各サイトのスクレイピング処理で、共通化可能な処理をまとめるモジュール。
 */
module.exports = {
  /**
   * ブラウザを起動する。
   */
  async getBrowser() {
    return await puppeteer.launch({
      args: ["--proxy-server='direct://'", "--proxy-bypass-list=*"]
    });
  },

  /**
   * タブを起動する。
   * この関数で取得されたタブは画像、CSS、Webフォントのダウンロードを行わない。
   * @param {Browser} browser
   */
  async getPage(browser) {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", request => {
      if (
        ["image", "stylesheet", "font"].indexOf(request.resourceType()) !== -1
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
    return page;
  }
};
