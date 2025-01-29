const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV});

const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  const { openId,menuId,menuName } = param;
  console.log('collectMenu--openId',openId);
  try {
    const user = await db.collection('user').doc(openId).get();
    console.log('user-------',user);
    const userCollection = user.data.collectedMenus || [];
    const exists = userCollection.some(menu => menu.menuId === menuId);
    console.log('exists',exists);
    if(!exists) {
      userCollection.push({menuId,menuName});
      await db.collection('user').doc(openId).update({
        data: {
          userCollection
        }
      });
    }else {
      console.log('该菜单已经被收藏');
    }
    return true;
  } catch(e) {
   return false;
  }

  
}

