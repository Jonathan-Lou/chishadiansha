const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const result =  await db.collection('menus').where({ menuId : '123'}).get().then( res => {
    console.log('res11',res);
    return res;
  });
  console.log('datadata',result);
  return result.data[0].menu
  // return {
  //   dataList: [
  //     { type: '蔬菜', name: '清炒时蔬', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '荤菜', name: '红烧肉', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '荤菜', name: '梭子蟹', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '香蕉', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '苹果', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '西柚', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '梨', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '芒果', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '桃子', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '哈密瓜', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '西瓜', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //     { type: '水果', name: '西红柿', desc: '这是一段备注',img:'https://img.88tph.com/production/20180629/12591610-1.jpg%21/watermark/url/L3BhdGgvbG9nby5wbmc/align/center' },
  //   ],
  // }
};