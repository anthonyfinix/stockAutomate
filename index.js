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

init("MI8JHBAXAQKBLX6TVVANMQJIXZCNPIMF")
  .then(() => console.log("done!"))
  .catch(err => console.log(err));

// let username = process.env.TWITTER_USERNAME || argv_username;
// let password = process.env.TWITTER_PASSWORD || argv_password;
// let columno = process.env.TWITTERDECK_COLUMN_NO || argv_columnno;
// (async () => {
//   try {
//     let stockAutomate = new StockAutomate({ username, password, columno });
//     let dayEndJob = stockAutomate.setDayEndInterval();
//     await stockAutomate.setDriver();
//     await stockAutomate.ameritradeAuthenticationInit().then(async connected => {
//       if(!connected){
//         console.log("Error authenticating ameritrades api");
//         stockAutomate.closeDriver();
//         process.exit();
//       }
//       await stockAutomate.authenticate_twitterdeck();
//       setInterval(() => {
//         stockAutomate.getLatestStock().then(stock => {
//           if (stockAutomate.alertKeyExist(stock)) {
//             let match = stockAutomate.getStockFromString(stock);
//             if (!!match) stock = match[0];
//             stock = stockAutomate.removeDollorSign(stock);
//             if (!stockAutomate.ifTodaysStock(stock)) {
//               stockAutomate.getLatestMarketPrice(stock).then(response => {
//                 console.log(response);
//               });
//             } else {
//               stockAutomate.addStocktoDayStack(stock);
//             }
//           }
//         });
//       }, 2000);
//     });
//   } catch (e) {
//     console.log(e);
//     stockAutomate.closeDriver();
//     process.exit();
//   }
// })();
