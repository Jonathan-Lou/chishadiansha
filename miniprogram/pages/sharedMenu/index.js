const {
  envList
} = require("../../envList");
import {
  submitOrder,
  fetchDishes,
  fetchSharedDishes
} from '../../fetch/index'


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
  },
  sharedId:'',

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
    const { menuId,sharedId} = e;
    console.log('sharedId',sharedId);
    console.log('menuId',menuId);
    const sharedDishesData = await fetchSharedDishes(sharedId);
    const dishes = sharedDishesData.result.dishes;
    console.log('dishes',dishes);
    if(dishes?.length > 0) {
      this.setData({isOrdered:true,orderList:dishes})
      return;
    } 
    this.sharedId = sharedId;
    this.render(menuId);
  },

  async render(menuId) {
    console.log('menuIdmenuId',menuId);
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
  popup(e) {
    const position = e.currentTarget.dataset.position
    let customStyle = ''
    let duration = this.data.duration
    switch (position) {
      case 'top':
      case 'bottom':
        customStyle = 'height: 50%;'
        break
      case 'right':
        break
    }
    this.setData({
      position,
      show: true,
      customStyle,
      duration
    })
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
    const dishes = this.data.orderList?.map(item => {return {img:item.img,name:item.name,type:item.type,count:item.count}})
   const result = await submitOrder(this.sharedId,dishes);
   this.setData({isOrdered:true})
   console.log('result',result);
  }

});
