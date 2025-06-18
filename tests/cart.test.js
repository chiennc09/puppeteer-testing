const puppeteer = require('puppeteer');
const config = require('../config/config');
const { waitForElement, clickElement, typeText } = require('../utils/helpers');
const cartTestCases = require('../data/cart.data');

let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

describe('Cart Functionality', () => {
    let browser;
    let page;

    before(async () => {
        browser = await puppeteer.launch({
        headless: false,
        slowMo: -30,
        args: ['--start-maximized'], // Mở trình duyệt ở chế độ toàn màn hình
    });
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
    });

    after(async () => {
        await browser.close();
    });

    const actions = {
    addItemToCart: async (productUrl, quantity = 1) => {
        await page.goto(productUrl);
        if (quantity > 1) {
            await page.click('.input-text.qty.text', { clickCount: 3 }); // Xóa giá trị cũ
            await page.type('.input-text.qty.text', quantity.toString());
        }
        await page.click('.single_add_to_cart_button');
        
    }
  };

    cartTestCases.forEach((testCase) => {
        it(`${testCase.description}`, async function() {
            
            if (testCase.steps.includes('setup_add_item')) {
                await actions.addItemToCart(testCase.productUrl);
                await page.waitForSelector('[role="alert"]');
            }

            // Thực thi các bước tuần tự
            for (const step of testCase.steps) {
                switch (step) {
                    case 'goto_cart':
                        await page.goto(config.cartUrl);
                        break;
                    
                    case 'goto_product':
                        await page.goto(testCase.productUrl);
                        break;

                    case 'add_to_cart':
                        await clickElement(page, '.single_add_to_cart_button');
                        await page.waitForSelector('[role="alert"]');
                        break;

                    case 'add_to_cart_with_quantity':
                        await page.click('.input-text.qty.text', { clickCount: 3 });
                        await page.type('.input-text.qty.text', testCase.data.quantity.toString());
                        await page.click('.single_add_to_cart_button');

                        await page.waitForSelector('.header-cart-link.is-small');
                        await page.click('.header-cart-link.is-small');
                        break;

                    case 'verify_product_in_cart':
                        await page.waitForSelector('.product-name');
                        const productNames = await page.$$eval(
                            '.product-name', 
                            (elements) => elements.map(el => el.innerText.trim())
                        );
                        const isProductFound = productNames.some(
                            productName => productName.includes(testCase.data.productName)
                        );
                        expect(isProductFound, `❌FAILED: Không tìm thấy sản phẩm chứa "${testCase.data.productName}" trong giỏ hàng`).to.be.true;
                        break;
                    
                    case 'verify_product_quantity':
                        await page.waitForSelector('.woocommerce');
                        const productQuantity = await page.$eval('.input-text.qty.text', el => el.value);
                        var totalQuantity = testCase.data.quantity + testCase.data.quantity_past;
                        console.log(totalQuantity);
                        expect(productQuantity).to.equal(totalQuantity.toString());
                        break;

                    case 'change_quantity_in_cart':
                        await page.click('.ux-quantity__button--plus');
                        await clickElement(page, 'button[name="update_cart"]');
                        break;

                    case 'delete_item':
                        await page.waitForSelector('.remove');
                        await page.click('.remove');
                        break;

                    case 'restore-item':
                        await page.waitForSelector('.restore-item');
                        await page.click('.restore-item');
                        break;
                    
                    case 'verify_toast_message':
                        await page.waitForSelector('.woocommerce-info.message-wrapper');
                        const errorText = await page.$eval('.woocommerce-info.message-wrapper', el => el.textContent);
                        expect(errorText).to.include(testCase.expectedResult);
                        break;

                    case 'verify_toast_alert':
                        await page.waitForSelector('[role="alert"]');
                        const errorAlert = await page.$eval('[role="alert"]', el => el.textContent);
                        expect(errorAlert).to.include(testCase.expectedResult);
                        break;

                    case 'proceed_to_checkout':
                        await page.waitForSelector('.checkout-button');
                        await page.click('.checkout-button');
                        break;
                    
                    case 'verify_url':
                        await page.waitForFunction(() => {
                            const spinner = document.querySelector('.blockUI.blockOverlay');
                            return !spinner || spinner.style.display === 'none' || spinner.offsetParent === null;
                        }, { timeout: 10000 });
                        expect(page.url()).to.equal(testCase.expectedResult);
                        break;
                }
            }


            // if (testCase.id === 'GH_001' || testCase.id === 'GH_006') {
            //     // await page.waitForSelector('.header-cart-link.is-small');
            //     // await page.click('.header-cart-link.is-small');
            //     await page.waitForSelector('.woocommerce');
            //     const errorText = await page.$eval('.woocommerce', el => el.textContent);
            //     expect(errorText).to.include(testCase.expectedResult);
            //     // await page.waitForSelector('.woocommerce');
            //     // const errorText = await page.$eval('.woocommerce', el => el.textContent);
            //     // expect(errorText).to.include(testCase.expectedResult);
            // }else if (testCase.id === 'GH_002'){
            //     await page.waitForSelector('[role="alert"]');
            //     const errorText = await page.$eval('[role="alert"]', el => el.textContent);
            //     expect(errorText).to.include(testCase.expectedResult);
            // }
            
        });
    });
});