export function debounce(func, delay=100) {
  let timer = null;

  return function(...args) {
    //第n次进入这个函数时，发现n-1次的timer还没走完，那么从新计时
    if(timer) {
      clearTimeout(timer);
    }
    //当setTimeout执行完时，会返回null。如果有具体返回值，说明定时器还没走里面的方法
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

  // 时间戳转化
  // new Date(value * 1000).toLocaleString()  // 返回值的格式为 yyyy/MM/dd 下午 hh:mm:ss
export function formatDate(date, fmt) {
  // 1.获取年份 y+ 一个或多个y，正则表达式：匹配字符串
  if(/(y+)/.test(fmt)) {
    // RegExp.$1 即匹配到的/(y+)/字符串，将其替换为逗号后的(date.getFullYear() + '')...
    // (date.getFullYear() + '')是将时间加上一个空串，将数值转化为字符串
    // substr截取字符串，截取的个数为 4-匹配的字符串的长度，如果匹配的字符串为2019，则不截取，显示2019
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

// 不足两位则要补齐两位： 01：02
// 如果传入的str为 04，则执行 0004.substr(2) -> 04
// if str = 4  -> 004.sbustr(1)  ->  04
function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}