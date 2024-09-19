const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const param = event.param;
  const {
    menuName,
    openid
  } = param;
  const menuId = openid + menuName
 
  return db.collection('menus').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      _id: menuId,
      menuId:menuId,
      name:menuName,
      openid
    }
  }).then(res => {
    console.log('创建菜单返回',res);
    return res;
  }).catch(res => res)
};
