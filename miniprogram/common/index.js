
const { createUser, fetchOpenId } =require('../fetch/index')
const getOpenId = async () => {
  const app = getApp();
  let openid = app.globalData.openid;
  
  if (!openid) {
    // 如果全局没有 openid，主动获取
    openid = await fetchOpenId();
    app.globalData.openid = openid;
  }
  
  return openid;
};

const userRegister = (openId) => {
  return new Promise((resolve,reject) => {
    wx.showModal({
      title: '快速注册',
      content: '取一个用户名',
      editable:true,
      complete: async (res) => {
        if (res.confirm) {
          console.log('openId',openId);
          console.log('res',res);
          const userRes = await createUser(openId,res.content);
          console.log('userResuserRes',userRes);
          resolve({ userName:userRes.result.userName })
        }
      }
    })
  })

}



module.exports = {
  getOpenId,
  userRegister
}