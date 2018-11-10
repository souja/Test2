const app = getApp()
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    pwd: null,
    userinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
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
    var puinfo = wx.getStorage({
      key: 'puinfo',
      success: function(res) {
        console.log(res.data);
        app.pUserInfo = JSON.parse(res.data);
        wx.navigateBack({
          delta: 1
        });
      }
    })
  },
  //输入手机号
  setupPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //输入密码
  setupPwd: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  //跳转‘忘记密码’页面
  forgetPwd: function(e) {
    wx.navigateTo({
      url: '../findPwd/findPwd'
    });
  },
  //跳转注册页面
  goRegister: function(e) {
    wx.navigateTo({
      url: '../register/register'
    });
  },
  //登录
  sendLogin: function(e) {
    //检查输入
    var phone = this.data.phone;
    if (!app.validatemobile(phone)) return;
    var passwd = this.data.pwd;
    if (!passwd) {
      app.toast("请输入密码");
      return;
    }
    if (passwd.length < 6) {
      app.toast("密码不能少于6位");
      return;
    }
    var header = {
      'content-type': 'application/json'
    };

    //发送登录请求
    api._post(app.urls.loginWithPhonePwd, {
      mobile: phone,
      password: passwd
    }).then(res => {
      console.log(res);
      console.log(res.header);
      if (res.status == 200) {
        app.pUserInfo = res.data;
        wx.setStorage({
          key: "puinfo",
          data: JSON.stringify(res.data)
        })

        if (app.pUserInfo.mobileVerified)//已验证手机号
          wx.reLaunch({
            url: '../mine/mine',
          });
        else
          wx.redirectTo({
            url: '../finishRegister/finishRegister?phone=' + app.pUserInfo.mobile
          })
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