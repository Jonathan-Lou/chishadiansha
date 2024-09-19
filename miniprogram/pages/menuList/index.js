const { envList } = require("../../envList");
const { QuickStartPoints, QuickStartSteps } = require("./constants");


Page({
  data: {
    knowledgePoints: QuickStartPoints,
    steps: QuickStartSteps,
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

  copyCode(e) {
    const code = e.target?.dataset?.code || '';
    wx.setClipboardData({
      data: code,
      success: () => {
        wx.showToast({
          title: '已复制',
        })
      },
      fail: (err) => {
        console.error('复制失败-----', err);
      }
    })
  },

  discoverCloud() {
    wx.switchTab({
      url: '/pages/examples/index',
    })
  },

  gotoGoodsListPage() {
    wx.navigateTo({
      url: '/pages/goods-list/index',
    })
  },
   createMenu() {
    wx.navigateTo({
      url: '/pages/createMenu/index',
    })
  },

  viewMenu() {
    wx.navigateTo({
      url: '/pages/menu/index',
    })
  },

  help() {
    wx.navigateTo({
      url: '/pages/help/index',
    })
  }
});
