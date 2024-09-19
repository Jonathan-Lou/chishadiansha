
const fetchMenu = async (id) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'fetchMenu',param:{id} }
  })
  return res;
};

const fetchDishes = async (menuId) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'fetchDishes',param:{menuId} }
  })
  
  return res;
};
const fetchMenuList = async (openid) => {
  const res = await wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: {
      type: 'fetchMenuList',
      param: {
        openid
      }
    }
  })
  return res;
}

module.exports = {
  fetchMenu,
  fetchDishes,
  fetchMenuList
}