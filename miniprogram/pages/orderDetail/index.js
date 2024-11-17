const {
  envList
} = require("../../envList");
import {
  fetchOrder
} from '../../fetch/order';

Page({
  data: {
    dishList: [],
  },

  async onLoad(e) {
    console.log('onload',e);
    const { orderId } = e;
    const fetchOrderData = await fetchOrder(orderId);
    const dishes= fetchOrderData?.result?.data?.dishes;
    console.log('dishes',dishes);
    this.setData({dishList:dishes})
  },


});
