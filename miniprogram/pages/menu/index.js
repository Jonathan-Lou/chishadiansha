const { envList } = require("../../envList");
const { QuickStartPoints, QuickStartSteps } = require("./constants");
import { fetchMenu } from './mixin'


Page({
  data: {
    menuData:null,
    typeList:[],
    activeIndex:0
  },

  async onLoad() {
    const data = await fetchMenu();
    const menuData = data.result.dataList;
    const menuMap = {};
    menuData.forEach( item => {
      const type = item.type;
      if(!menuMap[type]) {
        menuMap[type] = [];
      }
      menuMap[type].push(item);
    });
    const typeList = Object.keys(menuMap);
    console.log('menuMap',menuMap);
    this.setData({menuData:menuMap,typeList})
  },

  clickType(e) {
    const index = e.currentTarget.dataset.index;
    console.log('activeIndex',index);
    this.setData({activeIndex:index})
  },

  add(e) {
    const {id,type} = e.currentTarget.dataset;
    const menuData = this.data.menuData;
    const dataList = menuData[type];
    const item = dataList.find(item => item.name == id);
    if(!item.count) {
      item.count = 1;
    } else {
      item.count ++;
    }
    this.setData({menuData})
    console.log('item',item);
    console.log('id',id);

  },

  minus(e) {
    const {id,type} = e.currentTarget.dataset;
    const menuData = this.data.menuData;
    const dataList = menuData[type];
    const item = dataList.find(item => item.name == id);
    if(!item.count) {
      item.count = 0;
    } else {
      item.count --;
    }
    this.setData({menuData})
    console.log('item',item);
    console.log('id',id);

  }

});
