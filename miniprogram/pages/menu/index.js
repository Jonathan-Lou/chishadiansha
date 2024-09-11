const {
  envList
} = require("../../envList");
const {
  QuickStartPoints,
  QuickStartSteps
} = require("./constants");
import {
  fetchMenu
} from './mixin'


Page({
  data: {
    menuData: null,
    typeList: [],
    activeIndex: 0,
    position:null,
    show: false,
    customStyle:null,
    duration:1000,
    orderList:[]
  },

  async onLoad() {
    console.log('33');
    const data = await fetchMenu();
    console.log('22',data);
    const menuData = data.result;
    const menuMap = {};
    menuData.forEach(item => {
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
  createDish() {
    wx.navigateTo({
      url: '/pages/createDish/index',
    })
  },
  clickType(e) {
    const index = e.currentTarget.dataset.index;
    console.log('activeIndex', index);
    this.setData({
      activeIndex: index
    })
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
    const orderList =this.data.orderList;
    console.log('addName',addName);
    console.log('index',orderList.indexOf(item => item.name === addName));

    if(!orderList.some(item => item.name === addName) ) {
      orderList.push(item);
    }
    console.log('orderList',orderList);
    
    this.setData({
      menuData,
      orderList
    })
    console.log('item', item);
    console.log('id', id);

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
    if(!item.count) {
      const deleteName = item.name;
       orderList = orderList.filter(item => item.name !== deleteName)
    }
    console.log('orderList',orderList);
    this.setData({
      menuData,
      orderList
    })

  },
  popup(e) {
    const position = e.currentTarget.dataset.position
    let customStyle = ''
    let duration = this.data.duration
    switch(position) {
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

});
