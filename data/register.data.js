const registerTestCases = [
    {
      id: 'DK_01',
      description: 'Đăng kí với địa chỉ email không đúng định dạng',
      emailInvalid: true,
      email: '113',
      password: '',
      expectedError: "Please include an '@' in the email address"
    },
    {
      id: 'DK_04',
      description: 'Đăng kí với email đã tồn tại trong hệ thống',
      email: '123456@gmail.com',
      password: 'Test@12333',
      expectedError: 'tài khoản đã được đăng ký'
    },
    {
      id: 'DK_03',
      description: 'Đăng kí với mật khẩu đơn giản',
      passwordInvalid: true,
      email: '12345b@gmail.com',
      password: '123456',
      expectedError: 'Vui lòng nhập mật khẩu khó hơn'
    },
    {
      id: 'DK_02',
      description: 'Đăng kí với trường mật khẩu bỏ trống',
      email: '12345e@gmail.com',
      password: '',
      expectedError: 'Trường mật khẩu đang trống.'
    },
];

module.exports = registerTestCases;