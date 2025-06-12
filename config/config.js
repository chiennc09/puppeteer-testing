module.exports = {
  baseUrl: 'https://2tmobile.com/', // Thay bằng URL thực tế
  validUser: {
    email: '123!@gmail.com',
    password: 'Test@12333'
  },
  inValidUser: {
    email: '😀',
    password: 'Test@12333'
  },
  newUser: {
    email: 'newuser' + Date.now() + '@example.com', // Tạo email duy nhất
    password: 'Test@123'
  },
  timeout: 30000 // Thời gian chờ tối đa (ms)
};