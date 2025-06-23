const puppeteer = require('puppeteer');
const config = require('../config/config');
const { waitForElement, clickElement, typeText } = require('../utils/helpers');
const registerTestCases = require('../data/register.data');

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
    slowMo: -20, // Làm chậm thao tác 100ms để dễ quan sát
    args: ['--start-maximized'], // Mở trình duyệt ở chế độ toàn màn hình
  });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  after(async () => {
    await browser.close();
  });

  registerTestCases.forEach((testCase) => {
    it(`[${testCase.id}] ${testCase.description}`, async () => {
      await page.goto(config.baseUrl + '/tai-khoan');
      await typeText(page, '#reg_email', testCase.email);
      await typeText(page, '#reg_password', testCase.password);
      await clickElement(page, 'button[name="register"]');
        if(testCase.emailInvalid) {
            const emailInput = await page.$('#reg_email');
            const validationMessage = await page.evaluate(el => el.validationMessage, emailInput);
            expect(validationMessage).to.include(testCase.expectedError);
        } else {
            if(testCase.passwordInvalid){
                const errorText = await page.$eval('#password_strength', el => el.textContent);
                expect(errorText).to.include(testCase.expectedError);
            }else{
                await waitForElement(page, '.woocommerce-notices-wrapper');
                const errorText = await page.$eval('.woocommerce-notices-wrapper', el => el.textContent);
                expect(errorText).to.include(testCase.expectedError);
            }
        }
    });
  });
});