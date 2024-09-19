const {
  envList
} = require("../../envList");
const {
  QuickStartPoints,
  QuickStartSteps
} = require("./constants");
import { getOpenId } from '../../common/index';
import {
  fetchMenu
} from './mixin'

Page({
  data: {
    knowledgePoints: QuickStartPoints,
    steps: QuickStartSteps,
    photoSrc: '',
    menuData:[],
    menuId:''

  },
  async onLoad(e) {
    console.log('eeeeee',e);
    const menuId = e.menuId;
    this.setData({menuId})
   
  },

  onShow(e) {
  },

  takePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: (res) => {
        this.setData({
          photoSrc: res.tempFiles[0].tempFilePath
        })
      }
    })
  },
  uploadImage(imageSrc) {
    wx.uploadFile({
      url: 'https://your-server-url/upload', // 替换为您的上传接口
      filePath: imageSrc,
      name: 'file',
      success: (res) => {
        console.log('上传成功:', res);
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('上传失败:', err);
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      }
    });
  },
  async formSubmit(e) {
    console.log('eee', e);
    const {name,type} = e.detail.value;
    if(!this.data.photoSrc) {
      wx.showToast({
        title: '照片未上传',
        icon:'error'
      });
    return;
    };
    if(!name || !type ) {
      wx.showToast({
        title: '菜品名称/类型未填写',
        icon:'error'
      })
      return;
    }
    const openid = getOpenId();
    const cloudPath = `${openid}/images/menu-${Date.now()}.png`
    wx.cloud.uploadFile({
      cloudPath, // 上传至云端的路径
      filePath: this.data.photoSrc, // 小程序临时文件路径
      success: async (res) => {
        // 返回文件 ID
        const result = await wx.cloud.callFunction({
          name:'quickstartFunctions',
          data:{ type: 'createDish',param:{menuId:this.data.menuId,name,type,img:res.fileID} }
        });
        console.log('result',result);
        const app = getApp();
       app.globalData.menuOnShow = true;
        wx.navigateBack()
      },
      fail: console.error
    });

  }

});
