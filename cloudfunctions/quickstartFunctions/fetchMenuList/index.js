const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const param = event.param;
  const {
    openid
  } = param;

  const result = await db.collection('menus').where({
    openid,
  }).get().then(res => {
    return res;
  });
  return result;
};
