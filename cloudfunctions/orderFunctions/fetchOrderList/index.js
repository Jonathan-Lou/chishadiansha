const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  const {
    openId,
  } = param;
  const orders = await db.collection('orders').where({openId}).get();
    return orders;
}
