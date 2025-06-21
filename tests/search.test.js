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
      args: ['--start-maximized'],
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  after(async () => {
    await browser.close();
  });

  const actions = {
    performSearch: async (searchTerm, id) => {
      await page.goto(config.baseUrl);
      await page.waitForSelector('input[type="search"]', { timeout: config.timeout });
      await page.click('input[type="search"]', { clickCount: 3 });
      await page.type('input[type="search"]', searchTerm);
      if(id != 'TK_001')
        await waitForElement(page, '.autocomplete-suggestions', { timeout: config.timeout });
    },
    getSearchResultsText: async (press_search) => {
      if(press_search){  
        await page.click('button[type="submit"]');
        await waitForElement(page, '.shop-container');
        return page.$$eval('.product-small.box', elements => elements.map(el => el.textContent).join(';'));
      }
      else
        return page.$$eval('.autocomplete-suggestions', elements => elements.map(el => el.textContent).join(';'));
    },
    is_includeExpectedResult: async (css, expectedResult) => {
        const productNames = await page.$$eval(
            css, 
            (elements) => elements.map(el => el.innerText.trim())
        );
        const isProductFound = productNames.some(
            productName => productName.includes(expectedResult)
        );
        return isProductFound;
    }
  };

  const parsePrice = (priceText) => {
    if (!priceText) return 0;
    // Bỏ tất cả các ký tự không phải là số (dấu chấm, chữ ₫, khoảng trắng)
    const numericString = priceText.replace(/\D/g, '');
    return parseInt(numericString, 10);
  };

  const getProductTitles = async () => {
    // Selector đến tiêu đề của mỗi sản phẩm
    const productTitleSelector = '.product-small .product-title a';
    await page.waitForSelector(productTitleSelector);
    
    const titles = await page.$$eval(productTitleSelector, elements =>
      elements.map(el => el.textContent.trim())
    );
    // Sắp xếp lại mảng để việc so sánh được chính xác
    return titles.sort();
  };

  const getRatingScores = async () => {
    // Selector đến thẻ span chứa style width của điểm đánh giá
    const ratingSelector = '.product-small .star-rating span';
    await page.waitForSelector(ratingSelector);

    // Dùng $$eval để lấy thuộc tính 'style' của tất cả các phần tử
    const ratings = await page.$$eval(ratingSelector, elements => {
      return elements.map(el => {
        // Trích xuất chuỗi width, ví dụ: "width:83.333333333333%"
        const widthStyle = el.getAttribute('style');
        if (!widthStyle) return 0;
        // Chỉ lấy phần số
        const percentage = parseFloat(widthStyle.replace(/[^0-9.]/g, ''));
        return percentage;
      });
    });
    return ratings;
  };

  const getProductPrices = async () => {
    // Selector đến phần tử chứa giá tiền
    const priceSelector = '.product-small .price-wrapper .woocommerce-Price-amount';
    await page.waitForSelector(priceSelector);

    const prices = await page.$$eval(priceSelector, elements => {
      return elements.map(el => {
        const priceText = el.textContent;
        // Bỏ tất cả các ký tự không phải là số để chuyển sang dạng số
        const numericString = priceText.replace(/\D/g, '');
        return parseInt(numericString, 10);
      });
    });
    return prices;
  };

  searchTestCases.forEach((testCase) => {
    it(`${testCase.description}`, async () => {
        switch (testCase.category) {
            case 'direct_search':
                await actions.performSearch(testCase.data.searchTerm, testCase.id);
                await page.click('button[type="submit"]');
                await waitForElement(page, '.shop-container', { timeout: config.timeout });
                if(testCase.alert){
                  const ResultText = await page.$eval('.shop-container', el => el.textContent);
                  expect(ResultText).to.include(testCase.expectedResult);
                }else{
                  const isProductFound = await actions.is_includeExpectedResult('.product-small.box', testCase.expectedResult);
                  expect(isProductFound, `❌FAILED: "${testCase.data.searchTerm}" không được tìm thấy trong kết quả`).to.be.true;
                }
            break;

            case 'suggestion':
                // await page.type('#search-input', test.data.searchTerm);
                // await page.waitForSelector('.autocomplete-suggestions', { visible: true });
                await actions.performSearch(testCase.data.searchTerm);
                const suggestionText = await page.$eval('.autocomplete-suggestions', el => el.textContent);
                expect(suggestionText).to.include(testCase.expectedResult);
                break;

            case 'comparison':
                await actions.performSearch(testCase.data.searchTerm1);
                const results1 = await actions.getSearchResultsText(testCase.press_search);

                await page.click('input[type="search"]', { clickCount: 3 });
                await page.type('input[type="search"]', testCase.data.searchTerm2);
                await waitForElement(page, '.autocomplete-suggestions', { timeout: config.timeout });
                const results2 = await actions.getSearchResultsText(testCase.press_search);

                expect(results1).to.equal(results2);
              break;

            case 'filter': 
              await page.goto(`${config.searchUrl}${testCase.data.searchTerm}&post_type=product&min_price=${testCase.data.min_price}&max_price=${testCase.data.max_price}`);
              await page.waitForSelector('.product-small');
              // Lấy tất cả các sản phẩm trên trang hiện tại
              const productElements = await page.$$('.product-small');
              console.log(`Tìm thấy ${productElements.length} sản phẩm trên trang.`);

              // Nếu không có sản phẩm nào, test vẫn pass
              if (productElements.length === 0) {
                  console.log('Không có sản phẩm nào trong khoảng giá này, test được coi là pass.');
                  return;
              }
                // Dùng vòng lặp để kiểm tra giá của từng sản phẩm
                for (let i = 0; i < productElements.length; i++) {
                  const product = productElements[i];

                  // Lấy tên sản phẩm để log cho rõ ràng
                  const titleElement = await product.$('.product-title a');
                  const title = await titleElement.evaluate(el => el.textContent);

                  // Lấy giá sản phẩm
                  const priceElement = await product.$('.price-wrapper .woocommerce-Price-amount');
                  const priceText = await priceElement.evaluate(el => el.textContent);

                  // Chuyển giá sang dạng số
                  const price = parsePrice(priceText);
                  
                  console.log(`Kiểm tra sản phẩm: "${title}" - Giá: ${price}đ`);

                  // Khẳng định giá phải nằm trong khoảng đã định
                  expect(price).to.be.at.least(testCase.data.min_price, `Giá của "${title}" (${price}) thấp hơn mức tối thiểu ${testCase.data.min_price}`);
                  expect(price).to.be.at.most(testCase.data.max_price, `Giá của "${title}" (${price}) cao hơn mức tối đa ${testCase.data.max_price}`);
                } 
            break;

            case 'remove_filter': 
              await page.goto(`${config.searchUrl}${testCase.data.searchTerm}&post_type=product&min_price=${testCase.data.min_price}&max_price=${testCase.data.max_price}`);
              await page.waitForSelector('.product-small');

              const initialTitles = await getProductTitles();     
              console.log(initialTitles);

              const resetButtonSelector = '.reset.isures-reset--filter';
              await page.click(resetButtonSelector);

              const resetTitles = await getProductTitles();
              console.log(resetTitles); 
              expect(resetTitles).not.to.deep.equal(initialTitles, "Danh sách sản phẩm sau khi reset giống với ban đầu!");
            break;

            case 'filter_none': 
              await page.goto(`${config.searchUrl}${testCase.data.searchTerm}&post_type=product&filtero-cpu=1813`);
              await page.waitForSelector('.message-container.container.medium-text-center');

              const AlertText = await page.$eval('.message-container.container.medium-text-center', el => el.textContent);
              expect(AlertText).to.include(testCase.expectedResult);
            break;

            case 'rating': 
              await page.goto(`${config.searchUrl}${testCase.data.searchTerm}&post_type=product&orderby=rating`);
              await page.waitForSelector('.product-small');
              const extractedRatings = await getRatingScores();
              console.log('Điểm đánh giá trích xuất từ trang:', extractedRatings);

              // 2. Tạo một bản sao của danh sách và tự sắp xếp nó để làm "đáp án"
              // [...extractedRatings] tạo ra một bản sao của mảng
              // .sort((a, b) => b - a) sắp xếp các số theo thứ tự giảm dần (từ cao đến thấp)
              const correctlySortedRatings = [...extractedRatings].sort((a, b) => b - a);
              console.log('Điểm đánh giá theo thứ tự đúng:', correctlySortedRatings);

              // 3. Khẳng định rằng danh sách lấy từ trang phải giống hệt danh sách "đáp án"
              expect(extractedRatings).to.deep.equal(correctlySortedRatings, "Sản phẩm không được sắp xếp đúng theo điểm đánh giá từ cao đến thấp!");
            break;

            case 'price': 
              await page.goto(`${config.searchUrl}${testCase.data.searchTerm}&post_type=product&orderby=${testCase.order_by}`);
              await page.waitForSelector('.product-small');
              await page.select('select.orderby', testCase.order_by);
              // 2. Lấy danh sách giá từ các sản phẩm trên trang
              const extractedPrices = await getProductPrices();
              console.log('Giá trích xuất từ trang:', extractedPrices);

              // 3. Tạo một bản sao của danh sách và tự sắp xếp nó để làm "đáp án"
              const correctlySortedPrices = [...extractedPrices];
      
              if (testCase.order_by === 'price-desc') {
                correctlySortedPrices.sort((a, b) => b - a); // Sắp xếp giảm dần
                console.log('Đáp án đúng (giảm dần):', correctlySortedPrices);
              } else {
                correctlySortedPrices.sort((a, b) => a - b); // Sắp xếp tăng dần
                console.log('Đáp án đúng (tăng dần):', correctlySortedPrices);
              }
              const errorMessage = `Sản phẩm không được sắp xếp đúng theo thứ tự`;
              expect(extractedPrices).to.deep.equal(correctlySortedPrices, errorMessage);
            break;
        }
    });
  });
});