// File này chỉ chứa dữ liệu test case cho chức năng tìm kiếm.

const registerTestCases = [
    {
      description: 'Đăng kí với địa chỉ email không đúng định dạng',
      emailInvalid: true,
      email: '113',
      password: '',
      expectedError: "Please include an '@' in the email address"
    },
    {
      description: 'Đăng kí với email đã tồn tại trong hệ thống',
      email: '123456@gmail.com',
      password: 'Test@12333',
      expectedError: 'tài khoản đã được đăng ký'
    },
    {
      description: 'Đăng kí với mật khẩu đơn giản',
      passwordInvalid: true,
      email: '12345b@gmail.com',
      password: '123456',
      expectedError: 'Vui lòng nhập mật khẩu khó hơn'
    },
    {
      description: 'Đăng kí với trường mật khẩu bỏ trống',
      email: '12345d@gmail.com',
      password: '',
      expectedError: 'Trường mật khẩu đang trống.'
    },
];

module.exports = registerTestCases;