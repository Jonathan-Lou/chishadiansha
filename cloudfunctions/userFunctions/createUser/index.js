const cloud = require('wx-server-sdk');
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
  console.log('user22',user);
  if (!user) {
    await db.collection('user').add({
      data: {
        _id: openId,
        openId,
        userName
      }
    });
    return {userName,openId,success:true};
  } else {
    return {userName:user.result.data.userName,openId:user.result.data.openId,success:true};
  }
}
