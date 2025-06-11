module.exports = {
  loginTestCases: [
    {
      description: 'Đăng nhập với tài khoản để trống',
      email: '',
      password: 'Test@12333',
      expectSuccess: false,
      expectedError: 'Yêu cầu tên tài khoản.'
    },
    {
      description: 'Đăng nhập với mật khẩu để trống',
      email: 'testuser@example.com',
      password: '',
      expectSuccess: false,
      expectedError: 'Trường mật khẩu đang trống.'
    },
    {
      description: 'Đăng nhập với tài khoản là emoij',
      email: '😀',
      password: 'Test@12333',
      expectSuccess: false,
      expectedError: 'Hãy nhập đúng định dạng tên người dùng'
    },
    {
      description: 'Đăng nhập với tài khoản chứa khoảng trắng',
      email: 'ch  ie n',
      password: 'Test@12333',
      expectSuccess: false,
      expectedError: 'Tên đăng nhập không được chứa khoảng trắng'
    },
    {
      description: 'Mật khẩu dưới 8 ký tự',
      email: '123!@gmail.com',
      password: '1',
      expectSuccess: false,
      expectedError: 'Mật khẩu phải từ 8 ký tự trở lên'
    },
    {
      description: 'Đăng nhập với tài khoản và mật khẩu hợp lệ có trong hệ thống',
      email: '123!@gmail.com',
      password: 'Test@12333',
      expectSuccess: true,
      expectedText: 'Xin chào'
    }
  ]
};