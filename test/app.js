App({
  urls: {
    //发送验证码
    sendVerifyCode: '/user/requestMobilePhoneVerify',
    //校验验证码
    verifyCode: '/user/verifyMobilePhone',
    //注册
    signUp: '/user/signup',
    //获取用户信息
    getUserInfo: '/user/info',
    //退出登录
    logout: '/user/logout',
    //使用手机号密码登录
    loginWithPhonePwd: '/user/logInWithMobilePhone',
    //在小程序中将微信账号与当前登录的paires账号绑定
    bindAccount: '/user/linkWithWeapp',
    //获取个人资料
    getPUserinfo: '/pairesUserInfo',
    //更新用户信息
    updateUserInfo: '/pairesUserInfo/update',
    //搜索订单
    searchOrder: '/pairesBooking/search',
    //正在确认订单列表
    confirmingOrderList: '/pairesBooking/confirmingList',
    //微信小程序内支付
    requestPay: '/pairesBooking/wxmpPay'
  },
  validatemobile: function(mobile) {
    if (!mobile || mobile.length == 0) {
      this.toast('请输入手机号')
      return false;
    }
    if (mobile.length != 11) {
      this.toast('手机号长度有误')
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      this.toast('请输入正确的手机号')
      return false;
    }
    return true;
  },
  toDate: function(dateString) {
    var DATE_REGEXP = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*");
    if (DATE_REGEXP.test(dateString)) {
      var timestamp = dateString.replace(DATE_REGEXP, function($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
        var date = new Date($year, $month, $day, $hour || "00", $minute || "00", $second || "00", $milliscond || "00");
        return date.getTime();
      });
      var date = new Date();
      date.setTime(timestamp);
      return date;
    }
    return null;
  },
  calcRentDays: function(indate, outdate) {
    var date1 = app.toDate(indate);
    var date2 = app.toDate(outdate);

    //时间差的毫秒数
    var date3 = date2.getTime() - date1.getTime();
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
  },
  calcDays: function(indate, outdate) {
    //时间差的毫秒数
    var date3 = outdate.getTime() - indate.getTime();
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    return days;
  },
  getNowFormatDate: function() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  toast: function(e) {
    wx.showModal({
      title: '',
      content: e,
      showCancel: false, //不显示取消按钮
      confirmText: '确定'
    })
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          this.globalData.wxCode = res.code;
          console.log("wxCode:" + this.globalData.wxCode);
          console.log("wx.login登录成功")
          console.log('需要发送 res.code 到后台换取 openId, sessionKey, unionId');

        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //获取总页数
  getTotalPageNum: function(totalRecord, pageSize) {
    console.log(totalRecord + "/" + pageSize)
    return Math.ceil(totalRecord / pageSize);
  },
  globalData: {
    wxCode: null, //登录微信后拿到的code
    userInfo: null //微信用户信息
  },
  pUserInfo: null, //Paires用户信息
  curOrder: null
})