
const createOrder = require('./createOrder/index');
const fetchOrder = require('./fetchOrder/index');
const fetchOrderList = require('./fetchOrderList/index');


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'createOrder':
      return await createOrder.main(event, context);
    case 'fetchOrder':
      return await fetchOrder.main(event,context);
    case 'fetchOrderList':
      return await fetchOrderList.main(event,context)
  }
};
