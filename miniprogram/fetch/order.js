const createOrder = async (orderId,dishes,openId) => {
  const data = await wx.cloud.callFunction({
    name: 'orderFunctions',
    data: {
      type: 'createOrder',
      param: {
        orderId,
        dishes,
        openId
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


module.exports = {
  createOrder,
  fetchOrder
}
