const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { menuId } = event.param;
  
  try {
    // 使用事务确保两个操作都成功
    const transaction = await db.startTransaction();
    
    try {
      // 先删除所有关联的菜品
      await transaction.collection('dishes')
        .where({ menuId })
        .remove();
      
      // 再删除菜单本身
      await transaction.collection('menus')
        .doc(menuId)
        .remove();
      
      // 提交事务
      await transaction.commit();
      
      return {
        success: true,
        message: '删除成功'
      };
    } catch (err) {
      // 如果出错，回滚事务
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error('删除菜单失败:', err);
    return {
      success: false,
      message: '删除失败',
      error: err
    };
  }
};

