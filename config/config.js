const baseUrl = `https://2tmobile.com`; 

module.exports = {
  baseUrl: baseUrl, // Thay bằng URL thực tế
  orderUrl: `${baseUrl}/thanh-toan/`, 
  orderReceived: '/order-received',
  cartUrl: `${baseUrl}/gio-hang/`, 
  timeout: 30000 // Thời gian chờ tối đa (ms)
};