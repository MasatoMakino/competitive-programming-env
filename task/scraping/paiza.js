const puppeteer = require("puppeteer");
const URL = require("url").URL;

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

    this.browser = await puppeteer.launch({
      headless: false
    });
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
    await this.jump(url);

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

  /**
   * 問題画面に遷移する
   * @param {string} url
   */
  async jump(url) {
    const parsedURL = new URL(url);
    const pathName = parsedURL.pathname;
    const type = pathName.split("/").pop();

    //再挑戦タイプのページは単一のリファラで繊維可能。
    console.log("issue type : " + type);
    if (type === "retry") {
      await this.page.goto(url, {
        waitUntil: "domcontentloaded",
        referer: "https://paiza.jp/career/mypage/results"
      });
      return;
    }

    const selector = 'a[href="' + pathName + '"]';

    const ranks = ["d", "c", "b", "a", "s"];
    for (let i = 0; i < ranks.length; i++) {
      const rankURL = "https://paiza.jp/challenges/ranks/" + ranks[i];
      console.log("searching issue form " + rankURL + " ...");
      await this.page.goto(rankURL, {
        waitUntil: "domcontentloaded"
      });

      const linkButtons = await this.page.$$(selector);
      if (linkButtons.length === 0) continue;

      this.page.click(selector);
      await this.page.waitForNavigation({
        waitUntil: "domcontentloaded"
      });
      return;
    }
  }
};
