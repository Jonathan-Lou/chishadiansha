const getOpenId = require('./getOpenId/index');
const getMiniProgramCode = require('./getMiniProgramCode/index');
const createCollection = require('./createCollection/index');
const updateRecord = require('./updateRecord/index');
const fetchGoodsList = require('./fetchGoodsList/index');
const genMpQrcode = require('./genMpQrcode/index');
const fetchMenu = require('./fetchMenu/index');
const uploadMenu = require('./uploadMenu/index');
const createMenu = require('./createMenu/index');
const fetchMenuList = require('./fetchMenuList/index');
const createDish = require('./createDish/index');
const fetchDishes = require('./fetchDishes/index');
const fetchDish = require('./fetchDish/index');
const deleteDish = require('./deleteDish/index')
const updateDish = require('./updateDish/index')
const deleteMenu = require('./deleteMenu/index')
const createSharedMenu = require('./createSharedMenu/index')
const submitOrder = require('./submitOrder/index');
const fetchSharedDishes = require('./fetchSharedDishes/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'getMiniProgramCode':
      return await getMiniProgramCode.main(event, context);
    case 'createCollection':
      return await createCollection.main(event, context);
    case 'updateRecord':
      return await updateRecord.main(event, context);
    case 'fetchGoodsList':
      return await fetchGoodsList.main(event, context);
    case 'fetchMenu':
      return await fetchMenu.main(event, context);
    case 'fetchMenuList':
      return await fetchMenuList.main(event, context);
    case 'uploadMenu':
      return await uploadMenu.main(event, context);
    case 'genMpQrcode':
      return await genMpQrcode.main(event, context);
    case 'createMenu':
      return await createMenu.main(event, context);
    case 'createDish':
      return await createDish.main(event, context);
    case 'fetchDishes':
      return await fetchDishes.main(event, context);
    case 'fetchDish':
      return await fetchDish.main(event, context);
    case 'deleteDish':
      return await deleteDish.main(event, context);
    case 'deleteMenu':
      return await deleteMenu.main(event, context);
    case 'updateDish':
      return await updateDish.main(event, context);
    case 'createSharedMenu':
      return await createSharedMenu.main(event, context);
    case 'submitOrder':
      return await submitOrder.main(event, context);
    case 'fetchSharedDishes':
      return await fetchSharedDishes.main(event, context);
  }
};
