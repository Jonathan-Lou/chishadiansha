const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  const { openId } = param;
  console.log('collectMenu--openId',openId);
  try {
    const user = await db.collection('user').doc(openId).get();
    return user ? true : false;
  } catch(e) {
    return false;
  }
}

