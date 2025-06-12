// const puppeteer = require('puppeteer');
// const config = require('../config/config');
// const { waitForElement, clickElement, typeText } = require('../utils/helpers');
// const testData = require('../data/login.data');

// let expect;

// before(async () => {
//   const chai = await import('chai');
//   expect = chai.expect;
// });

// describe('Login Functionality', () => {
//   let browser;
//   let page;

//   before(async () => {
//     browser = await puppeteer.launch({
//     headless: false,
//     slowMo: -20,
//     args: ['--start-maximized'],
//   });
//     page = await browser.newPage();
//     await page.setViewport({ width: 1280, height: 720 });
//   });

//   after(async () => {
//     await browser.close();
//   });

//   testData.loginTestCases.forEach(({ description, email, password, expectSuccess, expectedText, expectedError }) => {
//     it(description, async () => {
//       await page.goto(config.baseUrl + '/tai-khoan');
//       await typeText(page, '#username', email);
//       await typeText(page, '#password', password);
//       await clickElement(page, 'button[name="login"]');

//       if (expectSuccess) {
//         await waitForElement(page, '.woocommerce-MyAccount-content');
//         const welcomeText = await page.$eval('.woocommerce-MyAccount-content', el => el.textContent);
//         expect(welcomeText).to.include(expectedText);
//       } else {
//         await waitForElement(page, '.woocommerce-notices-wrapper');
//         const errorText = await page.$eval('.woocommerce-notices-wrapper', el => el.textContent);
//         expect(errorText).to.include(expectedError);
//       }
//     });
//   });
// });