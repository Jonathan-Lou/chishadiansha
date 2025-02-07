const { fetchUser } = require('../../fetch/index');
const { userRegister, getOpenId } = require('../../common/index')

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    showUploadTip: false,
    username: '',
    isLoading: true,
    isAuthorized: false
  },

  onLoad() {
    this.checkUserAuthorization();
    this.autoLogin();
  },

  checkUserAuthorization() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({ isAuthorized: true });
        } else {
          this.setData({ isAuthorized: false });
        }
      }
    });
  },

  async autoLogin() {
    try {
      await this.getUserInfo();
    } catch (error) {
      console.error('自动登录失败:', error);
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    }
  },

  async getUserInfo() {
    wx.showLoading({
      title: '登录中',
    });
    try {
      const openId = await getOpenId();
      const user = await fetchUser(openId);
      
      // 如果用户id不存在，说明没有注册
      if(!user?.result?.data?._id) {
        const register = await userRegister(openId);
        this.setData({
          username: register.userName,
          openId,
          isLoading: false
        });
      } else {
        this.setData({
          username: user.result.data.userName,
          openId,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    } finally {
      wx.hideLoading();
    }
  },

  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      this.setData({ isAuthorized: true });
      this.autoLogin(); // 用户授权后重新获取用户信息
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      });
    }
  }
});
