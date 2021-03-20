require("dotenv").config();
const readline = require("readline");
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
const consoleIO = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

consoleIO.question("Type the number:\n1:AMT AUTH\n2:SCRAP TWEETS", function(
  user_choice
) {
  choice = user_choice;
});

let username = process.env.TWITTER_USERNAME || argv_username;
let password = process.env.TWITTER_PASSWORD || argv_password;
let columno = process.env.TWITTERDECK_COLUMN_NO || argv_columnno;
let amt_redirect_url = process.env.AMT_REDIRECT_URL;
let amt_consumer_key = process.env.AMT_CONSUMER_KEY;
let amt_username = process.env.AMT_USERNAME;
let amt_password = process.env.AMT_PASSWORD;
if (choice === "1") {
  init(amt_consumer_key)
    .then(() => console.log("done"))
    .catch(e => console.log(e.message));
} else {
  (async () => {
    let stockAutomate = new StockAutomate({ username, password, columno });
    try {
      let dayEndJob = stockAutomate.setDayEndInterval();
      stockAutomate.setDriver();
      await stockAutomate.authenticate_twitterdeck();
      setInterval(() => {
        stockAutomate.getLatestStock().then(stock => {
          if (stockAutomate.alertKeyExist(stock)) {
            let match = stockAutomate.getStockFromString(stock);
            if (!!match) stock = match[0];
            stock = stockAutomate.removeDollorSign(stock);
            if (!stockAutomate.ifTodaysStock(stock)) {
              stockAutomate
                .getLatestMarketPrice(amt_consumer_key, stock)
                .then(response => {
                  console.log(response);
                });
            } else {
              stockAutomate.addStocktoDayStack(stock);
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
}
