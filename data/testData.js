module.exports = {
  loginTestCases: [
    {
      description: 'Login with invalid email',
      email: '😀',
      password: 'WrongPass',
      expectSuccess: false,
      expectedError: 'Hãy nhập đúng định dạng tên người dùng'
    },
    {
      description: 'Login with empty email',
      email: '',
      password: 'Test@123',
      expectSuccess: false,
      expectedError: 'Yêu cầu tên tài khoản.'
    },
    {
      description: 'Login with empty password',
      email: 'testuser@example.com',
      password: '',
      expectSuccess: false,
      expectedError: 'Trường mật khẩu đang trống.'
    },
    {
      description: 'Login with valid credentials',
      email: '123!@gmail.com',
      password: 'Test@12333',
      expectSuccess: true,
      expectedText: 'Xin chào'
    }
  ]
};