const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();
exports.main = async (event, context) => {
  const param = event.param;
  const { menu,id } = param;
  db.collection('menus').doc(id).update({
    data: {
      menu
    },
}).then(res => {console.log('updata res',res)})
}

