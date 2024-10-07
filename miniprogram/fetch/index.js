const fetchMenu = async (id) => {
  const res = await wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: {
      type: 'fetchMenu',
      param: {
        id
      }
    }
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
};
const fetchDishes = async (menuId) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'fetchDishes',param:{menuId} }
  })
  return res;
};

const fetchDish = async (dishId) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'fetchDish',param:{dishId} }
  })
  return res;
};
const deleteMenu = async (menuId) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'deleteMenu',param:{menuId} }
  })
  return res;
};

const deleteDish = async (dishId) => {
  console.log('deleteDish',dishId);
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'deleteDish',param:{dishId} }
  })
  return res;
};

const updateDish = async (dishData) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'updateDish',param:dishData }
  });
  return res;
};

const createSharedMenu = async (sharedId) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'createSharedMenu',param:{sharedId} }
  });
  return res;
};

const submitOrder = async (sharedId,dishes) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'submitOrder',param:{sharedId,dishes} }
  });
  return res;
}

const fetchSharedDishes = async (sharedId) => {
  console.log('sharedId2',sharedId);
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'fetchSharedDishes',param:{ sharedId } }
  });
  return res;
}

const collectMenu = async (openId,menuId,menuName) => {
  const res = await wx.cloud.callFunction({
    name:'userFunction',
    data:{ type: 'collectMenu',param:{ openId,menuId,menuName } }
  });
  return res;
}

const fetchUser = async (openId) => {
  const res = await wx.cloud.callFunction({
    name:'userFunction',
    data:{ type: 'fetchUser',param:{ openId } }
  });
  return res;
}

const createUser = async (openId,userName) => {
  const res = await wx.cloud.callFunction({
    name:'userFunction',
    data:{ type: 'createUser',param:{ openId,userName } }
  });
  return res;
}

const fetchOpenId = async () => {
  const data = await wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: {
      type: 'getOpenId'
    }
  })
  const openId = data.result.openid;
  return openId;
};

module.exports = {
  fetchMenu,
  fetchMenuList,
  fetchDishes,
  fetchDish,
  deleteMenu,
  deleteDish,
  updateDish,
  createSharedMenu,
  submitOrder,
  fetchSharedDishes,
  collectMenu,
  fetchUser,
  createUser,
  fetchOpenId,
}
