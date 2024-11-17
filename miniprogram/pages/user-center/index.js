const { fetchUser } = require('../../fetch/index');
const { userRegister } = require('../../common/index')

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    showUploadTip: false,
    username:''
  },

  async getUserInfo() {
    wx.showLoading({
      title: '',
    });
    const openid = await fetchOpenId();
    console.log('openid',openid);
    const user = await fetchUser(openid);
    wx.hideLoading();
    // 如果用户id不存在，说明没有注册
    if(!user?.result?.data?._id) {
      const register = await userRegister(openid);
      this.setData({username:register.userName})
    } else {
      this.setData({username:user.result.data.userName})
    }
  }
});
