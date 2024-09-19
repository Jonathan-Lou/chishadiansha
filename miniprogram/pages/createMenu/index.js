const {
  envList
} = require("../../envList");
import { getOpenId } from '../../common/index';
import { fetchDishes } from '../../fetch/index';



Page({
  data: {
    menuName:'',
    menuData:[],
    typeList:[]
  },

  onLoad(e) {
    console.log('eee',e);
    const { menuName } = e;
    this.setData({menuName})
  },

  async onShow() {
    const openid = getOpenId();
    const menuId = openid + this.data.menuName;
    const dishData = await this.fetchDishes(menuId);
    const dishes = dishData.result;
    const menuMap = {};
    dishes?.forEach(item => {
      const type = item.type;
      if (!menuMap[type]) {
        menuMap[type] = [];
      }
      menuMap[type].push(item);
    });
    const typeList = Object.keys(menuMap);
    this.setData({menuData:menuMap,typeList})
  },

  async fetchDishes(id) {
    const dishData = await fetchDishes(id);
    console.log('dishData2',dishData);
    return dishData;
  },

  formSubmit(e) {
    console.log('eee',e);
    const {name} = e.detail.value;
    this.createMenu(name);

  },

  async createMenu(name) {
    console.log('createMenu--name',name);
    const openid = getOpenId();
    console.log('openid',openid);
    const result = await wx.cloud.callFunction({
      name:'quickstartFunctions',
      data:{ type: 'createMenu',param:{openid,menuName:name} }
    });
    this.setData({menuName:name})
  },

  createDish() {
    const openid = getOpenId();
    const menuId = openid+this.data.menuName;
    wx.navigateTo({
      url: `/pages/createDish/index?menuId=${menuId}`,
    })
  },
  finish() {
    wx.showLoading({
      title: '正在创建',
    })
    wx.navigateTo({
      url: '/pages/myMenu/index',
    })
  }


});
