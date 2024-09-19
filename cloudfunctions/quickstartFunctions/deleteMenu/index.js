const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  const {
    menuId,
  } = param;
  console.log('aa',menuId);
  console.log('查找---',db.collection('menus').doc(menuId).get());
  return db.collection('menus').doc(menuId).remove().then(res => {
    return res;
  })
}

