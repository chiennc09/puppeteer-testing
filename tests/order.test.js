const puppeteer = require('puppeteer');
const config = require('../config/config');
const { waitForElement, clickElement, typeText } = require('../utils/helpers');
const orderTestCases = require('../data/order.data');

let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

describe('Order Functionality', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({
    headless: false,
    slowMo: -20,
    args: ['--start-maximized'],
  });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  after(async () => {
    await browser.close();
  });

 orderTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      await page.goto(config.baseUrl + '/macbook-pro-m4-14-inch-2024-open-box/');
      await clickElement(page, '.button.buy_now_button');
      await waitForElement(page, '#customer_details', { timeout: config.timeout });
      await page.evaluate(() => {
        const inputs = document.getElementsByTagName('input');
        for (let input of inputs) {
            input.value = '';
        }
        });
      await typeText(page, '#billing_first_name', testCase.firstName);
      await typeText(page, '#billing_last_name', testCase.lastname);
      await typeText(page, '#billing_address_1', testCase.address);
      await typeText(page, '#billing_address_2', testCase.apartment);
      await typeText(page, '#billing_city', testCase.city);
      await typeText(page, '#billing_phone', testCase.phoneNumber);

      // Đợi container load style xong
      
      await clickElement(page, 'button[id="place_order"]');

      if (testCase.expectResults) {
        await waitForElement(page, '.is-well.col-inner.entry-content', { timeout: config.timeout });
        const currentUrl = page.url();
        expect(currentUrl).to.include(testCase.navigation);
      } else {
        const validationMessage = await waitForElement(page, '.woocommerce-error.message-wrapper');
        if(validationMessage) {
            const errorText = await page.$eval('.woocommerce-error.message-wrapper', el => el.textContent);
            expect(errorText).to.include(expectedError);
        } else {
            throw new Error('Error message not found include ' + testCase.expectedError);
        }
      }
    });
  });
});