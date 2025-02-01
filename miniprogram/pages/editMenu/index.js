const {
  envList
} = require("../../envList");
import { getOpenId } from '../../common/index';
import { fetchDishes } from '../../fetch/index';

Page({
  data: {
    menuName:'',
    menuData:[],
    typeList:[],
    showEditDish: false,
    currentDish: null,
    modalType: '' // 'add' 或 'edit'
  },

  onLoad(e) {
    console.log('eee',e);
    const menuId = e.menuId;
    // 第一次进入页面时就保存openId
    this.setData({menuId})
  },

  async render(menuId) {
    const dishData = await fetchDishes(menuId);
    console.log('dishDatadishData',dishData);
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

  async onShow() {
    const menuId = this.data.menuId;
    await this.render(menuId);
  },

  formSubmit(e) {
    console.log('eee',e);
    const {name} = e.detail.value;
    this.createMenu(name);

  },

  async createMenu(name) {
    console.log('createMenu--name',name);
    const openid = await getOpenId();
    console.log('openid',openid);
    const result = await wx.cloud.callFunction({
      name:'quickstartFunctions',
      data:{ type: 'createMenu',param:{openid,menuName:name} }
    });
    this.setData({menuName:name})
    console.log('result',result);
  },

  createDish() {
    const menuId = this.data.menuId;
    wx.navigateTo({
      url: `/pages/createDish/index?menuId=${menuId}`,
    })
  },
  finish() {
    wx.navigateBack();
  },
  updateMenuData() {
    console.log('父组件中updateMenuData');
    const menuId = this.data.menuId;
    this.render(menuId);
  },
  showAddDishModal() {
    this.setData({
      showEditDish: true,
      currentDish: null,
      modalType: 'add'
    });
  },
  showEditDishModal(e) {
    const dish = e.detail;
    this.setData({
      showEditDish: true,
      currentDish: dish,
      modalType: 'edit'
    });
  },
  hideEditDishModal() {
    this.setData({
      showEditDish: false,
      currentDish: null,
      modalType: ''
    });
  },
  onEditSuccess() {
    this.hideEditDishModal();
    this.render(this.data.menuId);
  }
});
