const {
  envList
} = require("../../envList");
const {
  QuickStartPoints,
  QuickStartSteps
} = require("./constants");
import { getOpenId } from '../../common/index';
import { fetchDish,updateDish } from '../../fetch/index';


Page({
  data: {
    knowledgePoints: QuickStartPoints,
    steps: QuickStartSteps,
    photoSrc: '',
    menuData:[],
    isNewPhoto:false,
    menuId:'',
    dishData:null

  },
  async onLoad(e) {
    const dishId = e.dishId;
    const data = await fetchDish(dishId);
    const dishData = data.result;
    console.log('dishData',dishData);
    this.setData({dishData,photoSrc:dishData.img})
  },

  takePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: (res) => {
        this.setData({
          photoSrc: res.tempFiles[0].tempFilePath,
          isNewPhoto:true
        })
      }
    })
  },
 
  async formSubmit(e) {
    const {name,type} = e.detail.value;
    const openid = getOpenId();
    const cloudPath = `${openid}/images/menu-${Date.now()}.png`
    const {dishId,img} = this.data.dishData;
    if(this.data.isNewPhoto) {
      wx.cloud.uploadFile({
        cloudPath, // 上传至云端的路径
        filePath: this.data.photoSrc, // 小程序临时文件路径
        success: async (res) => {
          // 返回文件 ID
        const result = updateDish({name,type,dishId,img})
          console.log('result1',result);
        //   const app = getApp();
        //  app.globalData.menuOnShow = true;
          wx.navigateBack()
        },
        fail: e => {
          console.log('e',e);
        }
      });
    }  else {
        const result = updateDish({name,type,dishId,img})
        console.log('result2',result);
        wx.navigateBack()
    }

  }

});
