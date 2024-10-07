const { createSharedMenu } = require("../../fetch/index");

Component({
  data: {
    orderList: [],
  },
  properties: {
    menuList: Array,
    
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  methods: {
    edit(e) {
      const menuId = e.currentTarget.dataset.menuId;
      wx.navigateTo({
        url: `/pages/editMenu/index?menuId=${menuId}`,
      })
    },
  
    async share(e) {
      console.log('eeee',e);
      const sharedMenuId = e.currentTarget.dataset.menuId;
      const menuName = e.currentTarget.dataset.menuName;
      const sharedId = sharedMenuId + Date.now();
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

  }
});
