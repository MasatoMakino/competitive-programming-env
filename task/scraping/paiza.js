const puppeteer = require("puppeteer");

module.exports = class PaizaScraper {
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
      id = id || config.paiza.id;
      pass = pass || config.paiza.pass;
    }

    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();
    await this.page.goto("https://paiza.jp/user_sessions/new_cbox", {
      waitUntil: "networkidle2"
    });

    console.log("logging in...");
    await this.page.type('input[id="user_email"]', id);
    await this.page.type('input[id="user_password"]', pass);
    this.page.click("input.btn_login");
    await this.page.waitForNavigation({
      waitUntil: "domcontentloaded"
    });
    console.log("login");

    return;
  }

  /**
   * 問題ページを取得する。
   * @param {string} url
   */
  async getTest(url) {
    await this.page.goto(url, {
      waitUntil: "networkidle2",
      referer: "https://paiza.jp/career/mypage/results"
    });

    const tests = await this.page.$$eval(
      "div.sample-container pre.sample-content__input > code",
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
