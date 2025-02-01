const {
  envList
} = require("../../envList");
import { getOpenId } from '../../common/index';
import { fetchDishes } from '../../fetch/index';



Page({
  data: {
    menuName:'',
    menuData:[],
    typeList: [],
    showEditDish: false,
    modalType: 'add',
    menuId: '',
    isSubmitting: false
  },

  async onLoad(e) {
    const { menuName } = e;
    const openid = await getOpenId();
    const menuId = openid + menuName;
    
    this.setData({ 
      menuName,
      menuId  // 保存 menuId
    });
    
    await this.loadMenuData(menuId);
  },

  async loadMenuData(menuId) {
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
    if (this.data.menuId) {
      await this.loadMenuData(this.data.menuId);
    }
  },

  showAddDishModal() {
    this.setData({
      showEditDish: true,
      modalType: 'add'
    });
  },

  hideEditDishModal() {
    this.setData({
      showEditDish: false
    });
  },

  onEditSuccess() {
    this.hideEditDishModal();
    this.loadMenuData(this.data.menuId);
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
  },

  async createDish() {
    const openid = await getOpenId();
    const menuId = openid+this.data.menuName;
    wx.navigateTo({
      url: `/pages/createDish/index?menuId=${menuId}`,
    })
  },
  async finish() {
    if (this.data.isSubmitting) {
      return;
    }

    try {
      this.setData({ isSubmitting: true });
      wx.showLoading({
        title: '正在创建',
        mask: true
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      wx.hideLoading();
      wx.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/myMenu/index'
            });
          }, 1500);
        }
      });
    } catch (err) {
      console.error('创建失败:', err);
      wx.hideLoading();
      wx.showToast({
        title: '创建失败',
        icon: 'error'
      });
    } finally {
      this.setData({ isSubmitting: false });
    }
  }


});
