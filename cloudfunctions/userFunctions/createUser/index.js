const cloud = require('wx-server-sdk');
const fetchUser = require('../fetchUser/index')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  const {
    openId,
    userName
  } = param;
  console.log('collectMenu--openId', openId);
  console.log('collectMenu--userName', userName);
  let user;
  try {
     user = await db.collection('user').doc(openId).get();
  } catch(e) {
    user = null;
  }
  console.log('user',user);
  if (!user) {
    await db.collection('user').add({
      data: {
        _id: openId,
        openId,
        userName
      }
    });
    return true;
  } else {
    return false;
  }
}
