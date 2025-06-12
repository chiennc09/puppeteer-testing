// const puppeteer = require('puppeteer');
// const config = require('../config/config');
// const { waitForElement, clickElement, typeText } = require('../utils/helpers');
// const searchTestCases = require('../data/search.data');

// let expect;

// before(async () => {
//   const chai = await import('chai');
//   expect = chai.expect;
// });

// describe('Search Functionality', () => {
//   let browser;
//   let page;

//   before(async () => {
//     browser = await puppeteer.launch({
//       headless: false,
//       slowMo: -20,
//       args: ['--start-maximized'],
//     });
//     page = await browser.newPage();
//     await page.setViewport({ width: 1280, height: 720 });
//   });

//   after(async () => {
//     await browser.close();
//   });

//   searchTestCases.forEach((testCase) => {
//     it(`${testCase.description}`, async () => {
//         await page.goto(config.baseUrl);
//         await typeText(page, 'input[type="search"]', testCase.query);
//         if (testCase.expectResults) {
//           await waitForElement(page, '.autocomplete-suggestions', { timeout: config.timeout });
//           await clickElement(page, 'button[type="submit"]');
//           await waitForElement(page, '.shop-container', { timeout: config.timeout });
//           const firstResultText = await page.$eval('.shop-container', el => el.textContent);
//           expect(firstResultText).to.include(testCase.expectedText);
//           const currentUrl = page.url();
//           expect(currentUrl).to.include(testCase.navigation);
//         } else {
//           await clickElement(page, 'button[type="submit"]');
//           await waitForElement(page, '.shop-container', { timeout: config.timeout });
//           const currentUrl = page.url();
//           expect(currentUrl).to.include(testCase.navigation);
//         }
//     });
//   });
// });
// //document.querySelector('button[type="submit"]');