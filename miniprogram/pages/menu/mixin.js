
const fetchMenu = async (id) => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'fetchMenu',param:{id} }
  })
  return res;
}

module.exports = {
  fetchMenu
}