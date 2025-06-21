// File này chỉ chứa dữ liệu test case cho chức năng tìm kiếm.

const searchTestCases = [
    {
        id: 'TK_001',
        description: 'Kiểm tra hiển thị khi bỏ trống mục tìm kiếm',
        category: 'direct_search',
        data: { searchTerm: '' },
        alert: true,
        expectedResult: '',
        navigation: 'post_type=product'
    },
    {
        id: 'TK_002',
        description: 'Kiểm tra danh mục sản phẩm khi khi nhập data không có trong dữ liệu',
        category: 'direct_search',
        data: { searchTerm: 'abc' },
        alert: true,
        expectedResult: 'Không tìm thấy sản phẩm nào khớp với lựa chọn của bạn.',
    },
    {
        id: 'TK_003',
        description: 'Kiểm tra danh mục sản phẩm khi nhập data có trong cơ sở dữ liệu',
        category: 'direct_search',
        data: { searchTerm: 'iPhone' },
        expectedResult: 'iPhone',
    },
    {
        id: 'TK_004',
        description: 'Kiểm tra hiển thị gợi ý khi nhập tên sản phẩm đúng',
        category: 'suggestion',
        data: { searchTerm: 'iPhone' },
        expectedResult: 'iPhone'
    },
    {
        id: 'TK_005',
        description: 'Kiểm tra hiển thị “Không có sản phẩm nào” trong khung gợi ý khi nhập tên sản phẩm không có trong cửa hàng',
        category: 'suggestion',
        data: { searchTerm: 'abc' },
        expectedResult: 'Không có sản phẩm nào'
    },
    {
        id: 'TK_006',
        description: 'Kiểm tra hiển thị gợi ý khi nhập tên sản phẩm in hoa',
        category: 'comparison',
        data: { searchTerm1: 'IPHONE', searchTerm2: 'iphone'},
    },
    {
        id: 'TK_007',
        description: 'So sánh kết quả tìm kiếm khi nhập tên sản phẩm in hoa, in thường',
        category: 'comparison',
        data: { searchTerm1: 'IPHONE', searchTerm2: 'iphone'},
        press_search: true,
    },
    {
        id: 'TK_008',
        description: 'So sánh hiển thị gợi ý khi nhập tên sản phẩm có dấu, không dấu ',
        category: 'comparison',
        data: { searchTerm1: 'Túi xách chống sôc', searchTerm2: 'Tui xach chong soc'},
    },
    {
        id: 'TK_009',
        description: 'So sánh kết quả khi nhập tên sản phẩm có dấu, không dấu',
        category: 'comparison',
        data: { searchTerm1: 'Túi xách chống sôc', searchTerm2: 'Tui xach chong soc'},
        press_search: true,
    },
    {
        id: 'TK_010',
        description: 'Kiểm tra khi nhập tên sản phẩm quá dài (trên 32)',
        category: 'suggestion',
        data: { searchTerm: 'querttyuiopasdfghjklzxcvbnm12!@#$%^&*)<>?:”{}w' },
        expectedResult: 'Không có sản phẩm nào',
    },
    {
        id: 'TK_011',
        description: 'So sánh kết quả khi khi nhập tên sản phẩm có nhiều hơn 1 khoảng trắng',
        category: 'comparison',
        data: { searchTerm1: 'iphone 15', searchTerm2: 'iphone   15'},
        press_search: true,
    },
    {
        id: 'TK_012',
        description: 'So sánh hiển thị gợi ý khi nhập tên sản phẩm khi có nhiều hơn 1 khoảng trắng',
        category: 'comparison',
        data: { searchTerm1: 'iphone 15', searchTerm2: 'iphone   15'},
    },
    {
        id: 'TK_013',
        description: 'So sánh kết quả khi nhập tên sản phẩm không có khoảng trắng',
        category: 'comparison',
        data: { searchTerm1: 'iphone 15', searchTerm2: 'iphone15'},
        press_search: true,
    },
    {
        id: 'TK_014',
        description: 'So sánh hiển thị gợi ý khi nhập tên sản phẩm không có khoảng trắng',
        category: 'comparison',
        data: { searchTerm1: 'iphone 15', searchTerm2: 'iphone15'},
    },
    {
        id: 'TK_015',
        description: 'Kiểm tra phần lọc kế quả tìm kiếm theo giá',
        category: 'filter',
        data: { searchTerm: 'iphone', min_price: 10000000, max_price: 20000000},
    },
    {
        id: 'TK_016',
        description: 'Kiểm tra phần lọc kế quả tìm kiếm theo giá',
        category: 'filter',
        data: { searchTerm: 'iphone', min_price: 0, max_price: 20000000},
    },
    {
        id: 'TK_017',
        description: 'Kiểm tra phần lọc khi chọn tiêu chí không có',
        category: 'filter_none',
        expectedResult: 'Không tìm thấy sản phẩm nào khớp với lựa chọn',
        data: { searchTerm: 'iphone', cpu: 'Snapdragon'},
    },
    {
        id: 'TK_018',
        description: 'Kiểm tra khi nhấn xóa tất cả các tiêu chí lọc đã chọn',
        category: 'remove_filter',
        data: { searchTerm: 'iphone', min_price: 10000000, max_price: 20000000},
    },
    {
        id: 'TK_019',
        description: 'Kiểm tra sắp xép kết quả theo điểm đánh giá',
        category: 'rating',
        data: { searchTerm: 'iphone'},
    },
    {
        id: 'TK_020',
        description: 'Kiểm tra sắp xép kết quả theo điểm đánh giá tú thấp đến cao',
        category: 'price',
        order_by: 'price',
        data: { searchTerm: 'iphone'},
    },
    {
        id: 'TK_021',
        description: 'Kiểm tra sắp xép kết quả theo điểm đánh giá tú cao đến thấp',
        category: 'price',
        order_by: 'price-desc',
        data: { searchTerm: 'iphone'},
    },
];

module.exports = searchTestCases;