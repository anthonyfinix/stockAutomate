require("dotenv").config();
const { init } = require("td-ameritrade-auth");
init(process.env.AMT_CONSUMER_KEY)
  .then(() => console.log("done"))
  .catch(e => console.log(e));
