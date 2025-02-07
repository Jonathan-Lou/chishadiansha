const {
  envList
} = require("../../envList");
import { getOpenId,userRegister } from '../../common/index';
import { deleteMenu,fetchMenuList,createSharedMenu,fetchUser } from '../../fetch/index';


Page({
  data: {
    menus:null,
    menuList:[],
    isLoading: true,
    collectMenu:[],
  },
  sharedId:'',
  sharedMenuId:'',
  async onLoad() {
    try {
      wx.showLoading({ title: '加载中' });
      const [menuList,collectMenu] = await Promise.all([this.getMenuList(),this.getCollectList()]);
      console.log('menuList1',menuList);
      this.setData({ collectMenu,menuList,isLoading: false })
    } catch(err) {
      console.error('获取菜单列表失败:', err);
      this.setData({ isLoading: false });
    } finally {
      wx.hideLoading();
    }
  },

  async onShow() {
    const [menuList,collectMenu] = await Promise.all([this.getMenuList(),this.getCollectList()]);
    this.setData({menuList,collectMenu,loading:false})
  },

  async getMenuList() {
    const openid = await getOpenId();
    const menuListData = await fetchMenuList(openid);
    const menuList = menuListData.result.data;
    console.log('menuList',menuList);
    return menuList;
  },

  async getCollectList() {
    const openId = await getOpenId();
    console.log('openId',openId);
    const user = await fetchUser(openId);
    console.log('useruseruser--',user);
    let collectMenu;
    if(!user.result) {
      userRegister(openId);
    } else {
      console.log('user.result',user.result);
       collectMenu = user.result.data.userCollection;
      console.log('collectMenu',collectMenu);
    }
    return collectMenu;
  },

  createMenu() {
    if (this.data.isLoading) {
      wx.showToast({
        title: '加载中，请稍候',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '请输入菜单名称',
      editable: true,
      content: '我的菜单',
      complete: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '创建中',
          });
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
            const openid = await getOpenId();
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
                    const menuId = openid + menuName;
                    wx.navigateTo({
                      url: `/pages/editMenu/index?menuName=${menuName}&modalType=add&menuId=${menuId}`,
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

  },
  edit(e) {
    console.log('eeeeeee',e)
    const { menuId,menuName} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/editMenu/index?menuId=${menuId}&menuName=${menuName}`,
    })
  },

  async share(e) {
    console.log('eeee',e);
    const sharedMenuId = e.currentTarget.dataset.menuId;
    const sharedId = sharedMenuId + Date.now();
    const menuName = e.currentTarget.dataset.menuName;

    console.log('sharedId1',sharedId);
    this.sharedId = sharedId;
    this.sharedMenuId = sharedMenuId;
    this.menuName = menuName;
    const result  = await createSharedMenu(sharedId);
    console.log('result');
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
    console.log('sharedId2',this.sharedId);

    return {
      title: '吃啥点啥',
      path: `/pages/sharedMenu/index?menuId=${this.sharedMenuId}&sharedId=${this.sharedId}&menuName=${this.menuName}`,
    };
  },

  viewMenu(e) {
    const menuId = e.currentTarget.dataset.menuId;
    wx.navigateTo({
      url: `/pages/order/index?menuId=${menuId}&menuName=${this.menuName}`,
    })
  }

});
