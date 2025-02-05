const { envList } = require('../../envList');
import { getOpenId } from '../../common/index';
import {
  submitOrder,
  fetchDishes,
  fetchSharedDishes,
  collectMenu,
  fetchUser,
  createUser,
} from '../../fetch/index';
import { userRegister } from '../../common/index';

Page({
  data: {
    menuData: null,
    typeList: [],
    activeIndex: 0,
    position: null,
    show: false,
    customStyle: null,
    duration: 1000,
    orderList: [],
    showMenu: true,
    menuName: '',
    isOrdered: false,
    isOverlayVisible: false,
    userInfo: null,
    isSubmitting: false,
  },
  sharedId: '',
  menuId: '',

  async fetchMenuList() {
    const app = getApp();
    const openid = app.globalData.openid;
    const menuListData = await fetchMenuList(openid);
    return menuListData.result.data;
  },

  async fetchData(id) {
    // const data = await fetchMenu(id);
    const data = await fetchDishes(id);
    const menuData = data.result;
    const menuMap = {};
    menuData?.forEach(item => {
      const type = item.type;
      if (!menuMap[type]) {
        menuMap[type] = [];
      }
      menuMap[type].push(item);
    });
    const typeList = Object.keys(menuMap);
    console.log('menuMap', menuMap);
    this.setData({
      menuData: menuMap,
      typeList,
    });
  },

  async onLoad(options) {
    try {
      // 先获取用户信息
      const openid = await getOpenId();
      console.log('openid====', openid);
      const userRes = await fetchUser(openid);
      console.log('userRes====', userRes);

      if (!userRes?.result) {
        // 用户未注册，弹出注册框
        wx.showModal({
          title: '请输入用户名',
          editable: true,
          placeholderText: '请输入您的名字',
          success: async res => {
            if (res.confirm) {
              if (!res.content) {
                wx.showToast({
                  title: '用户名不能为空',
                  icon: 'error',
                });
                wx.navigateBack();
                return;
              }

              // 注册用户
              const registerRes = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                  type: 'createUser',
                  param: {
                    openid,
                    userName: res.content,
                  },
                },
              });

              this.setData({
                userInfo: registerRes.result,
              });

              // 注册成功后继续加载菜单数据
              this.loadMenuData(options);
            } else {
              // 用户取消注册，返回上一页
              wx.navigateBack();
            }
          },
        });
      } else {
        // 用户已注册，直接设置用户信息并加载菜单
        this.setData({
          userInfo: userRes.result.data,
        });
        this.loadMenuData(options);
      }
    } catch (err) {
      console.error('获取用户信息失败:', err);
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'error',
      });
      wx.navigateBack();
    }
  },

  // 封装加载菜单数据的方法
  async loadMenuData(options) {
    const { menuId, menuName, sharedId } = options;
    this.sharedId = sharedId;
    this.menuId = menuId;
    this.menuName = menuName;

    // 如果有 sharedId，先检查是否已经下单
    if (sharedId) {
      try {
        const sharedDishesData = await fetchSharedDishes(sharedId);
        console.log('sharedDishesData', sharedDishesData);
        const dishes = sharedDishesData.result.dishes;
        if (dishes?.length > 0) {
          this.setData({
            isOrdered: true,
            orderList: dishes,
            menuName,
          });
          return;
        }
      } catch (err) {
        console.error('获取已点菜品失败:', err);
        wx.showToast({
          title: '获取菜品失败',
          icon: 'error',
        });
      }
    }

    await this.render(menuId);
  },

  async render(menuId) {
    console.log('menuIdmenuId', menuId);
    const dishData = await fetchDishes(menuId);
    console.log('dishData', dishData);
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
    console.log('menuMapmenuMap', menuMap);
    this.setData({ menuData: menuMap, typeList });
  },

  add(e) {
    const { id, type } = e.currentTarget.dataset;
    const menuData = this.data.menuData;
    const dataList = menuData[type];
    const item = dataList.find(item => item.name == id);
    if (!item.count) {
      item.count = 1;
    } else {
      item.count++;
    }
    const addName = item.name;
    const orderList = this.data.orderList;
    if (!orderList.some(item => item.name === addName)) {
      orderList.push(item);
    }
    this.setData({
      menuData,
      orderList,
    });
  },

  minus(e) {
    const { id, type } = e.currentTarget.dataset;
    const menuData = this.data.menuData;
    const dataList = menuData[type];
    const item = dataList.find(item => item.name == id);
    if (!item.count) {
      item.count = 0;
    } else {
      item.count--;
    }
    let orderList = this.data.orderList;
    if (!item.count) {
      const deleteName = item.name;
      orderList = orderList.filter(item => item.name !== deleteName);
    }
    this.setData({
      menuData,
      orderList,
    });
  },

  closeModal() {
    this.setData({ show: false });
  },
  updateOrderList(e) {
    const orderList = e.detail;
    console.log('orderList', orderList);
    this.setData({ orderList });
  },
  updateMenuData(e) {
    const menuData = e.detail;
    console.log('menuData', menuData);
    this.setData({ menuData });
  },
  async submitOrder() {
    if (this.data.isSubmitting) {
      return;
    }

    try {
      this.setData({ isSubmitting: true });
      wx.showLoading({ title: '提交中' });
      console.log('orderListorderList===', this.data.orderList);

      const openid = await getOpenId();
      const result = await submitOrder(this.sharedId, this.data.orderList,openid);

      if (result.result) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          success: () => {
            this.setData({
              isOrdered: true,
            });
          },
        });
      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'error',
        });
      }
    } catch (err) {
      console.error('提交订单失败:', err);
      wx.showToast({
        title: '提交失败',
        icon: 'error',
      });
    } finally {
      wx.hideLoading();
      this.setData({ isSubmitting: false });
    }
  },

  popup() {
    this.setData({
      isOverlayVisible: true,
    });
  },
  hideOverlay() {
    this.setData({
      isOverlayVisible: false,
    });
  },
  async collect() {
    const openId = await getOpenId();
    const isRegisteredData = await fetchUser(openId);
    const isUser = isRegisteredData.result;
    if (isUser) {
      const data = await collectMenu(openId, this.menuId, this.menuName);
      console.log('data--', data);
      if (data.result) {
        wx.showToast({
          title: '收藏成功！',
        });
      } else {
        wx.showToast({
          title: '请稍后重试',
          icon: 'error',
        });
      }
    } else {
      userRegister(openId);
    }
  },
});
