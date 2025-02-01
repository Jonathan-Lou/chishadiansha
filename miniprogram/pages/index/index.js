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
    userName: null,
    isLoading: true
  },

  async onLoad() {
    try {
      wx.showLoading({ title: '加载中' });
      
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
            username: register.userName,
            isLoading: false
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
          username: user.result.data.userName,
          isLoading: false
        });
      }
    } catch(err) {
      console.error('获取用户信息失败:', err);
      this.setData({ isLoading: false });
    } finally {
      wx.hideLoading();
    }
  },

  goCollection() {
    wx.navigateTo({
      url: '/pages/myCollect/index',
    })
  },

  viewMenu() {
    if (this.data.isLoading) {
      wx.showToast({
        title: '加载中，请稍候',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/myMenu/index',
    })
  },
  choose() {
    if (this.data.isLoading) {
      wx.showToast({
        title: '加载中，请稍候',
        icon: 'none'
      });
      return;
    }
    wx.showModal({
      title: '敬请期待',
      content: '功能研发中',
    })
  },
});
