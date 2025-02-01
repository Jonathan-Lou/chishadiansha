import {
  getOpenId
} from '../../common/index';
import {updateDish} from '../../fetch/index'

const ALLOWED_IMAGE_TYPES = ['image'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

Component({
  data: {
    photoSrc: '',
    menuData: [],
    menuId: '',
    newDishData: null,
    isUploading: false
  },
  properties: {
    dishData: {
      type: Object,
      observer: function(newVal) {
        console.log('newVal',newVal)
        if(newVal) {
          this.setData({
            photoSrc: newVal.img
          });
        }
      }
    },
    pageType: {
      type: String,
      value: 'create'
    },
    menuId: String,
    visible: {
      type: Boolean,
      value: false,
      observer(newVal) {
        if (!newVal) {
          this.resetForm();
        }
      }
    },
  },
  lifetimes: {
    attached: function () {
      console.log('visible', this.properties.visible)
      console.log('dishData222', this.properties.dishData)
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    takePhoto() {
      wx.chooseMedia({
        count: 1,
        mediaType: ALLOWED_IMAGE_TYPES,
        sourceType: ['album', 'camera'],
        sizeType: ['compressed'],
        success: (res) => {
          const tempFile = res.tempFiles[0];
          
          // 检查文件大小
          if(tempFile.size > MAX_IMAGE_SIZE) {
            wx.showToast({
              title: '图片大小不能超过2MB',
              icon: 'none'
            });
            return;
          }

          this.setData({
            photoSrc: tempFile.tempFilePath
          });
        },
        fail: (err) => {
          wx.showToast({
            title: '选择图片失败',
            icon: 'error'
          });
        }
      });
    },
    async uploadImage(filePath) {
      const openid = await getOpenId();
      const cloudPath = `${openid}/images/menu-${Date.now()}.png`;
      
      try {
        const res = await wx.cloud.uploadFile({
          cloudPath,
          filePath
        });
        return res.fileID;
      } catch(err) {
        throw new Error('图片上传失败');
      }
    },
    async formSubmit(e) {
      try {
        const { name, type, remark } = e.detail.value;
        
        if(!this.validateForm(name, type)) {
          return;
        }

        this.setData({ isUploading: true });
        
        let imgFileId = this.data.photoSrc;
        if(this.data.photoSrc && this.data.photoSrc !== this.properties.dishData?.img) {
          imgFileId = await this.uploadImage(this.data.photoSrc);
        }

        const dishData = {
          name,
          type,
          remark,
          img: imgFileId,
          menuId: this.properties.menuId
        };

        if(this.properties.pageType === 'edit') {
          // 编辑菜品
          dishData.dishId = this.properties.dishData.dishId;
          await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
              type: 'updateDish',
              param: dishData
            }
          });
        } else {
          // 添加菜品
          await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
              type: 'createDish',
              param: dishData
            }
          });
        }

        wx.showToast({
          title: this.properties.pageType === 'edit' ? '修改成功' : '添加成功',
          icon: 'success'
        });

        this.triggerEvent('success');
        this.triggerEvent('close');
      } catch(err) {
        console.error(err);
        wx.showToast({
          title: '操作失败',
          icon: 'error'
        });
      } finally {
        this.setData({ isUploading: false });
      }
    },
    validateForm(name, type) {
      if(!this.data.photoSrc) {
        wx.showToast({
          title: '请上传菜品图片',
          icon: 'none'
        });
        return false;
      }

      if(!name || !type) {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return false;
      }

      return true;
    },
    onClose() {
      this.resetForm();
      this.triggerEvent('close');
    },
    preventDefault() {
      // 阻止冒泡，防止点击内容区域关闭弹窗
      return;
    },
    resetForm() {
      this.setData({
        photoSrc: '',
        isUploading: false
      });
    },
  }
});
