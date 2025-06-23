const puppeteer = require('puppeteer');
const config = require('../config/config');
const { waitForElement, clickElement, typeText } = require('../utils/helpers');
const orderTestCases = require('../data/payment.data');

let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

describe('Payment Functionality', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--start-maximized'],
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  after(async () => {
    await browser.close();
  });

  const parsePrice = (priceText) => {
    if (!priceText) return 0;
    // Bỏ tất cả các ký tự không phải là số
    const numericString = priceText.replace(/\D/g, '');
    return parseInt(numericString, 10);
  };

  orderTestCases.forEach((testCase) => {
    it(`[${testCase.id}] ${testCase.description}`, async () => {
      try {
        const productUrl = `${config.baseUrl}/macbook-pro-m4-14-inch-2024-open-box/`;
        await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: config.timeout });

        const variationSelector = 'select[name="attribute_pa_color"]';
        if (await page.$(variationSelector)) {
          await page.select(variationSelector, 'black');
        }

        await clickElement(page, '.button.buy_now_button');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.timeout });

        await waitForElement(page, '#customer_details');
        await page.select('#billing_country', 'VN');

        await page.evaluate(() => {
          ['billing_first_name', 'billing_last_name', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_phone', 'billing_email']
            .forEach(id => {
              const el = document.getElementById(id);
              if (el) el.value = '';
            });
        });

        await typeText(page, '#billing_first_name', testCase.firstName || '');
        await typeText(page, '#billing_last_name', testCase.lastname || '');
        await typeText(page, '#billing_address_1', testCase.address || '');
        await typeText(page, '#billing_address_2', testCase.apartment || '');
        await typeText(page, '#billing_city', testCase.city || '');
        await typeText(page, '#billing_phone', testCase.phoneNumber || '');
        await typeText(page, '#billing_email', testCase.email || '');

        await page.click('body');

        await page.waitForFunction(() => {
          const spinner = document.querySelector('.blockUI.blockOverlay');
          return !spinner || spinner.style.display === 'none' || spinner.offsetParent === null;
        }, { timeout: 10000 });

        if (testCase.paymentMethod) {
          const methodSelector = `input[name="payment_method"][value="${testCase.paymentMethod}"]`;
          if (await page.$(methodSelector)) {
            await page.click(methodSelector);
            await new Promise(r => setTimeout(r, 1000));
          }

          await page.evaluate(() => {
            const btn = document.querySelector('#place_order');
            if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });

          if(testCase.paymentMethod != 'payon'){
            const [response] = await Promise.all([
              page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.timeout }).catch(() => null),
              page.click('#place_order'),
            ]);
            const finalUrl = page.url();
            expect(finalUrl).to.include(testCase.navigation);
          }else{
            page.click('#place_order')
            const url = page.url();
            console.log(url);
            expect(url).to.include(testCase.navigation);
          }
          
        }

        if (testCase.coupon) {
          await clickElement(page, '.woocommerce-remove-coupon');
          await page.waitForFunction(() => {
            const spinner = document.querySelector('.blockUI.blockOverlay');
            return !spinner || spinner.style.display === 'none' || spinner.offsetParent === null;
          }, { timeout: 10000 });
           const subtotalSelector = 'tr.cart-subtotal .woocommerce-Price-amount';
            const subtotalText = await page.$eval(subtotalSelector, el => el.textContent);
            const subtotal = parsePrice(subtotalText);
            console.log(`Đã lấy Tạm tính: ${subtotalText} -> ${subtotal}`);

            // 2. Lấy Giảm giá
            const discountSelector = 'tr.cart-discount .woocommerce-Price-amount';
            const discountText = await page.$eval(discountSelector, el => el.textContent);
            const discount = parsePrice(discountText);
            console.log(`Đã lấy Giảm giá: ${discountText} -> ${discount}`);

            // 3. Lấy Tổng
            const totalSelector = 'tr.order-total .woocommerce-Price-amount';
            const totalText = await page.$eval(totalSelector, el => el.textContent);
            const total = parsePrice(totalText);
            console.log(`Đã lấy Tổng cộng: ${totalText} -> ${total}`);
            if(testCase.removeCoupon)
              expect(subtotal).to.equal(total);
            else
              expect(subtotal-discount).to.equal(total);
        }
      } catch (err) {
        console.error(`❌ FAILED: ${testCase.description}`, err.message || err);
        throw err;
      }
    });
  });
});
