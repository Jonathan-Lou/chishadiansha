const createOrder = async (orderId,dishes,openId) => {
  const data = await wx.cloud.callFunction({
    name: 'orderFunctions',
    data: {
      type: 'createOrder',
      param: {
        orderId,
        dishes,
        openId,
        type:'self'
      }
    }
  })
  return data;
};

const fetchOrder = async (orderId) => {
  const data = await wx.cloud.callFunction({
    name: 'orderFunctions',
    data: {
      type: 'fetchOrder',
      param: {
        orderId,
      }
    }
  })
  return data;
}

const fetchOrderList = async (openId) => {
  const data = await wx.cloud.callFunction({
    name: 'orderFunctions',
    data: {
      type: 'fetchOrderList',
      param: {
        openId,
      }
    }
  })
  return data;
}


module.exports = {
  createOrder,
  fetchOrder,
  fetchOrderList
}
