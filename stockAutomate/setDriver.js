const chrome = require("selenium-webdriver/chrome");
module.exports = async (path)=>{
    if (!(!!this.#driver) && (!!path)) {
      this.#driver = await new Builder().forBrowser("chrome").build();
    }
  }