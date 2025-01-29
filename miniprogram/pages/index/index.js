const { userRegister } = require("../../common/index");
const {
  envList
} = require("../../envList");
const {
  fetchOpenId,
  fetchUser
} = require("../../fetch/index");
Page({
  data: {
    userName: null
  },

  async onLoad() {
    const openid = await fetchOpenId();
    const app = getApp();
    // 为全局变量赋值
    app.globalData.openid = openid;
    console.log('app.globalData.openid', app.globalData.openid);
    const user = await fetchUser(openid);
    console.log('user--',user);
    // 如果用户id不存在，会返回result为false
    if(!user?.result) {
      try {
        const register = await userRegister(openid);
        console.log('register==',register)
        this.setData({
          username: register.userName
        });
      } catch(err) {
        console.error('注册失败:', err);
        wx.showToast({
          title: '注册失败,请重试',
          icon: 'error'
        });
      }
    } else {
      this.setData({
        username: user.result.data.userName
      });
    }
  },

  goCollection() {
    wx.navigateTo({
      url: '/pages/myCollect/index',
    })
  },

  viewMenu() {
    wx.navigateTo({
      url: '/pages/myMenu/index',
    })
  },
  choose() {
    wx.showModal({
      title: '敬请期待',
      content: '功能研发中',
    })
  },
});
