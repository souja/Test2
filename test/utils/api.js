// 导入cookie类
const setCookieTool = require('./set-cookie.js');

const baseUrl = 'https://bapi.pairesco.com';

/**
 * cookie持久化,会用cookies覆盖所有数据
 */
const saveCookie = (cookies) => {
  wx.setStorageSync('paires_cookie', cookies);
}

/**
 * 从持久化数据中返回cookie
 */
const queryCookie = () => {
  return wx.getStorageSync('paires_cookie');
}

const isEmpty = (obj) => {
  for (var name in obj) {
    return false;
  }
  return true;
}

/**
 * 检查cookie是否过期（内部）
 * 返回过滤后的cookies
 */
const checkExpires = (cookies) => {
  if (!cookies) {
    cookies = queryCookie();
  }
  var now = new Date();
  var newCookies = {};

  for (var i in cookies) {
    var exp = new Date(cookies[i].expires);
    if (exp > now) {
      newCookies[i] = (cookies[i]);
    }
  }

  return newCookies;
}

const setCookieByHead = (head) => {
  if (head && head['Set-Cookie']) {
    console.log('当前请求返回的cookie:' + head['Set-Cookie']);
    setCookie(head['Set-Cookie']);
  }
}

const setCookie = (str) => {
  // 处理参数
  var splitCookieHeaders = setCookieTool.splitCookiesString(str);
  var cookies = setCookieTool.parse(splitCookieHeaders);

  // 获取本地的cookie
  var localCookie = queryCookie();

  // 循环处理 数组
  cookies.forEach((c) => {
    localCookie[c.name] = c;
  });

  // 过滤
  localCookie = checkExpires(localCookie);

  // 持久化cookies
  saveCookie(localCookie);
}

/**
 * 获取请求用的cookie字符串
 */
const getCookieForReq = () => {
  // 获取本地的cookie
  var localCookie = queryCookie();
  // 过滤
  localCookie = checkExpires(localCookie);
  // 持久化cookies
  saveCookie(localCookie);
  // 返回
  var rs = '';
  for (var i in localCookie) {
    var c = localCookie[i];
    rs += (c.name + "=" + c.value + "; ");
  }

  // 处理末端
  if (rs.substr(rs.length - 2, 2) == '; ') {
    rs = rs.substr(0, rs.length - 2);
  }

  return rs;
}

const http = ({
  url = '',
  param = {},
  ...other
} = {}) => {
  wx.showLoading({
    title: '数据加载中...'
  });
  var header = {
    'content-type': 'application/json'
  };
  let timeStart = Date.now();

  var cookie = getCookieForReq();
  if (cookie)
    header['Cookie'] = cookie;

  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: header,
      ...other,
      complete: (res) => {
        wx.hideLoading();
        setCookieByHead(res.header);
        console.log('耗时' + (Date.now() - timeStart));
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url;
  }
  return url
}

// get方法
const _get = (url, param = {}) => {
  console.log(url);
  console.log(param);
  return http({
    url,
    param,
    method: 'GET'
  })
}

const _post = (url, param = {}) => {
  console.log(url);
  console.log(param);
  return http({
    url,
    param,
    method: 'POST'
  })
}

const _put = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'PUT'
  })
}

const _delete = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'PUT'
  })
}
module.exports = {
  baseUrl,
  _get,
  _post,
  _put,
  _delete,
  isEmpty
}