require("dotenv").config();
const config = require("./config");
const { init, getToken } = require("td-ameritrade-auth");
const StockAutomate = require("./stockAutomate");
let [
  nodePath,
  scriptPath,
  argv_username,
  argv_password,
  argv_columnno
] = process.argv;
let choice;

let username = process.env.TWITTER_USERNAME || argv_username;
let password = process.env.TWITTER_PASSWORD || argv_password;
let columno = process.env.TWITTERDECK_COLUMN_NO || argv_columnno;
let amt_redirect_url = process.env.AMT_REDIRECT_URL;
let amt_consumer_key = process.env.AMT_CONSUMER_KEY;
let amt_username = process.env.AMT_USERNAME;
let amt_password = process.env.AMT_PASSWORD;

(async () => {
  let stockAutomate = new StockAutomate({ username, password, columno });
  try {
    let dayEndJob = stockAutomate.setDayEndInterval();
    await stockAutomate.setDriver();
    await stockAutomate.authenticate_twitterdeck();
    setInterval(() => {
      stockAutomate.getLatestStock().then(stock => {
        if (stockAutomate.alertKeyExist(stock)) {
          let match = stockAutomate.getStockFromString(stock);
          if (!!match) stock = match[0];
          stock = stockAutomate.removeDollorSign(stock);
          if (!stockAutomate.ifTodaysStock(stock)) {
            stockAutomate.addStocktoDayStack(stock);
            stockAutomate
              .getLatestMarketPrice(amt_consumer_key, stock)
              .then(response => {
                let mark = response;
                let quantity = mark / 4000;
                stockAutomate.buyStock({
                  stock,
                  amt_username,
                  quantity,
                  amt_consumer_key,
                  price: 1
                });
              });
          }
        }
      });
    }, 2000);
  } catch (e) {
    console.log(e);
    stockAutomate.closeDriver();
    process.exit();
  }
})();
