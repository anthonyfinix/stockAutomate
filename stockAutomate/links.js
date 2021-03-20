module.exports = {
  url:
    "https://mobile.twitter.com/login?hide_message=true&redirect_after_login=https%3A%2F%2Ftweetdeck.twitter.com%2F%3Fvia_twitter_login%3Dtrue",
  usernameTextbox:
    '//*[@id="react-root"]/div/div/div[2]/main/div/div/div[2]/form/div/div[1]/label/div/div[2]/div/input',
  passwordTextbox:
    '//*[@id="react-root"]/div/div/div[2]/main/div/div/div[2]/form/div/div[2]/label/div/div[2]/div/input',
  columnCssSelectPath: columnno => {
    return `section:nth-child(${columnno}) .chirp-container article:nth-child(1) .js-tweet-text`;
  },
  retryError: '//*[@id="react-root"]/div/div/div[2]/main/div/div/div[1]/div'
};
