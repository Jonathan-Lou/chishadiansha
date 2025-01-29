const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  const {
    dishId,
  } = param;
  console.log('dishId',dishId);
  return db.collection('dishes').doc(dishId).remove().then(res => {
    return res;
  })
}

