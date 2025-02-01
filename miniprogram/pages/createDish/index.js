const {
  envList
} = require("../../envList");
const {
  QuickStartPoints,
  QuickStartSteps
} = require("./constants");
import { getOpenId } from '../../common/index';

Page({
  data: {
    showEditDish: true,
    modalType: 'add',
    menuId: ''
  },

  onLoad(e) {
    const menuId = e.menuId;
    this.setData({ menuId });
  },

  onEditDishClose() {
    wx.navigateBack();
  },

  onEditDishSuccess() {
    const app = getApp();
    app.globalData.menuOnShow = true;
    wx.navigateBack();
  },

  onShow(e) {
  },

  takePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      sizeType:['compressed'],
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
    const {name, type, remark} = e.detail.value;
    if(!this.data.photoSrc) {
      wx.showToast({
        title: '照片未上传',
        icon:'error'
      });
      return;
    };
    if(!name || !type) {
      wx.showToast({
        title: '菜品名称/类型未填写',
        icon:'error'
      })
      return;
    }
    const openid = await getOpenId();
    const cloudPath = `${openid}/images/menu-${Date.now()}.png`
    wx.cloud.uploadFile({
      cloudPath,
      filePath: this.data.photoSrc,
      success: async (res) => {
        const result = await wx.cloud.callFunction({
          name:'quickstartFunctions',
          data:{ 
            type: 'createDish',
            param:{
              menuId: this.data.menuId,
              name,
              type,
              remark,
              img: res.fileID
            } 
          }
        });
        const app = getApp();
        app.globalData.menuOnShow = true;
        wx.navigateBack()
      },
      fail: console.error
    });
  }

});
