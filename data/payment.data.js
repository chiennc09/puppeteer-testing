const paymentTestCases = [
  {
    description: 'Thanh toán bằng Chuyển khoản ngân hàng',
    firstName: 'Hà',
    lastname: 'Thành',
    city: 'Hà Nội',
    address: 'Tân Triều, Thanh Trì, Hà Nội',
    apartment: 'Số 42, ngõ 39',
    phoneNumber: '0945634561',
    email: 'hathanh@example.com',
    paymentMethod: 'bacs',
    expectResults: true
  },
  {
    description: 'Thanh toán bằng Trả tiền khi nhận hàng',
    firstName: 'Hà',
    lastname: 'Thành',
    city: 'Hà Nội',
    address: 'Tân Triều, Thanh Trì, Hà Nội',
    apartment: 'Số 42, ngõ 39',
    phoneNumber: '0945634561',
    email: 'hathanh@example.com',
    paymentMethod: 'cod',
    expectResults: true
  },
  {
    description: 'Thanh toán bằng Trả góp qua PayOn',
    firstName: 'Hà',
    lastname: 'Thành',
    city: 'Hà Nội',
    address: 'Tân Triều, Thanh Trì, Hà Nội',
    apartment: 'Số 42, ngõ 39',
    phoneNumber: '0945634561',
    email: 'hathanh@example.com',
    paymentMethod: 'payon',
    expectResults: true
  },
  {
    description: 'Thanh toán bằng Thanh toán online qua ATM, Visa, QR',
    firstName: 'Hà',
    lastname: 'Thành',
    city: 'Hà Nội',
    address: 'Tân Triều, Thanh Trì, Hà Nội',
    apartment: 'Số 42, ngõ 39',
    phoneNumber: '0945634561',
    email: 'hathanh@example.com',
    paymentMethod: 'payon_paynow',
    expectResults: true
  },
    {
    description: 'Thanh toán khi dùng mã giảm giá 100K',
    firstName: 'Hà',
    lastname: 'Thành',
    city: 'Hà Nội',
    address: 'Tân Triều, Thanh Trì, Hà Nội',
    apartment: 'Số 42, ngõ 39',
    phoneNumber: '0945634561',
    email: 'hathanh@example.com',
    paymentMethod: 'cod',
    expectResults: true,
    expectedTotal: '35.400.000'
    },
    {
    description: 'Thanh toán khi không dùng mã giảm giá',
    firstName: 'Hà',
    lastname: 'Thành',
    city: 'Hà Nội',
    address: 'Tân Triều, Thanh Trì, Hà Nội',
    apartment: 'Số 42, ngõ 39',
    phoneNumber: '0945634561',
    email: 'hathanh@example.com',
    paymentMethod: 'cod',
    expectResults: true,
    removeCoupon: true,
    expectedTotal: '35.500.000'
    }

];

module.exports = paymentTestCases;
