const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

exports.main = async (event, context) => {
  const param = event.param;
  const { id } = param;
  const result =  await db.collection('menus').doc(id).get().then( res => {
    return res;
  });
  console.log('result?.data?.menu',result?.data?.menu);
  return result?.data?.menu
};