const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  console.log('进入了createOrder');
  const param = event.param;
  const {
    orderId,
    dishes,
    openId
  } = param;
   const res = await db.collection('orders').add({
      data: {
        _id:orderId,
        orderId,
        dishes,
        openId
      }
    });
    console.log('res',res);
    return true;
}
