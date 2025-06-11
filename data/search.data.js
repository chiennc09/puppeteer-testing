// File này chỉ chứa dữ liệu test case cho chức năng tìm kiếm.

const searchTestCases = [
    {
        description: 'Kiểm tra hiển thị khi bỏ trống mục tìm kiếm',
        query: '',
        expectResults: true,
        expectedText: 'iPhone 14',
        navigation: 'https://2tmobile.com/?s=&post_type=product'
    },
    {
        description: 'Kiểm tra danh mục sản phẩm khi khi nhập data không có trong dữ liệu',
        query: 'abc',
        expectResults: false,
        expectedText: 'Không tìm thấy sản phẩm nào khớp với lựa chọn của bạn.'
    },
    {
        description: 'Kiểm tra danh mục sản phẩm khi nhập data có trong cơ sở dữ liệu',
        query: 'iPhone',
        expectResults: true,
        expectedText: 'iPhone'
    },
    
];

module.exports = searchTestCases;