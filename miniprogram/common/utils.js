/**
 * 时间戳转年月日
 */
const formatDate = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const formatResult = `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
  return formatResult;
}
module.exports = {
  formatDate
}