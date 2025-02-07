const { deleteDish } = require("../../fetch/index");

Component({
  data: {
    orderList: [],
  },
  properties: {
    typeList: Array,
    menuData: Object,
    orderList:Array,
    activeIndex: Number,
    type:String,
    updateMenuData:Function,
    updateOrderList:Function,
    showAddDishModal:Function
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
    clickType(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        activeIndex: index
      })
    },
    add(e) {
      const {
        id,
        type
      } = e.currentTarget.dataset;
      const menuData = this.data.menuData;
      const dataList = menuData[type];
      const item = dataList.find(item => item.name == id);
      if (!item.count) {
        item.count = 1;
      } else {
        item.count++;
      };
      const addName = item.name;
      const orderList = this.data.orderList;
      console.log('item.count',item.count);
      const orderItem = orderList.find(item => item.name === addName);
      if (!orderItem) {
        orderList.push(item);
      } else {
        orderItem.count = item.count;
      }
      this.triggerEvent('updateOrderList',orderList); 
      this.triggerEvent('updateMenuData',menuData); 

      // this.setData({
      //   menuData,
      //   orderList
      // })
    },

    minus(e) {
      const {
        id,
        type
      } = e.currentTarget.dataset;
      const menuData = this.data.menuData;
      const dataList = menuData[type];
      const item = dataList.find(item => item.name == id);
      if (!item.count) {
        item.count = 0;
      } else {
        item.count--;
      }
      let orderList = this.data.orderList;
      if (!item.count) {
        const deleteName = item.name;
        orderList = orderList.filter(item => item.name !== deleteName)
      }
      this.triggerEvent('updateOrderList',orderList); 
      this.triggerEvent('updateMenuData',menuData); 

      // this.setData({
      //   menuData,
      //   orderList
      // })

    },

    edit(e) {
      console.log('edit',e);
      console.log('menuData',this.data.menuData)
      const { dish } = e.currentTarget.dataset;
      // 触发父组件的编辑事件
      this.triggerEvent('editDish', dish);
      // const dishId = e.currentTarget.dataset.dishId;
      // wx.navigateTo({
      //   url: `/pages/editDish/index?dishId=${dishId}`,
      // })
    },
    showAddDishModal() {
      this.triggerEvent('showAddDishModal'); 
    },
    async delete(e) {
      wx.showModal({
        title: '确认删除吗',
        content: '删除后不可恢复',
        success: async(res) => {
          if (res.confirm) {
            const dishId = e.currentTarget.dataset.dishId;
            const result = await deleteDish(dishId);
            console.log('子组件updateMenuData');
            this.triggerEvent('updateMenuData'); 
            this.setData({
              activeIndex: 0
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

  }
});
