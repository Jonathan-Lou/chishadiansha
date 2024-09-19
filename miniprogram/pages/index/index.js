const { envList } = require("../../envList");
Page({
  data: {
  },

  async onLoad() {
    const data = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      }
    })
    const openid = data.result.openid;
    const app = getApp();
    // 为全局变量赋值
    app.globalData.openid = openid;
    console.log('app.globalData.openid',app.globalData.openid);
  },

   goOrder() {
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
