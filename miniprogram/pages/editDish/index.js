import { getOpenId } from '../../common/index';
import { fetchDish,updateDish } from '../../fetch/index';


Page({
  data: {
    photoSrc: '',
    menuData:[],
    isNewPhoto:false,
    menuId:'',
    dishData:null,
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
      sizeType:['compressed'],
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
    const {name, type, remark} = e.detail.value;
    const openid = await getOpenId();
    const cloudPath = `${openid}/images/menu-${Date.now()}.png`
    const {dishId, img} = this.data.dishData;
    
    if(this.data.isNewPhoto) {
      wx.cloud.uploadFile({
        cloudPath,
        filePath: this.data.photoSrc,
        success: async (res) => {
          const result = updateDish({
            name,
            type,
            remark,
            dishId,
            img: res.fileID
          });
          console.log('result1',result);
          wx.navigateBack()
        },
        fail: console.error
      });
    } else {
      const result = updateDish({
        name,
        type,
        remark,
        dishId,
        img
      });
      console.log('result2',result);
      wx.navigateBack()
    }
  }

});
