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
    dishes,
    openId
  } = param;
  return db.collection('sharedMenus').doc(sharedId).update({
    // data 字段表示需新增的 JSON 数据
    data: {
      dishes
    }
  }).then(async res => {
    console.log('创建菜单返回',res);
    // 还要在订单列表新增一个订单
    console.log('openId',openId);
    const data = await cloud.callFunction({
      name: 'orderFunctions',
      data: {
        type: 'createOrder',
        param: {
          sharedId,
          dishes,
          openId,
          type:'shared'
        }
      }
    })
    console.log('data',data);
    return res;
  }).catch(res => res)
};
