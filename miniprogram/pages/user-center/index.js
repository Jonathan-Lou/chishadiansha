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
    username:''
  },

  async getUserInfo() {
    wx.showLoading({
      title: '',
    });
    const openId = await getOpenId();
    const user = await fetchUser(openId);
    wx.hideLoading();
    // 如果用户id不存在，说明没有注册
    if(!user?.result?.data?._id) {
      const register = await userRegister(openId);
      this.setData({username:register.userName})
    } else {
      this.setData({username:user.result.data.userName})
    }
  }
});
