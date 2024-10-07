const {
  envList
} = require("../../envList");
import { getOpenId } from '../../common/index';
import {
  submitOrder,
  fetchDishes,
  fetchSharedDishes,
  collectMenu,
  fetchUser,
  fetchOpenId,
} from '../../fetch/index';
import { createOrder } from '../../fetch/order'
import { userRegister } from '../../common/index'

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
    showMenu:true,
    menuName:'',
    isOrdered:false,
    isOverlayVisible:false,
  },
  sharedId:'',
  menuId:'',

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
      typeList
    })
  },

  async onLoad(e) {
    const { menuId,sharedId,menuName} = e;
    const openid = await fetchOpenId();
    const app = getApp();
    // 为全局变量赋值
    app.globalData.openid = openid;
    console.log('sharedId',sharedId);
    console.log('menuId',menuId);
    if(sharedId) {
      console.log('33');
      const sharedDishesData = await fetchSharedDishes(sharedId);
      const dishes = sharedDishesData.result.dishes;
      console.log('dishes',dishes);
      if(dishes?.length > 0) {
        this.setData({isOrdered:true,orderList:dishes})
        return;
      } 
    }
 
    this.sharedId = sharedId;
    this.menuId = menuId;
    this.menuName = menuName;
    this.render(menuId);
  },

  async render(menuId) {
    console.log('menuIdmenuId',menuId);
    const dishData = await fetchDishes(menuId);
    console.log('dishData',dishData);
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
    console.log('menuMapmenuMap',menuMap);
    this.setData({menuData:menuMap,typeList})
  },

  add(e) {
    const {
      id,
      type
    } = e.currentTarget.dataset;
    const menuData = this.data.menuData;
    const dataList = menuData[type];
    const item = dataList.find(item => item.name == id);
    if (!item.count) {
      item.count = 1;
    } else {
      item.count++;
    };
    const addName = item.name;
    const orderList = this.data.orderList;
    if (!orderList.some(item => item.name === addName)) {
      orderList.push(item);
    }
    this.setData({
      menuData,
      orderList
    })
  },

  minus(e) {
    const {
      id,
      type
    } = e.currentTarget.dataset;
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
      orderList = orderList.filter(item => item.name !== deleteName)
    }
    this.setData({
      menuData,
      orderList
    })

  },

  closeModal() {
    this.setData({show:false})
  },
  updateOrderList(e) {
    const  orderList  = e.detail;
    console.log('orderList',orderList);
    this.setData({orderList})
  },
  updateMenuData(e) {
    const  menuData  = e.detail;
    console.log('menuData',menuData);
    this.setData({menuData})
  },
  async submitOrder() {
    console.log('orderList2',this.data.orderList);
    const orderId = this.menuId + new Date().getTime();
    const openId =  getOpenId();

    const res = await createOrder(orderId,this.data.orderList,openId);
    wx.navigateTo({
      url: `/pages/orderDetail/index?orderId=${orderId}`,
    })
  },

  popup() {
    this.setData({
      isOverlayVisible:true
    });

  },
  hideOverlay() {
    this.setData({
      isOverlayVisible:false
    });
  },
  async collect() {
    const openId =  getOpenId();
    const isRegisteredData = await fetchUser(openId);
    const isUser = isRegisteredData.result;
    if(isUser) {
    const data  = await collectMenu(openId,this.menuId,this.menuName);
    console.log('data--',data);
    if(data.result) {
      wx.showToast({
        title: '收藏成功！',
      })
    } else {
      wx.showToast({
        title: '请稍后重试',
        icon:'error'
      })
    }

    } else {
      userRegister(openId);
  
        // wx.showModal({
        //   title: '请注册',
        //   content: '用户名',
        //   editable:true,
        //   complete: async (res) => {
        //     if (res.confirm) {
        //       console.log('res',res);
        //       const result = await createUser(openId,res.content);
        //       console.log('result',result);
        //     }
        //   }
        // })
    }

  }

});
