const dc = require('./dc');
const axios = require('axios');

const email = "";
const pass = "";
const token = "";

const serverID = "";
const channelID = "";

let run = 0;
var cooldown = 3200; //miliseconds

const captchaTitle = "Anti-bot\n/verify <result>";
const captchaDesc = ":information_source: To continue, solve the captcha posted above with the **/verify** command.\nIf the code is unreadable, you can use the **/verify regen** command.";

(async () => {
    await dc.init();
    await dc.login(email, pass);
    await dc.moveTo(serverID, channelID);

    body.botClick();
})();

const body = {
  botClick: async () => {
    let lastMsg;

    try {
      const response = await axios.get(`http://discord.com/api/v9/channels/${channelID}/messages?limit=1`, {
        headers: { Authorization: token }
      });

      const msg = response.data[0];

      lastMsg = {
        author: msg.author?.username,
        content: msg.content ?? null,
        embedTitle: msg.embeds?.[0]?.title ?? null,
        embedDesc: msg.embeds?.[0]?.description ?? null
      };

    } catch (error) {
      console.log(error);
      return;
    }

    console.log(lastMsg);

    const isCaptcha =
      lastMsg.embedTitle?.includes(captchaTitle) ||
      lastMsg.embedDesc?.includes(captchaDesc);

    const isValidMessage =
      lastMsg.content ||
      lastMsg.embedTitle ||
      lastMsg.embedDesc;

    if (!isCaptcha && isValidMessage) {
      run++;
      console.log(run + ' fish');

      await dc.clickBtn();
      await dc.page.waitForTimeout(cooldown);
      return body.botClick();
    }

    if (!isValidMessage) {
      console.log("Error detected!! Waiting 10 seconds.");
      await dc.page.waitForTimeout(10000);
      return body.botClick();
    }

    if (isCaptcha) {
      console.log("Captcha Detected!! Finish the captcha and type anything in channel.");
      await dc.page.waitForTimeout(10000);
      return body.botClick();
    }
  }
};
