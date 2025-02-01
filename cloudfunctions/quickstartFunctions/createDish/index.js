const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  const {
    menuId,
    name,
    type,
    remark,
    img
  } = param;
  const dishId = menuId+name;
  console.log('dishId',dishId);
  console.log('param',param);
  return db.collection('dishes').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      _id:dishId,
      dishId,
      menuId,
      name,
      type,
      remark,
      img
    }
  }).then(res => {
    console.log('createDish',res);
    return res;
  })
}

