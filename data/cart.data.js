const config = require("../config/config");

const BASE_URL = config.baseUrl;
const PRODUCT_URL = `${BASE_URL}/macbook-pro-m4-14-inch-2024-open-box/`;

const cartTestCases = [
    {
        id: 'GH_001',
        description: 'Kiểm tra “Giỏ hàng” hiện thông tin “Không có sản phẩm” khi chưa thêm sản phẩm',
        steps: ['goto_cart'],
        expectedResult: 'Chưa có sản phẩm nào trong giỏ hàng'
    },
    {
        id: 'GH_002',
        description: 'Kiểm tra thông tin “Thông báo thêm giỏ hàng thành công” khi nhấn “Thêm vào giỏ hàng”',
        steps: ['goto_product', 'add_to_cart'],
        expectedResult: 'đã được thêm vào giỏ hàng',
        productUrl: PRODUCT_URL,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1 
        }
    },
    {
        id: 'GH_003',
        description: 'Kiểm tra thông tin “Giỏ hàng” có sản phẩm vừa thêm',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'verify_product_in_cart'],
        productUrl: PRODUCT_URL,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1 
        }
    },
        {
        id: 'GH_005',
        description: 'Kiểm tra thông tin số lượng trong “Giỏ hàng” tăng khi sản phẩm vừa “Thêm vào giỏ hàng” đã có trong giỏ hàng',
        steps: ['goto_product', 'add_to_cart_with_quantity', 'verify_product_quantity'],
        productUrl: PRODUCT_URL,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 3,
            quantity_past: 2
        }
    },
    {
        id: 'GH_004',
        description: 'Kiểm tra thông tin số lượng trong “Giỏ hàng” có đúng với số lượng chọn',
        steps: ['goto_cart', 'delete_item', 'goto_product', 'add_to_cart_with_quantity', 'verify_product_quantity'],
        productUrl: PRODUCT_URL,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 5,
            quantity_past: 0
        }
    },
    {
        id: 'GH_006',
        description: 'Kiểm tra thông báo “Xóa sản phẩm thành công”',
        steps: ['setup_add_item', 'goto_cart', 'delete_item', 'verify_toast_message'],
        productUrl: PRODUCT_URL,
        expectedResult: 'Sản phẩm đã xóa'
    },
    {
        id: 'GH_011',
        description: 'Kiểm tra khi nhấn “Tiến hành thanh toán” sẽ chuyển đến trang thanh toán',
        steps: ['setup_add_item', 'goto_cart', 'proceed_to_checkout', 'verify_url'],
        productUrl: PRODUCT_URL,
        expectedResult: `${BASE_URL}/checkout` // URL trang thanh toán
    },
];

module.exports = cartTestCases;