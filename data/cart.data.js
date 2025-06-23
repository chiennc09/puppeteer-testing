const config = require("../config/config");

const BASE_URL = config.baseUrl;
const PRODUCT_URL = `${BASE_URL}/macbook-pro-m4-14-inch-2024-open-box/`;
const discount = 'ảweh&87690';

const cartTestCases = [
    {
        id: 'GH_01',
        description: 'Kiểm tra “Giỏ hàng” hiện thông tin “Không có sản phẩm” khi chưa thêm sản phẩm',
        steps: ['goto_cart', 'verify_toast_message'],
        expectedResult: 'Chưa có sản phẩm nào trong giỏ hàng'
    },
    {
        id: 'GH_02',
        description: 'Kiểm tra thông tin “Thông báo thêm giỏ hàng thành công” khi nhấn “Thêm vào giỏ hàng”',
        steps: ['goto_product', 'add_to_cart', 'verify_toast_alert'],
        expectedResult: 'đã được thêm vào giỏ hàng',
        productUrl: PRODUCT_URL,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1 
        }
    },
    {
        id: 'GH_03',
        description: 'Kiểm tra thông tin “Giỏ hàng” có sản phẩm vừa thêm',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'verify_product_in_cart'],
        productUrl: PRODUCT_URL,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1 
        }
    },
        {
        id: 'GH_05',
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
        id: 'GH_04',
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
        id: 'GH_06',
        description: 'Kiểm tra thông báo “Xóa sản phẩm thành công”',
        steps: ['setup_add_item', 'goto_cart', 'delete_item', 'verify_toast_alert'],
        productUrl: PRODUCT_URL,
        expectedResult: 'đã xóa',
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 5
        }
    },
    {
        id: 'GH_07',
        description: 'Kiểm tra phần khôi phục sản phẩm vừa xóa khỏi giỏ',
        steps: ['setup_add_item', 'goto_cart', 'delete_item', 'restore-item', 'verify_product_in_cart'],
        productUrl: PRODUCT_URL,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1
        }
    },
    {
        id: 'GH_08',
        description: 'Kiểm tra thông tin sản phẩm không còn trong giỏ khi đã ấn xóa”',
        steps: ['setup_add_item', 'goto_cart', 'delete_item'],
        productUrl: PRODUCT_URL,
        expectedResult: 'đã xóa',
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1
        }
    },
    {
        id: 'GH_09',
        description: 'Kiểm tra thông báo cập nhật giỏ hàng thành công',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'change_quantity_in_cart', 'verify_toast_alert'],
        productUrl: PRODUCT_URL,
        expectedResult: 'Giỏ hàng đã được cập nhật.',
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 2 
        }
    },
    {
        id: 'GH_10',
        description: 'Kiểm tra thông tin cập nhật giỏ hàng khi nhập số lượng',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'change_quantity_in_cart', 'verify_price'],
        productUrl: PRODUCT_URL,
        expectedResult: 'Giỏ hàng đã được cập nhật.',
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 2 
        }
    },
    {
        id: 'GH_11',
        description: 'Kiểm tra khi nhấn “Tiến hành thanh toán” sẽ chuyển đến trang thanh toán',
        steps: ['setup_add_item', 'goto_cart', 'proceed_to_checkout', 'verify_url'],
        productUrl: PRODUCT_URL,
        expectedResult: `${BASE_URL}/thanh-toan/`
    },
    {
        id: 'GH_12',
        description: 'Kiểm tra số tiền khi sử dụng mã giảm giá',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'verify_discount'],
        productUrl: PRODUCT_URL,
        use_discount: true,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1 
        }
    },
    {
        id: 'GH_13',
        description: 'Kiểm tra số tiền khi không sử dụng mã giảm giá',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'verify_discount'],
        productUrl: PRODUCT_URL,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1 
        }
    },
    {
        id: 'GH_15',
        description: 'Kiểm tra địa chỉ khi nhập địa chỉ nhận trong giỏ hàng',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'change_address'],
        productUrl: PRODUCT_URL,
        expectedResult: 'Hải Phòng',
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 0,
            address: 'Hải Phòng' 
        }
    },
    {
        id: 'GH_14',
        description: 'Kiểm tra địa chỉ khi thay đổi địa chỉ nhận trong giỏ hàng',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'change_address'],
        productUrl: PRODUCT_URL,
        expectedResult: 'Hải Dương',
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 0,
            address: 'Hải Dương' 
        }
    },
    {
        id: 'GH_16',
        description: 'Kiểm tra thông tin cập nhật giỏ hàng khi nhập số lượng là “0”',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'change_quantity_in_cart' , 'verify_product_in_cart'],
        productUrl: PRODUCT_URL,
        is_change_quantity_equal_0: true,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 0 
        }
    },
    {
        id: 'GH_17',
        description: 'Kiểm tra thông tin cập nhật giỏ hàng khi nhập số lượng là số âm',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'change_quantity_in_cart' , 'verify_validation'],
        productUrl: PRODUCT_URL,
        expectedError: 'Value must be greater than or equal to 0.',
        is_validation: true,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: -2 
        }
    },
    {
        id: 'GH_18',
        description: 'Kiểm tra thông tin cập nhật giỏ hàng khi nhập số lượng rất lớn',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'change_quantity_in_cart', 'verify_price'],
        productUrl: PRODUCT_URL,
        expectedResult: 'Giỏ hàng đã được cập nhật.',
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 1000000 
        }
    },
    {
        id: 'GH_19',
        description: 'Kiểm tra thông tin cập nhật giỏ hàng khi nhập mã giảm giá không đúng',
        steps: ['goto_product', 'add_to_cart', 'goto_cart', 'add_discount', 'verify_toast_alert'],
        productUrl: PRODUCT_URL,
        discount: 'ảweh&87690',
        expectedResult: `Mã giảm giá "${discount}" không tồn tại`,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 2
        }
    },
    {
        id: 'GH_20',
        description: 'Kiểm tra khi nhập số lượng = 0 để thêm vào giỏ',
        steps: ['goto_product', 'add_to_cart_with_quantity', 'verify_validation'],
        productUrl: PRODUCT_URL,
        is_validation: true,
        expectedError: `Value must be greater than or equal to 1`,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: 0
        }
    },
    {
        id: 'GH_21',
        description: 'Kiểm tra khi nhập số lượng là số âm để thêm vào giỏ',
        steps: ['goto_product', 'add_to_cart_with_quantity', 'verify_validation'],
        productUrl: PRODUCT_URL,
        is_validation: true,
        expectedError: `Value must be greater than or equal to 1`,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: -1
        }
    },
    {
        id: 'GH_22',
        description: 'Kiểm tra khi xóa số lượng để thêm vào giỏ',
        steps: ['goto_product', 'add_to_cart_with_quantity', 'verify_validation'],
        productUrl: PRODUCT_URL,
        is_validation: true,
        expectedError: `Value must be greater than or equal to 1`,
        data: { 
            productName: 'MacBook Pro M4',
            quantity: ' '
        }
    },
];

module.exports = cartTestCases;