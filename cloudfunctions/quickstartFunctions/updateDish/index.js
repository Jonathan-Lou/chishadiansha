const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  console.log('param',param);
  const {
    dishId,
    name,
    type,
    img
  } = param;
  console.log('dishId',dishId);
  return db.collection('dishes').doc(dishId).update({
    // data 字段表示需新增的 JSON 数据
    data: {
      name:name,
      type,
      img
    }
  }).then(res => {
    return res;
  })
}

