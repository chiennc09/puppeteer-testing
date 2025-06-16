// const puppeteer = require('puppeteer');
// const config = require('../config/config');
// const { waitForElement, clickElement, typeText } = require('../utils/helpers');
// const orderTestCases = require('../data/order.data');

// let expect;

// before(async () => {
//   const chai = await import('chai');
//   expect = chai.expect;
// });

// describe('Order Functionality', () => {
//   let browser;
//   let page;

//   before(async () => {
//     browser = await puppeteer.launch({
//       headless: false,
//       args: ['--start-maximized'],
//     });
//     page = await browser.newPage();
//     await page.setViewport({ width: 1280, height: 720 });
//   });

//   after(async () => {
//     await browser.close();
//   });

//   orderTestCases.forEach((testCase) => {
//     it(testCase.description, async () => {
//         const productUrl = `${config.baseUrl}macbook-pro-m4-14-inch-2024-open-box/`;
//         await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: config.timeout });

//         const variationSelector = 'select[name="attribute_pa_color"]';
//         if (await page.$(variationSelector)) {
//           await page.select(variationSelector, 'black');
//         }

//         await clickElement(page, '.button.buy_now_button');
//         await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.timeout });

//         // Wait for checkout page
//         await waitForElement(page, '#customer_details');
//         await page.select('#billing_country', 'VN');

//         // Clear fields
//         await page.evaluate(() => {
//           ['billing_first_name', 'billing_last_name', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_phone', 'billing_email']
//             .forEach(id => {
//               const el = document.getElementById(id);
//               if (el) el.value = '';
//             });
//         });

//         // Fill form
//         await typeText(page, '#billing_first_name', testCase.firstName || '');
//         await typeText(page, '#billing_last_name', testCase.lastname || '');
//         await typeText(page, '#billing_address_1', testCase.address || '');
//         await typeText(page, '#billing_address_2', testCase.apartment || '');
//         await typeText(page, '#billing_city', testCase.city || '');
//         await typeText(page, '#billing_phone', testCase.phoneNumber || '');
//         await typeText(page, '#billing_email', testCase.email || '');

//         await page.click('body');

//         await page.waitForFunction(() => {
//           const spinner = document.querySelector('.blockUI.blockOverlay');
//           return !spinner || spinner.style.display === 'none' || spinner.offsetParent === null;
//         }, { timeout: 10000 });

//         // const termsCheckbox = await page.$('#terms');
//         // if (termsCheckbox) {
//         //   const isChecked = await page.$eval('#terms', el => el.checked);
//         //   if (!isChecked) await page.click('#terms');
//         // }

//         await page.evaluate(() => {
//           const btn = document.querySelector('#place_order');
//           if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         });
//         // await new Promise(r => setTimeout(r, 1000));

//         // const [response] = await Promise.all([
//         //   page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.timeout }).catch(() => null),
//         //   page.click('#place_order'),
//         // ]);

//         page.click('#place_order');
//         if (testCase.expectResults) {
//           await waitForElement(page, '.is-well.col-inner.entry-content', { timeout: config.timeout });
//           const currentUrl = page.url();
//           expect(currentUrl).to.include(config.orderReceived);
//         } else {
//           async function doesElementExist(page, selector, timeout) {
//             return page.waitForSelector(selector, { timeout })
//                 .then(() => true)   // Nếu promise thành công (tìm thấy), trả về true
//                 .catch(() => false); // Nếu promise thất bại (timeout), trả về false
//           }
//           const isErrorVisible = await doesElementExist(page, '.woocommerce-error', 10000);
//           if(isErrorVisible) {
//             const errorText = await page.$eval('.woocommerce-error .message-container', el => el.textContent);
//             expect(errorText).to.include(testCase.expectedError);
//           } else {
//             console.log(`❌ FAILED: cần thông báo lỗi: ${testCase.expectedError}`);
//             // expect(currentUrl).to.equal(config.orderUrl);
//             expect(true).to.be.false; 
//           }
//         }

//         // await new Promise(r => setTimeout(r, 5000));
//         // const currentUrl = page.url();
//         // if (testCase.expectResults) {
//         //   await waitForElement(page, '.is-well.col-inner.entry-content', { timeout: config.timeout });
//         //   expect(currentUrl).to.include(testCase.navigation);
//         // } else {
//         //   if(currentUrl.include('/order-received')) {
//         //     console.error(`❌ FAILED: cần thông báo lỗi: ${testCase.expectedError}`);
//         //     expect(currentUrl).not.to.include('/order-received');
//         //   } else {
//         //     await page.waitForSelector('.woocommerce-error', { timeout: config.timeout});
//         //     const errorText = await page.$eval('.woocommerce-error .message-container', el => el.textContent);
//         //     expect(errorText).to.include(testCase.expectedError);
//         //   }
//         // }
//     });
//   });
// });
