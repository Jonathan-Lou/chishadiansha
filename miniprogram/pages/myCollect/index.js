const {
  envList
} = require("../../envList");
const {
  QuickStartPoints,
  QuickStartSteps
} = require("./constants");
import { getOpenId } from '../../common/index';
import { deleteMenu,fetchMenuList } from '../../fetch/index';



Page({
  data: {
    menus:null,
    menuList:[],
    sharedMenuId:'',
    loading:true
  },
  async onLoad() {
    const menuList =await this.getMenuList();
    this.setData({ menuList,loading:false })
  },

  async onShow() {
    const menuList = await this.getMenuList();
    this.setData({menuList,loading:false})
  },

  async getMenuList() {
    const openid = getOpenId();
    const menuListData  = await fetchMenuList(openid);
    const menuList = menuListData.result.data;
    return menuList;
  },

  createMenu() {
    wx.showModal({
      title: '请输入菜单名称',
      editable:true,
      content: '我的菜单',
      complete: async (res) => {
    
        if (res.confirm) {
          wx.showLoading({
            title: '创建中',
          })
          const menuName = res.content;
          console.log('menuName',menuName);
          console.log('this.data.menuList',this.data.menuList);
          // 本地先检查是否重名
          const allowCreate = !this.data.menuList.some(item => item.name === menuName);
          console.log('allowCreate',allowCreate);
          if(!allowCreate) {
            wx.showToast({
              title: '菜单名重复',
              icon: "error"
            });
            return;
          };
            const openid = getOpenId();
            const data = await wx.cloud.callFunction({
              name:'quickstartFunctions',
              data:{ type: 'createMenu',param:{ openid,menuName } }
            });
            if(data.result.errMsg === 'collection.add:ok') {
              wx.showToast({
                title: '创建成功',
                icon:'success',
                success: () => {
                  setTimeout(() => {
                    wx.navigateTo({
                      url: `/pages/createMenu/index?menuName=${menuName}`,
                    })
                  },1000)
               
                }
              });
        
            } else {
              wx.showToast({
                title: '系统异常',
                icon: "error"
              })
              return;
            }
        }
      }
    })
    // wx.navigateTo({
    //   url: '/pages/createMenu/index',
    // })
  },

  edit(e) {
    console.log('eeeeee',e);
    const menuId = e.currentTarget.dataset.menuId;
    wx.navigateTo({
      url: `/pages/editMenu/index?menuId=${menuId}`,
    })
  },

  share(e) {
    console.log('eeee',e);
    const sharedMenuId = e.currentTarget.dataset.menuId;
    this.setData({sharedMenuId})
  },

   delete(e) {
    wx.showModal({
      title: '确认删除吗',
      content: '删除后不可恢复',
      success: async(res) => {
        if (res.confirm) {
          const menuId = e.currentTarget.dataset.menuId;
          await deleteMenu(menuId);
          const menuList = await this.getMenuList();
          this.setData({menuList})
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  onShareAppMessage: function () {
    return {
      title: '吃啥点啥',
      path: `/pages/sharedMenu/index?menuId=${this.data.sharedMenuId}`,
    };
  },

});
