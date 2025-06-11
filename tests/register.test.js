const puppeteer = require('puppeteer');
const config = require('../config/config');
const { waitForElement, clickElement, typeText } = require('../utils/helpers');
const testData = require('../data/login.data');

let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

describe('Register Functionality', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({
    headless: false, // Tắt headless để thấy trình duyệt
    slowMo: 10, // Làm chậm thao tác 100ms để dễ quan sát
    args: ['--start-maximized'], // Mở trình duyệt ở chế độ toàn màn hình
  });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  after(async () => {
    await browser.close();
  });

  testData.loginTestCases.forEach(({ description, email, password, expectSuccess, expectedText, expectedError }) => {
    it(description, async () => {
      await page.goto(config.baseUrl + '/tai-khoan');
      await typeText(page, '#username', email);
      await typeText(page, '#password', password);
      await clickElement(page, 'button[name="login"]');

      if (expectSuccess) {
        await waitForElement(page, '.woocommerce-MyAccount-content');
        const welcomeText = await page.$eval('.woocommerce-MyAccount-content', el => el.textContent);
        expect(welcomeText).to.include(expectedText);
      } else {
        await waitForElement(page, '.woocommerce-notices-wrapper');
        const errorText = await page.$eval('.woocommerce-notices-wrapper', el => el.textContent);
        expect(errorText).to.include(expectedError);
      }
    });
  });

//   it('should login with valid credentials', async () => {
//     await page.goto(config.baseUrl + '/tai-khoan');
//     await typeText(page, '#username', config.validUser.email);
//     await typeText(page, '#password', config.validUser.password);
//     await clickElement(page, 'button[name="login"]');

//     await waitForElement(page, '.woocommerce-MyAccount-content'); // Selector cho thông báo đăng nhập thành công
//     const welcomeText = await page.$eval('.woocommerce-MyAccount-content', el => el.textContent);
//     expect(welcomeText).to.include('Xin chào');
//   });

//   it('should show error with invalid credentials', async () => {
//     await clickElement(page, 'a[href*="action=logout"]');
//     await typeText(page, '#username', config.inValidUser.email);
//     await typeText(page, '#password', config.inValidUser.password);
//     await clickElement(page, 'button[name="login"]');

//     await waitForElement(page, '.woocommerce-notices-wrapper');
//     const welcomeText = await page.$eval('.woocommerce-notices-wrapper', el => el.textContent);
//     expect(welcomeText).to.include('Hãy nhập đúng định dạng tên người dùng');
//   });
});