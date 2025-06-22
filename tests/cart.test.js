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
                await page.click('.input-text.qty.text', { clickCount: 3 });
                await page.type('.input-text.qty.text', quantity.toString());
            }
            await page.click('.single_add_to_cart_button');
            
        }
    };

    const parsePrice = (priceText) => {
        if (!priceText) return 0;
        // Bỏ tất cả các ký tự không phải là số
        const numericString = priceText.replace(/\D/g, '');
        return parseInt(numericString, 10);
    };

    cartTestCases.forEach((testCase) => {
        it(`[${testCase.id}] ${testCase.description}`, async function() {
            
            if (testCase.steps.includes('setup_add_item')) {
                await actions.addItemToCart(testCase.productUrl);
                await page.waitForSelector('[role="alert"]');
            }

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
                        if(!testCase.is_validation){
                            await page.waitForSelector('.header-cart-link.is-small');
                        await page.click('.header-cart-link.is-small');
                        }
                        break;

                    case 'verify_product_in_cart':
                        if(!testCase.is_change_quantity_equal_0)
                            await page.waitForSelector('.product-name');
                        const productNames = await page.$$eval(
                            '.product-name', 
                            (elements) => elements.map(el => el.innerText.trim())
                        );
                        const isProductFound = productNames.some(
                            productName => productName.includes(testCase.data.productName)
                        );
                        // console.log(productNames);
                        if(testCase.is_change_quantity_equal_0)
                            expect(isProductFound, `❌FAILED: Sản phẩm "${testCase.data.productName}"vẫn tồn tại trong giỏ hàng`).to.be.false;
                        else
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
                        await page.click('.input-text.qty.text', { clickCount: 3 });
                        await page.type('.input-text.qty.text', testCase.data.quantity.toString());
                        await clickElement(page, 'button[name="update_cart"]');
                        if(!testCase.is_validation)
                            await page.waitForSelector('[role="alert"]');
                        break;

                    case 'delete_item':
                        await page.waitForSelector('.remove');
                        await page.click('.remove');
                        break;

                    case 'restore-item':
                        await page.waitForSelector('.restore-item');
                        await page.click('.restore-item');
                        break;
                    
                    //check sản phẩm
                    case 'verify_toast_message':
                        await page.waitForSelector('.woocommerce-info.message-wrapper');
                        const errorText = await page.$eval('.woocommerce-info.message-wrapper', el => el.textContent);
                        expect(errorText).to.include(testCase.expectedResult);
                        break;

                    //check thông báo
                    case 'verify_toast_alert':
                        await page.waitForSelector('[role="alert"]');
                        const errorAlert = await page.$eval('[role="alert"]', el => el.textContent);
                        expect(errorAlert).to.include(testCase.expectedResult);
                        break;

                    case 'verify_validation':
                        const quantityInput = await page.$('.input-text.qty.text');
                        const validationMessage = await page.evaluate(el => el.validationMessage, quantityInput);
                        expect(validationMessage).to.include(testCase.expectedError);
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
                    
                    case 'verify_discount':
                        const subtotalText = await page.$eval(
                            'tr.cart-subtotal td span.woocommerce-Price-amount',
                            (el) => el.textContent
                        );
                        const subtotal = parsePrice(subtotalText);
                        console.log(`Tạm tính: ${subtotalText} -> ${subtotal}`);

                        const discountText = await page.$eval(
                            'tr.cart-discount td span.woocommerce-Price-amount',
                            (el) => el.textContent
                        );
                        const discount = parsePrice(discountText);
                        console.log(`Giảm giá: ${discountText} -> ${discount}`);

                        const totalText = await page.$eval(
                            'tr.order-total td span.woocommerce-Price-amount',
                            (el) => el.textContent
                        );
                        const total = parsePrice(totalText);
                        console.log(`Tổng: ${totalText} -> ${total}`);
                        
                        if(testCase.use_discount)
                            expect(subtotal - discount).to.equal(total);
                        else
                            expect(subtotal).to.equal(total);
                        break;

                    case 'verify_price':
                        const unitPriceText = await page.$eval(
                            'tr.woocommerce-cart-form__cart-item td.product-price span.woocommerce-Price-amount',
                            (el) => el.textContent
                        );
                        const unitPrice = parsePrice(unitPriceText);
                        console.log(`Đơn giá: ${unitPriceText} -> ${unitPrice}`);

                        const totalText1 = await page.$eval(
                            'tr.woocommerce-cart-form__cart-item td.product-subtotal span.woocommerce-Price-amount',
                            (el) => el.textContent
                        );
                        const total1 = parsePrice(totalText1);
                        console.log(`Tạm tính: ${totalText1} -> ${total1}`);
                        
                        expect(unitPrice*testCase.data.quantity).to.equal(total1);
                        break;

                    case 'add_discount':
                        await page.click('#coupon_code', { clickCount: 3 });
                        await page.type('#coupon_code', testCase.discount);
                        await clickElement(page, 'button[name="apply_coupon"]');
                        break;

                    case 'change_address':
                        await page.waitForSelector('.shipping-calculator-button');
                        await page.click('.shipping-calculator-button');
                        await page.click('#calc_shipping_city', { clickCount: 3 });
                        await page.type('#calc_shipping_city', testCase.data.address);
                        await clickElement(page, 'button[name="calc_shipping"]');
                        
                        await page.waitForFunction(() => {
                            const spinner = document.querySelector('.blockUI.blockOverlay');
                            return !spinner || spinner.style.display === 'none' || spinner.offsetParent === null;
                        }, { timeout: 10000 });
                        const addressText = await page.$eval('.woocommerce-shipping-destination', el => el.textContent);
                        console.log(addressText);
                        expect(addressText).to.include(testCase.expectedResult);
                        break;
                }
            }
        });
    });
});