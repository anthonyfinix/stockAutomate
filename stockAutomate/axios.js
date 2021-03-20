const axios = require("axios").default;
const config = require("../config");
module.exports = axios.create({
    baseURL:config.ameritrade_baseURL
})