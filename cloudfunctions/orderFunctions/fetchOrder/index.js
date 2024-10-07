const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  console.log('进入fetchOrder');
  const param = event.param;
  const {
    orderId,
  } = param;
  const dishes = await db.collection('orders').doc(orderId).get();
    return dishes;
}
