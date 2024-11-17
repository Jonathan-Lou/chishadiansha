import {
  fetchOrderList
} from '../../fetch/order';
import {
  getOpenId
} from '../../common/index';
import { formatDate } from '../../common/utils';

Page({
  data: {
    orderList: []
  },

  async onLoad() {
    // this.fetchGoodsList();
    const openId = await getOpenId();
    const orderListRes = await fetchOrderList(openId);
    console.log('orderListRes',orderListRes);
    const orderList = orderListRes?.result?.data;
    orderList.map(item => {
      const {createTime} = item;
      if(createTime) {
        item.createTime = formatDate(createTime);
      };
    })
    this.setData({
      orderList
    })

  },

  goToDetail(e) {
    console.log('eee',e);
    const { orderId,type,sharedId } = e.currentTarget.dataset;
    console.log('typetype',type);
    if(type === 'shared') {
      wx.navigateTo({
        url: `/pages/sharedMenu/index?sharedId=${sharedId}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/orderDetail/index?orderId=${orderId}`,
      })
    }
 
  }
});
