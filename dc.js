const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.discord.com';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const discord = {
    init: async () => {
        discord.browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1366, height: 768 }, args: ['--start-maximized'] });
        discord.page = await discord.browser.newPage();
        await discord.page.setViewport({ width: 1366, height: 768 });
        await discord.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36');
        await discord.page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    },
    login: async (username, password) => {
        await discord.page.type('input[name="email"]', username, { delay: 80 });
        await discord.page.type('input[name="password"]', password, { delay: 80 });
        let submitButton = await discord.page.$x('//span[contains(text(), "Log In")]');
        await submitButton[0].click();
        await discord.page.waitForNavigation({ waitUntil: 'networkidle2' });
    },
    moveTo: async (serverID, channelID) => {
        await discord.page.goto(`${BASE_URL}/channels/${serverID}/${channelID}`, { waitUntil: 'networkidle2' });
        await discord.page.waitForTimeout(5000);
    },
    clickBtn: async () => {
        await discord.page.waitForSelector('._57f777e233da01ff-label', { timeout: 3000 }).catch(() => console.log('Button doesn\'t exist!'));
        await discord.page.evaluate(() => {
            var fish = Array.from(document.querySelectorAll('._57f777e233da01ff-label')).filter(element => element.textContent == 'Fish Again');
            if(fish.length > 0){
                fish[0].click();
            }
            var sell = Array.from(document.querySelectorAll('._57f777e233da01ff-label')).filter(element => element.textContent == 'Sell');
            if(sell.length > 0){
                sell[0].click();
            }
        });
    }
}

module.exports = discord;