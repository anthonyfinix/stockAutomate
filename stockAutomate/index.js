const axios = require("./axios");
const { init, getToken } = require("td-ameritrade-auth");
const { Builder, By, Key, until } = require("selenium-webdriver");
class StockAutomate {
  #links = { ...require("./links") };
  #twitter_username;
  #twitter_password;
  #twitterdeck_columno;
  #twitter_email;
  #driver;
  #app_column;
  #stocks = [];
  dayEndMillisecond = this.getDayEndMillisecond();
  constructor({ username, password, columno, email }) {
    if (!username) throw new Error("username not provided");
    if (!password) throw new Error("password not provided");
    if (!columno) throw new Error("column number not provided");
    this.#twitter_username = username;
    this.#twitter_password = password;
    this.#twitterdeck_columno = columno;
    if (email) this.#twitter_email = email;
  }
  ifTodaysStock(latestStock) {
    let isTodaysStock = false;
    for (let i = 0; i < this.#stocks.length; i++) {
      if ((latestStock = this.#stocks[i])) {
        isTodaysStock = true;
        break;
      }
    }
    return isTodaysStock;
  }
  getDayEndMillisecond() {
    return new Date().getHours() * (60000 * 60) + new Date().getHours() * 60;
  }
  setDayEndInterval() {
    return setInterval(() => {
      this.#stocks = [];
    }, this.dayEndMillisecond);
  }
  async setDriver() {
    this.#driver = await new Builder().forBrowser("chrome").build();
  }
  async authenticate_twitterdeck() {
    this.#driver.get(this.#links.url);
    console.log("visited links");
    await this.#driver.wait(
      until.elementLocated(By.xpath(this.#links.usernameTextbox)),
      3000
    );
    await this.#driver
      .findElement(By.xpath(this.#links.usernameTextbox))
      .sendKeys(`@${this.#twitter_username}`, Key.RETURN);
    await this.#driver
      .findElement(By.xpath(this.#links.passwordTextbox))
      .sendKeys(this.#twitter_password, Key.RETURN);
    if (await this.checkMultipleRetryError()) {
      console.log("multiple login detected");
      await this.#driver
        .findElement(By.xpath(this.#links.usernameTextbox))
        .sendKeys(this.#twitter_email, Key.RETURN);
      await this.#driver
        .findElement(By.xpath(this.#links.passwordTextbox))
        .sendKeys(this.#twitter_password, Key.RETURN);
    }
    await this.#driver.wait(
      until.elementLocated(By.css("#container > div")),
      10000
    );
    this.#app_column = await this.#driver.findElement(By.css(".app-columns"));
  }
  async checkMultipleRetryError() {
    try {
      await this.#driver
        .findElement(By.xpath(this.#links.retryError))
        .getText();
      return true;
    } catch (e) {
      return false;
    }
  }
  async getLatestStock() {
    try {
      return await this.#app_column
        .findElement(
          By.css(this.#links.columnCssSelectPath(this.#twitterdeck_columno))
        )
        .getText();
    } catch (e) {
      throw e;
    }
  }
  removeDollorSign(stock) {
    return stock.replace("$", "");
  }
  alertKeyExist(string) {
    if (string.includes("ALERT:")) {
      return true;
    } else {
      return false;
    }
  }
  getStockFromString(string) {
    return string.match(/\$[A-Za-z0-9]+/);
  }
  addStocktoDayStack(stock) {
    this.#stocks.push(stock);
    console.log(this.#stocks);
    console.log("***********");
  }
  async getLatestMarketPrice(symbol) {
    let token = await getToken("MI8JHBAXAQKBLX6TVVANMQJIXZCNPIMF");
    return axios.get(`/marketdata/${symbol}/quotes`, {
      params: {
        apikey: "MI8JHBAXAQKBLX6TVVANMQJIXZCNPIMF"
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  closeDriver() {
    this.#driver.quit();
  }
}
module.exports = StockAutomate;
