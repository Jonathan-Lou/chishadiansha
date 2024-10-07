const {
  envList
} = require("../../envList");
import { getOpenId } from '../../common/index';
import {
  fetchOrder
} from '../../fetch/order';
import { userRegister } from '../../common/index'

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
