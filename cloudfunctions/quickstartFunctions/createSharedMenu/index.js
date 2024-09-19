const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const param = event.param;
  const {
    sharedId,
  } = param;
 
  return db.collection('sharedMenus').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      _id: sharedId,
      menuId:sharedId,
    }
  }).then(res => {
    return res;
  }).catch(res => res)
};
