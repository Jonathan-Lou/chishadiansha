const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const param = event.param;
  console.log('paramparam',param);
  const {
    sharedId,
    dishes
  } = param;
  return db.collection('sharedMenus').doc(sharedId).update({
    // data 字段表示需新增的 JSON 数据
    data: {
      dishes
    }
  }).then(res => {
    console.log('创建菜单返回',res);
    return res;
  }).catch(res => res)
};
