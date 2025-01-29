const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

exports.main = async (event, context) => {
  const param = event.param;
  console.log('param---',param);
  const { sharedId } = param;
  const result =  await db.collection('sharedMenus').doc(sharedId).get().then( res => {
    return res;
  });
  console.log('sharedMenus--',result);
  return result?.data
};