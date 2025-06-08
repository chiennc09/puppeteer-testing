const { timeout } = require('../config/config');

async function waitForElement(page, selector) {
  await page.waitForSelector(selector, { visible: true, timeout });
}

async function clickElement(page, selector) {
  await waitForElement(page, selector);
  await page.click(selector);
}

async function typeText(page, selector, text) {
  await waitForElement(page, selector);
  await page.type(selector, text);
}

module.exports = { waitForElement, clickElement, typeText };