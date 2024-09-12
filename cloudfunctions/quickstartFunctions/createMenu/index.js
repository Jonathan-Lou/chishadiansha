const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {

  console.log('eventevent', event);
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
      name:menuName
    }
  }).then(res => {
    return res;
  })

};
