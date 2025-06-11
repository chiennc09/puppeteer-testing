const puppeteer = require('puppeteer');
const config = require('../config/config');
const { waitForElement, clickElement, typeText } = require('../utils/helpers');
const searchTestCases = require('../data/search.data');

let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

describe('Search Functionality', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 10,
      args: ['--start-maximized'],
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  after(async () => {
    await browser.close();
  });

  searchTestCases.forEach((testCase) => {
    it(`${testCase.description}`, async () => {
        await page.goto(config.baseUrl);
        await typeText(page, '#woocommerce-product-search-field-1', testCase.keyword);
        await clickElement(page, 'button[type="submit"]');

        if (expectResults) {
          await waitForElement(page, '.shop-container', { timeout: config.timeout });
          // const results = await page.$$('.products .product');
          // expect(results.length).to.be.greaterThan(0, 'Expected search results but found none');
          const firstResultText = await page.$eval('.name.product-title.woocommerce-loop-product__title', el => el.textContent.trim());
          expect(firstResultText).to.include(expectedText);
        } else {
          // Trường hợp không có kết quả hoặc lỗi
          await waitForElement(page, '#container-info', { timeout: config.timeout });
          const errorText = await page.$eval('.message-container.container.medium-text-center', el => el.textContent.trim());
          expect(errorText).to.include(expectedError);
        }
    });
  });
});