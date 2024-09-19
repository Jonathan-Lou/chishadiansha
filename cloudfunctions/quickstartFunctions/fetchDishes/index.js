const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const param = event.param;
  const { menuId } = param;
  const result =  await db.collection('dishes').where({menuId}).get().then( res => {
    return res;
  });
  console.log('fetchDishes--',result);
  return result?.data
};