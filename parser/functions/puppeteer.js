const puppeteer = require('puppeteer')

const LAUNCH_PUPPETEER_OPTIONS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080'
  ]
}

const PAGE_PUPPETEER_OPTIONS = {
  networkIdle2Timeout: 5000,
  waitUntil: 'networkidle2',
  timeout: 30000
}

module.exports = class PuppeteerHandler {
  constructor() {
    this.browser = null
  }
  async initBrowser() {
    this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTIONS)
  }
  closeBrowser() {
    this.browser.close()
  }
  async getPageContent(url) {
    if (!this.browser) {
      await this.initBrowser()
    }

    try {
      const page = await this.browser.newPage()

      await page.goto(url, PAGE_PUPPETEER_OPTIONS)

      const isCurrentPage = (await page.$$('.card-actions-view')).length !== 0

      if (isCurrentPage) {

        await page.waitForSelector('.card-actions-view')

        await page.click('.card-actions-view .action-button-view._type_share .button')

        const content = await page.content()

        return content
      } else {
        return null
      }



    } catch (err) {
      throw err
    }
  }
}