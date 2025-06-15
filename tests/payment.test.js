// const puppeteer = require('puppeteer');
// const config = require('../config/config');
// const { waitForElement, clickElement, typeText } = require('../utils/helpers');
// const orderTestCases = require('../data/bill.data');

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
//       slowMo: 20,
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
//       try {
//         const productUrl = `${config.baseUrl}macbook-pro-m4-14-inch-2024-open-box/`;
//         await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: config.timeout });

//         const variationSelector = 'select[name="attribute_pa_color"]';
//         if (await page.$(variationSelector)) {
//           await page.select(variationSelector, 'black');
//         }

//         await clickElement(page, '.button.buy_now_button');
//         await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.timeout });

//         await waitForElement(page, '#customer_details');
//         await page.select('#billing_country', 'VN');

//         await page.evaluate(() => {
//           ['billing_first_name', 'billing_last_name', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_phone', 'billing_email']
//             .forEach(id => {
//               const el = document.getElementById(id);
//               if (el) el.value = '';
//             });
//         });

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

//         if (testCase.paymentMethod) {
//           const methodSelector = `input[name="payment_method"][value="${testCase.paymentMethod}"]`;
//           if (await page.$(methodSelector)) {
//             await page.click(methodSelector);
//             await new Promise(r => setTimeout(r, 1000));
//           }
//         }

//         if (testCase.removeCoupon) {
//           const couponSelector = '.woocommerce-remove-coupon';
//           try {
//             const hasCoupon = await page.$(couponSelector);
//             if (hasCoupon) {
//               await page.click(couponSelector);
//               await page.waitForFunction(() => {
//                 const el = document.querySelector('.cart-discount');
//                 return !el || el.offsetParent === null;
//               }, { timeout: 5000 });
//               console.log('🧾 Đã xóa mã giảm giá thành công!');
//             } else {
//               console.warn('⚠️ Không tìm thấy mã giảm giá để xóa.');
//             }
//           } catch (err) {
//             console.warn(`⚠️ Không thể xóa mã giảm giá: ${err.message}`);
//           }
//         }

//         const termsCheckbox = await page.$('#terms');
//         if (termsCheckbox) {
//           const isChecked = await page.$eval('#terms', el => el.checked);
//           if (!isChecked) await page.click('#terms');
//         }

//         await page.evaluate(() => {
//           const btn = document.querySelector('#place_order');
//           if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         });

//         await new Promise(r => setTimeout(r, 1000));

//         const [response] = await Promise.all([
//           page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.timeout }).catch(() => null),
//           page.click('#place_order'),
//         ]);

//         const finalUrl = page.url();
//         const isSuccess = finalUrl.includes('/order-received');
//         const shouldPass = testCase.expectResults;

//         const pageText = await page.evaluate(() => document.body.innerText);
//         console.log(`🧾 Nội dung sau khi đặt hàng (${isSuccess ? 'CHUYỂN' : 'KHÔNG chuyển'} trang):\n`, pageText.slice(0, 800));

//         if (isSuccess && testCase.expectedTotal) {
//           const match = pageText.match(/Tổng cộng:\s*([\d.,]+)\s*₫/);
//           const actual = match ? match[1].replace(/[^\d]/g, '') : null;
//           const expected = testCase.expectedTotal.replace(/[^\d]/g, '');
//           if (actual !== expected) {
//             throw new Error(`⚠️ Sai tổng tiền: expected ${testCase.expectedTotal}, got ${match ? match[1] : 'N/A'}`);
//           } else {
//             console.log(`✅ Tổng tiền đúng: ${match[1]}`);
//           }
//         }

//         if (isSuccess === shouldPass) {
//           console.log(`✅ PASSED: ${testCase.description}`);
//         } else {
//           console.error(`❌ FAILED: ${testCase.description}`);
//           throw new Error(`Expected success: ${shouldPass}, but got: ${isSuccess}`);
//         }

//       } catch (err) {
//         console.error(`❌ FAILED: ${testCase.description}`, err.message || err);
//         throw err;
//       }
//     });
//   });
// });
