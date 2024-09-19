
const getOpenId =  () => {
  const app = getApp();
  const openid = app.globalData.openid;
  return openid;
};


module.exports = {
  getOpenId
}