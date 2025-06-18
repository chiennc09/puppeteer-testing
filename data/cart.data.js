const config = require("../config/config");

const BASE_URL = config.baseUrl;
const PRODUCT_URL = `${BASE_URL}/macbook-pro-m4-14-inch-2024-open-box/`;

const cartTestCases = [
    // {
    //     id: 'GH_001',
    //     description: 'Kiểm tra “Giỏ hàng” hiện thông tin “Không có sản phẩm” khi chưa thêm sản phẩm',
    //     steps: ['goto_cart', 'verify_toast_message'],
    //     expectedResult: 'Chưa có sản phẩm nào trong giỏ hàng'
    // },
    // {
    //     id: 'GH_002',
    //     description: 'Kiểm tra thông tin “Thông báo thêm giỏ hàng thành công” khi nhấn “Thêm vào giỏ hàng”',
    //     steps: ['goto_product', 'add_to_cart', 'verify_toast_alert'],
    //     expectedResult: 'đã được thêm vào giỏ hàng',
    //     productUrl: PRODUCT_URL,
    //     data: { 
    //         productName: 'MacBook Pro M4',
    //         quantity: 1 
    //     }
    // },
    // {
    //     id: 'GH_003',
    //     description: 'Kiểm tra thông tin “Giỏ hàng” có sản phẩm vừa thêm',
    //     steps: ['goto_product', 'add_to_cart', 'goto_cart', 'verify_product_in_cart'],
    //     productUrl: PRODUCT_URL,
    //     data: { 
    //         productName: 'MacBook Pro M4',
    //         quantity: 1 
    //     }
    // },
    //     {
    //     id: 'GH_005',
    //     description: 'Kiểm tra thông tin số lượng trong “Giỏ hàng” tăng khi sản phẩm vừa “Thêm vào giỏ hàng” đã có trong giỏ hàng',
    //     steps: ['goto_product', 'add_to_cart_with_quantity', 'verify_product_quantity'],
    //     productUrl: PRODUCT_URL,
    //     data: { 
    //         productName: 'MacBook Pro M4',
    //         quantity: 3,
    //         quantity_past: 2
    //     }
    // },
    // {
    //     id: 'GH_004',
    //     description: 'Kiểm tra thông tin số lượng trong “Giỏ hàng” có đúng với số lượng chọn',
    //     steps: ['goto_cart', 'delete_item', 'goto_product', 'add_to_cart_with_quantity', 'verify_product_quantity'],
    //     productUrl: PRODUCT_URL,
    //     data: { 
    //         productName: 'MacBook Pro M4',
    //         quantity: 5,
    //         quantity_past: 0
    //     }
    // },
    // {
    //     id: 'GH_006',
    //     description: 'Kiểm tra thông báo “Xóa sản phẩm thành công”',
    //     steps: ['setup_add_item', 'goto_cart', 'delete_item', 'verify_toast_alert'],
    //     productUrl: PRODUCT_URL,
    //     expectedResult: 'đã xóa',
    //     data: { 
    //         productName: 'MacBook Pro M4',
    //         quantity: 5
    //     }
    // },
    // {
    //     id: 'GH_007',
    //     description: 'Kiểm tra phần khôi phục sản phẩm vừa xóa khỏi giỏ',
    //     steps: ['setup_add_item', 'goto_cart', 'delete_item', 'restore-item', 'verify_product_in_cart'],
    //     productUrl: PRODUCT_URL,
    //     data: { 
    //         productName: 'MacBook Pro M4',
    //         quantity: 1
    //     }
    // },
    // {
    //     id: 'GH_008',
    //     description: 'Kiểm tra thông tin sản phẩm không còn trong giỏ khi đã ấn xóa”',
    //     steps: ['setup_add_item', 'goto_cart', 'delete_item'],
    //     productUrl: PRODUCT_URL,
    //     expectedResult: 'đã xóa',
    //     data: { 
    //         productName: 'MacBook Pro M4',
    //         quantity: 1
    //     }
    // },
    // {
    //     id: 'GH_009',
    //     description: 'Kiểm tra thông báo cập nhật giỏ hàng thành công',
    //     steps: ['goto_product', 'add_to_cart', 'goto_cart', 'change_quantity_in_cart', 'verify_toast_alert'],
    //     productUrl: PRODUCT_URL,
    //     expectedResult: 'Giỏ hàng đã được cập nhật.',
    //     data: { 
    //         productName: 'MacBook Pro M4',
    //         quantity: 1 
    //     }
    // },
    {
        id: 'GH_011',
        description: 'Kiểm tra khi nhấn “Tiến hành thanh toán” sẽ chuyển đến trang thanh toán',
        steps: ['setup_add_item', 'goto_cart', 'proceed_to_checkout', 'verify_url'],
        productUrl: PRODUCT_URL,
        expectedResult: `${BASE_URL}/thanh-toan/`
    },
];

module.exports = cartTestCases;