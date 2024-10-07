
const { createUser } =require('../fetch/index')
const getOpenId = () => {
  const app = getApp();
  console.log('app',app);
  const openid = app.globalData.openid;
  return openid;
};

const userRegister = (openId) => {
  wx.showModal({
    title: '快速注册',
    content: '取一个用户名',
    editable:true,
    complete: async (res) => {
      if (res.confirm) {
        console.log('openId',openId);
        console.log('res',res);
        const result = await createUser(openId,res.content);
        console.log('result',result);
      }
    }
  })
}



module.exports = {
  getOpenId,
  userRegister
}