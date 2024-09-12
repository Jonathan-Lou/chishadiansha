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
    knowledgePoints: QuickStartPoints,
    steps: QuickStartSteps,
    photoSrc: '',
    menuData:[]
  },
  async onLoad() {
    console.log('onload');
    const app = getApp();
    const openid = app.globalData.openid;
    const fetchData =  await fetchMenu(`${openid}menu`);
    console.log('fetchData',fetchData);

    const menuData  = fetchData.result || [];
    this.setData({menuData})
    console.log('menuData',menuData);
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
        console.log('res', res);
        console.log(res.tempFiles[0].tempFilePath)
        console.log(res.tempFiles[0].size)
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
    const app = getApp();
    const openid = app.globalData.openid;
    const cloudPath = `${openid}/images/menu-${Date.now()}.png`
console.log('cloudPath',cloudPath);
console.log('this.data.photoSrc',this.data.photoSrc);
   
    wx.cloud.uploadFile({
      cloudPath, // 上传至云端的路径
      filePath: this.data.photoSrc, // 小程序临时文件路径
      success: async (res) => {
        // 返回文件 ID
        console.log('fileID',res.fileID);
        const menu = this.data.menuData;
        const item = {name,type,img:res.fileID};
        menu.push(item);
        console.log('item',item);

        console.log('menu',menu);
        const result = await wx.cloud.callFunction({
          name:'quickstartFunctions',
          data:{ type: 'uploadMenu',param:{menu,id:`${openid}menu`} }
        });
        console.log('result',result);
        app.globalData.menuOnShow = true;
        wx.navigateBack()


      },
      fail: console.error
    });
    // wx.cloud.downloadFile({
    //   fileID: 'cloud://chishane-2gsirlz919069514.6368-chishane-2gsirlz919069514-1308342340/example.png', // 文件 ID
    //   success: res => {
    //     // 返回临时文件路径
    //     console.log('tempFilePath', res.tempFilePath)
    //   },
    //   fail: console.error
    // })

  }

});
