const {
  envList
} = require("../../envList");
import { getOpenId } from '../../common/index';
import { fetchDishes,createSharedMenu } from '../../fetch/index';

Page({
  data: {
    menuName:'',
    menuData:[],
    typeList:[],
    showEditDish: false,
    currentDish: null,
    modalType: '', // 'add' 或 'edit'
    menuId: '',
  },

  onLoad(e) {
    const { menuId, menuName, modalType } = e;
    this.setData({ menuId, menuName, modalType });
    this.render(menuId);
  },

  async render(menuId) {
    const dishData = await fetchDishes(menuId);
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
    this.setData({ menuData: menuMap, typeList });
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
    const openid = await getOpenId();
    const result = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: { type: 'createMenu', param: { openid, menuName: name } }
    });
    this.setData({ menuName: name });
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
  },
  async share() {
    const sharedMenuId = this.data.menuId;
    const sharedId = sharedMenuId + Date.now();
    const menuName = this.data.menuName;
    this.sharedId = sharedId;
    this.sharedMenuId = sharedMenuId;
    this.menuName = menuName;
    const result = await createSharedMenu(sharedId);
    console.log('分享菜单创建结果:', result);
  },

  onShareAppMessage: function () {
    if (!this.sharedId || !this.sharedMenuId) {
      this.share();
    }
    return {
      title: '吃啥点啥',
      path: `/pages/sharedMenu/index?menuId=${this.sharedMenuId}&sharedId=${this.sharedId}&menuName=${this.menuName}`,
    };
  },
});
