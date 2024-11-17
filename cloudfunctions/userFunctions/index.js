const collectMenu = require('./collectMenu/index');
const fetchUser = require('./fetchUser/index');
const createUser = require('./createUser/index');
const getOpenId = require('./getOpenId')


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'collectMenu':
      return await collectMenu.main(event, context);
      case 'fetchUser':
        return await fetchUser.main(event, context);
        case 'createUser':
          return await createUser.main(event, context);
        case 'getOpenId':
          return await getOpenId.main(event.context);
  }
};
