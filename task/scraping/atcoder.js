const puppeteer = require("puppeteer");

module.exports = class AtCoderScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  /**
   * ログインする
   * @param {string} [id]
   * @param {string} [pass]
   */
  async login(id, pass) {
    if (id == null || pass == null) {
      const config = require("../../cret.json");
      id = id || config.atcoder.id;
      pass = pass || config.atcoder.pass;
    }

    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await this.page.goto("https://atcoder.jp/login", {
      waitUntil: "networkidle2"
    });

    const isLogin = await this.page.evaluate(() => {
      const node = document.querySelectorAll(
        '[href="javascript:form_logout.submit()"]'
      );
      return node.length ? true : false;
    });

    if (!isLogin) {
      await this.page.type('input[id="username"]', id);
      await this.page.type('input[id="password"]', pass);
      //clickナビゲーションはawaitしない。
      this.page.click("#submit");
      await this.page.waitForNavigation({
        waitUntil: "domcontentloaded"
      });
    }
    console.log("login!");

    return;
  }

  /**
   * 問題ページを取得する。
   * @param {string} url
   */
  async getTest(url) {
    await this.page.goto(url, {
      waitUntil: "networkidle2"
    });

    const tests = await this.page.$$eval(
      ":scope span.lang-ja div.div-btn-copy + pre",
      list => {
        return list.map(data => {
          return data.textContent;
        });
      }
    );

    console.log(tests);
    return tests;
  }
};
