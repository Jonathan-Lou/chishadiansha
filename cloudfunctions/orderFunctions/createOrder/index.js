const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  console.log('进入了createOrder--event',event);
  console.log('进入了createOrder--context',context);
  const param = event.param;
  const {
    orderId,
    dishes,
    openId,
    type,
    sharedId
  } = param;
  const createTime = new Date().getTime();
   const res = await db.collection('orders').add({
      data: {
        _id:orderId,
        orderId,
        dishes,
        openId,
        createTime,
        type,
        sharedId
      }
    });
    console.log('res',res);
    return true;
}
