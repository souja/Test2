const app = getApp()
const api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vCode: null,
    phone: null,
    userinfo: {},
    disabled: false,
    time: '发送验证码', //倒计时 
    currentTime: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var phone = options.phone;
    console.log("verify-phone:" + phone);
    this.setData({
      phone: phone
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    this.getVerificationCode()
  },

  //发送验证码倒计时
  calcGetCodeTime: function(options) {

    var that = this;
    var currentTime = that.data.currentTime;

    that.setData({
      time: currentTime + '秒后可重发'
    });

    var interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒后可重发'
      });
      if (currentTime <= 0) {
        clearInterval(interval);
        that.setData({
          time: '发送验证码',
          currentTime: 60,
          disabled: false
        });
      }
    }, 1000);

  },

  //发送验证码
  getVerificationCode: function(e) {
    var phone = this.data.phone;

    //点击后先Disable验证码按钮
    this.setData({
      disabled: true
    })
    api._post(app.urls.sendVerifyCode).then(res => {
      console.log(JSON.stringify(res));
      console.log(res);
      if (res.status == 200) {
        this.calcGetCodeTime();
      }
    }).catch(e => {
      app.toast(JSON.stringify(e));
      console.log(e);
      // app.toast(e.data.errmsg);
      //恢复验证码按钮
      this.setData({
        disabled: false
      })
    })
  },
  syncCode: function(e) {
    console.log(e)
    this.setData({
      vCode: e.detail.value
    })
  },
  //校验 验证码
  doReg: function() {
    api._post(app.urls.verifyCode, {
      mobileCode: this.data.vCode
    }).then(res => {

      console.log(res);
      if (res.status == 200) {
        this.linkWithPaires()
      }
    }).catch(e => {
      console.log(e);
      app.toast(e.data.errmsg);
    })
  },
  linkWithPaires: function() {
    api._post(app.urls.bindAccount, {
      code: app.globalData.wxCode
    }).then(res => {
      console.log(res);
      if (res.status == 200) {
        wx.reLaunch({
          url: '../mine/mine'
        });
      }
    }).catch(e => {
      console.log(e);
      app.toast(e.data.errmsg);
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})