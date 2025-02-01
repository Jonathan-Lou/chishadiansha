const {
  envList
} = require("../../envList");
const {
  QuickStartPoints,
  QuickStartSteps
} = require("./constants");
import { getOpenId,userRegister } from '../../common/index';
import { deleteMenu,fetchMenuList, fetchUser } from '../../fetch/index';



Page({
  data: {
    collectMenu:null
  },
  async onLoad() {
    const openId = await getOpenId();
    console.log('openId',openId);
    const user = await fetchUser(openId);
    if(!user.result) {
      userRegister(openId);
    } else {
      console.log('user.result',user.result);
      const collectMenu = user.result.data.userCollection;
      console.log('collectMenu',collectMenu);
      this.setData({collectMenu})
    }
  },
  view(e) {
    console.log('eee',e);
    const menuId = e.currentTarget.dataset.menuId;
    wx.navigateTo({
      url: `/pages/order/index?menuId=${menuId}&menuName=${this.menuName}`,
    })
  }

});
