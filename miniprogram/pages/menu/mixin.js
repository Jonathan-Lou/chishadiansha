
const fetchMenu = async () => {
  const res = await wx.cloud.callFunction({
    name:'quickstartFunctions',
    data:{ type: 'fetchMenu' }
  })
  return res;
}

module.exports = {
  fetchMenu
}